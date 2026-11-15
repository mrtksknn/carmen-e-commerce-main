/**
 * Search-engine data shared by the running site (React) and the build-time
 * page generator (scripts/prerender.mjs). Plain JavaScript with no browser or
 * React dependencies, so Node can import it too.
 */

import { localizePath } from './i18n-paths.mjs';

export const SITE_NAME = 'Piece Of Oblivion';
export const ARTIST_NAME = 'Beliz Keskin';
export const DEFAULT_SITE_URL = 'https://mrtksknn.github.io/carmen-e-commerce-main';
export const OG_IMAGE_PATH = '/og-image.png';
export const ARTWORK_ROUTE = '/eser';

/** Site URL without a trailing slash. */
export const normalizeSiteUrl = (url) => String(url || DEFAULT_SITE_URL).replace(/\/+$/, '');

/**
 * Absolute URL for a path on the site ("/" → site root). A trailing slash is
 * kept when given: the English home is a folder, "/en/".
 */
export const absoluteUrl = (siteUrl, path = '/') => {
  if (/^https?:\/\//i.test(path)) return path;
  const base = normalizeSiteUrl(siteUrl);
  const raw = `/${String(path).replace(/^\/+/, '')}`;
  const keepSlash = raw.length > 1 && raw.endsWith('/');
  const clean = raw.replace(/\/+$/, '');
  if (clean === '') return `${base}/`;
  return `${base}${clean}${keepSlash ? '/' : ''}`;
};

// ── Readable artwork addresses ───────────────────────────────────────────
const TR_MAP = { ç: 'c', ğ: 'g', ı: 'i', i̇: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' };

export const slugify = (text) => String(text || '')
  .toLocaleLowerCase('tr')
  .replace(/[çğıöşüâîû]|i̇/g, (ch) => TR_MAP[ch] || ch)
  .normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80) || 'eser';

const timeOf = (p) => {
  const ts = p?.timeStamp;
  if (!ts) return 0;
  if (typeof ts === 'string') return Date.parse(ts) || 0;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (typeof ts.seconds === 'number') return ts.seconds * 1000;
  return 0;
};

/** Newest first, the order the site shows works in. */
export const sortNewestFirst = (products) => [...products].sort((a, b) => timeOf(b) - timeOf(a));

/**
 * id → slug for every work. When two works share a name, the older one keeps
 * the plain slug and the newer one gets a short id suffix, so addresses stay
 * stable as works are added.
 */
export const buildSlugMap = (products) => {
  const map = new Map();
  const used = new Set();
  [...products].sort((a, b) => timeOf(a) - timeOf(b) || String(a.id).localeCompare(String(b.id))).forEach((p) => {
    let slug = slugify(p.name);
    if (used.has(slug)) slug = `${slug}-${String(p.id).slice(0, 6).toLowerCase()}`;
    used.add(slug);
    map.set(p.id, slug);
  });
  return map;
};

/**
 * Link-preview image for a work: the photo through the image CDN as a JPEG,
 * which every preview (WhatsApp, Facebook, X…) accepts and which does not
 * depend on the original host being reachable.
 */
export const artworkShareImage = (url) => (/^https:\/\//i.test(url || '')
  ? `https://wsrv.nl/?${new URLSearchParams({ url, w: '1200', output: 'jpg', q: '85', we: '' })}`
  : url);

/** Accessible description of an artwork image. */
export const artworkAlt = (p) => [p?.name, [ARTIST_NAME, p?.material].filter(Boolean).join(', ')]
  .filter(Boolean).join(' — ');

/** Short description used when the artist has not written one. */
export const artworkDescription = (p, lang = 'tr') => {
  if (p?.description && p.description.trim()) return p.description.trim();
  const parts = [p?.material, p?.dimensions].filter(Boolean).join(', ');
  const lead = `${p?.name || (lang === 'en' ? 'Artwork' : 'Eser')} — ${ARTIST_NAME}${parts ? `. ${parts}` : ''}.`;
  return lang === 'en'
    ? `${lead} An original, one of a kind and signed; shipped worldwide with a certificate of authenticity.`
    : `${lead} Tek ve özgün eser; imzalı, özgünlük sertifikasıyla birlikte dünyanın her yerine gönderilir.`;
};

// ── Structured data (schema.org) ─────────────────────────────────────────
export const personSchema = (siteUrl, lang = 'tr') => ({
  '@type': 'Person',
  '@id': `${absoluteUrl(siteUrl, '/about')}#artist`,
  name: ARTIST_NAME,
  jobTitle: lang === 'en' ? 'Painter' : 'Ressam',
  birthPlace: { '@type': 'Place', name: 'Ankara' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Gazi Üniversitesi' },
  url: absoluteUrl(siteUrl, '/about'),
});

export const organizationSchema = (siteUrl) => ({
  '@type': 'Organization',
  '@id': `${absoluteUrl(siteUrl, '/')}#organization`,
  name: SITE_NAME,
  url: absoluteUrl(siteUrl, '/'),
  logo: absoluteUrl(siteUrl, OG_IMAGE_PATH),
  founder: { '@id': `${absoluteUrl(siteUrl, '/about')}#artist` },
});

export const websiteSchema = (siteUrl) => ({
  '@type': 'WebSite',
  '@id': `${absoluteUrl(siteUrl, '/')}#website`,
  name: SITE_NAME,
  url: absoluteUrl(siteUrl, '/'),
  inLanguage: ['tr-TR', 'en-GB'],
  publisher: { '@id': `${absoluteUrl(siteUrl, '/')}#organization` },
});

/** Items use Turkish (root) paths; they are written in the page's language. */
export const breadcrumbSchema = (siteUrl, items, lang = 'tr') => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    item: absoluteUrl(siteUrl, localizePath(it.path, lang)),
  })),
});

/** An artwork. Prices are never published, so this is VisualArtwork, not Product. */
export const artworkSchema = (siteUrl, p, path, lang = 'tr') => ({
  '@type': 'VisualArtwork',
  name: p.name,
  url: absoluteUrl(siteUrl, path),
  image: [p.img, p.img2, p.img3].filter(Boolean),
  description: artworkDescription(p, lang),
  creator: { '@id': `${absoluteUrl(siteUrl, '/about')}#artist`, '@type': 'Person', name: ARTIST_NAME },
  ...(p.material ? { artMedium: p.material } : {}),
  ...(p.dimensions ? { size: p.dimensions } : {}),
  artEdition: 1,
});

/** Wraps one or more schema objects into a single JSON-LD document. */
export const jsonLd = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes.flat().filter(Boolean) });
