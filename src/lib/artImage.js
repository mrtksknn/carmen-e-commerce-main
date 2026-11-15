/**
 * Artwork images are stored on ImgBB (i.ibb.co). Some networks and devices get
 * a "Service Unavailable" response from that host instead of the picture, so
 * every remote artwork image is served through the wsrv.nl image CDN
 * (Cloudflare-backed, caches the original once and serves it from the edge).
 * It also returns a width-matched WebP, which makes the pages lighter.
 *
 * Fallback chain: CDN -> second CDN hostname -> original URL. If all of them
 * fail, the image is hidden so the frame's own surface shows instead of a
 * broken-image icon.
 */

const CDN_HOSTS = ['https://wsrv.nl/', 'https://images.weserv.nl/'];
const WIDTHS = [480, 800, 1200, 1600, 2400];

const isRemote = (url) => typeof url === 'string' && /^https:\/\//i.test(url);

const cdnUrl = (url, width, host = CDN_HOSTS[0]) => {
  const params = new URLSearchParams({
    url,
    w: String(width),
    output: 'webp',
    q: '82',
    we: '', // never upscale beyond the original
    default: url, // if the CDN cannot fetch the original, it redirects to it
  });
  return `${host}?${params.toString()}`;
};

const srcSetFor = (url, maxWidth, host) =>
  WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${cdnUrl(url, w, host)} ${w}w`)
    .join(', ');

const handleError = (event) => {
  const img = event.currentTarget;
  const original = img.dataset.original;
  const step = Number(img.dataset.step || 0);
  if (!original) return;

  if (step === 0) {
    // Second CDN hostname
    img.dataset.step = '1';
    const maxWidth = Number(img.dataset.maxw || 1600);
    img.srcset = srcSetFor(original, maxWidth, CDN_HOSTS[1]);
    img.src = cdnUrl(original, Math.min(1200, maxWidth), CDN_HOSTS[1]);
  } else if (step === 1) {
    // The original host itself
    img.dataset.step = '2';
    img.removeAttribute('srcset');
    img.src = original;
  } else {
    img.dataset.step = '3';
    img.style.visibility = 'hidden';
  }
};

/**
 * Props for an <img> showing a stored artwork image.
 *   <img {...artImage(artwork.img, { sizes: '(min-width: 768px) 33vw, 100vw' })} alt="…" />
 * `sizes` describes how wide the image is drawn; `maxWidth` caps the largest
 * file requested (use 2400 for the full-screen viewer).
 */
export const artImage = (url, { sizes = '100vw', maxWidth = 1600 } = {}) => {
  if (!isRemote(url)) return { src: url || undefined };
  return {
    src: cdnUrl(url, Math.min(1200, maxWidth)),
    srcSet: srcSetFor(url, maxWidth),
    sizes,
    onError: handleError,
    'data-original': url,
    'data-maxw': maxWidth,
  };
};

/** A single CDN URL (for places that need a plain URL, such as og:image). */
export const artImageUrl = (url, width = 1200) => (isRemote(url) ? cdnUrl(url, width) : url);
