/**
 * Runs after `vite build`. Writes a static HTML file for every public page so
 * search engines and link previews get the real title, description, image,
 * structured data and text without running JavaScript, and so GitHub Pages
 * answers those addresses with 200 instead of 404.
 *
 * Turkish pages at the root, the same pages in English under en/:
 *   index.html, en/index.html                 home
 *   products.html, en/products.html           all works
 *   collections.html, collections/<room>.html gallery and its rooms
 *   about.html, contact.html                  artist, contact
 *   eser/<slug>.html, en/artwork/<slug>.html  each work (from Firestore)
 *   product/<id>.html                         old addresses → redirect to the new one
 *   sitemap.xml, robots.txt
 *
 * The React app still starts as usual and replaces the static content.
 * The catalogue is read from Firestore's public REST API at build time, so
 * new works appear after the next build (see .github/workflows/deploy.yml).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ARTIST_NAME, ARTWORK_ROUTE, DEFAULT_SITE_URL, OG_IMAGE_PATH, SITE_NAME,
  absoluteUrl, artworkAlt, artworkDescription, artworkSchema, breadcrumbSchema,
  artworkShareImage, buildSlugMap, jsonLd, normalizeSiteUrl, organizationSchema, personSchema,
  slugify, sortNewestFirst, websiteSchema,
} from '../src/lib/seo-data.mjs';
import { HTML_LANG, LANGS, OG_LOCALE, localizePath } from '../src/lib/i18n-paths.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'build');

// ── Environment (.env locally, repository secrets in CI) ────────────────
const loadDotEnv = () => {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
};
loadDotEnv();

const SITE_URL = normalizeSiteUrl(process.env.VITE_SITE_URL || DEFAULT_SITE_URL);
const BASE_PATH = new URL(SITE_URL).pathname.replace(/\/+$/, ''); // "" on a custom domain
const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;
const API_KEY = process.env.VITE_FIREBASE_API_KEY;

// ── Helpers ──────────────────────────────────────────────────────────────
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c');
const cdn = (url, w = 1200) => (/^https:\/\//.test(url || '')
  ? `https://wsrv.nl/?${new URLSearchParams({ url, w: String(w), output: 'webp', q: '82', we: '', default: url })}`
  : url);

const fromFirestore = (v) => {
  if (!v || typeof v !== 'object') return null;
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('timestampValue' in v) return v.timestampValue;
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFirestore);
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fromFirestore(x)]));
  return null;
};

const fetchCollection = async (name) => {
  const docs = [];
  let pageToken = '';
  do {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${name}`
      + `?pageSize=300&key=${API_KEY}${pageToken ? `&pageToken=${pageToken}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Firestore ${name}: HTTP ${res.status}`);
    const body = await res.json();
    for (const d of body.documents || []) {
      docs.push({ id: d.name.split('/').pop(), ...Object.fromEntries(Object.entries(d.fields || {}).map(([k, v]) => [k, fromFirestore(v)])) });
    }
    pageToken = body.nextPageToken || '';
  } while (pageToken);
  return docs;
};

// ── Languages ────────────────────────────────────────────────────────────
const LOCALES = Object.fromEntries(LANGS.map((l) => [l, JSON.parse(fs.readFileSync(path.join(ROOT, `src/locales/${l}.json`), 'utf8'))]));

// sitemap.xml and robots.txt are written on every build. On github.io the
// robots.txt sits in a sub-folder, where search engines do not read it; it
// takes effect once the site is served from its own domain.
const IS_OWN_DOMAIN = !!process.env.VITE_SITE_URL && !/\.github\.io$/i.test(new URL(SITE_URL).hostname);

// ── Head tags (mirrors src/components/SEO.jsx; data-rh lets Helmet take them over) ──
const headTags = ({ lang, rootPath, title, description, image, imageAlt, type = 'website', schema, noindex = false }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = absoluteUrl(SITE_URL, localizePath(rootPath, lang));
  const img = absoluteUrl(SITE_URL, image || OG_IMAGE_PATH);
  const alt = imageAlt || SITE_NAME;
  const alternates = LANGS.map((l) => `<link data-rh="true" rel="alternate" hreflang="${l}" href="${esc(absoluteUrl(SITE_URL, localizePath(rootPath, l)))}" />`);
  const tags = [
    `<title>${esc(fullTitle)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(description)}" />`,
    `<meta data-rh="true" name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
    ...(noindex ? [] : [
      `<link data-rh="true" rel="canonical" href="${esc(canonical)}" />`,
      ...alternates,
      `<link data-rh="true" rel="alternate" hreflang="x-default" href="${esc(absoluteUrl(SITE_URL, localizePath(rootPath, 'tr')))}" />`,
    ]),
    `<meta data-rh="true" property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta data-rh="true" property="og:locale" content="${OG_LOCALE[lang]}" />`,
    ...LANGS.filter((l) => l !== lang).map((l) => `<meta data-rh="true" property="og:locale:alternate" content="${OG_LOCALE[l]}" />`),
    `<meta data-rh="true" property="og:type" content="${type}" />`,
    `<meta data-rh="true" property="og:title" content="${esc(fullTitle)}" />`,
    `<meta data-rh="true" property="og:description" content="${esc(description)}" />`,
    `<meta data-rh="true" property="og:url" content="${esc(canonical)}" />`,
    `<meta data-rh="true" property="og:image" content="${esc(img)}" />`,
    `<meta data-rh="true" property="og:image:alt" content="${esc(alt)}" />`,
    `<meta data-rh="true" name="twitter:card" content="summary_large_image" />`,
    `<meta data-rh="true" name="twitter:title" content="${esc(fullTitle)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${esc(description)}" />`,
    `<meta data-rh="true" name="twitter:image" content="${esc(img)}" />`,
    `<meta data-rh="true" name="twitter:image:alt" content="${esc(alt)}" />`,
    schema ? `<script data-rh="true" type="application/ld+json">${safeJson(schema)}</script>` : '',
  ];
  return tags.filter(Boolean).join('\n    ');
};

// Static content shows only if the app has not started after a moment (slow
// network, no JavaScript); crawlers read it from the HTML either way.
const SSR_STYLE = `<style>
      .ssr{max-width:72rem;margin:0 auto;padding:128px 24px 96px;color:#ece6df;font:300 17px/1.7 "DM Sans",system-ui,sans-serif;opacity:0;animation:ssr-in .5s ease 1.6s forwards}
      .ssr h1,.ssr h2,.ssr h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:300;color:#fff;line-height:1.1;margin:0 0 .5em}
      .ssr h1{font-size:clamp(2.6rem,7vw,5rem)}.ssr h2{font-size:2rem;margin-top:1.5em}.ssr h3{font-size:1.5rem}
      .ssr a{color:#f26868}.ssr img{display:block;max-width:100%;height:auto;max-height:80vh;margin:24px 0}
      .ssr ul{list-style:none;padding:0}.ssr li{margin:.4em 0}.ssr dt{color:#9c948c;font-size:13px;letter-spacing:.12em;text-transform:uppercase}.ssr dd{margin:0 0 1em}
      .ssr nav{font-size:14px;margin-bottom:24px}
      @keyframes ssr-in{to{opacity:1}}
    </style>`;

const template = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('build/index.html has no empty #root');

/** "/" → index.html, "/en/" → en/index.html, "/en/products" → en/products.html */
const fileFor = (route) => {
  if (route === '/') return path.join(OUT, 'index.html');
  if (route.endsWith('/')) return path.join(OUT, route, 'index.html');
  // "/products" → products.html: GitHub Pages and Cloudflare Pages both serve it at
  // /products (a products/ folder would be redirected to /products/ instead)
  return path.join(OUT, `${route}.html`);
};

const writePage = (lang, route, head, body) => {
  const html = template
    .replace(/<html lang="[^"]*">/, `<html lang="${HTML_LANG[lang]}">`)
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta\s+name="description"[\s\S]*?\/>/, '')
    .replace('</head>', `    ${head}\n    ${SSR_STYLE}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"><main class="ssr">${body}</main></div>`);
  const file = fileFor(route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

// ── Build ────────────────────────────────────────────────────────────────
const main = async () => {
  let products = [];
  try {
    if (!PROJECT_ID || !API_KEY) throw new Error('VITE_FIREBASE_PROJECT_ID / VITE_FIREBASE_API_KEY missing');
    products = sortNewestFirst(await fetchCollection('products'));
  } catch (err) {
    // In CI a failed fetch must stop the deploy rather than publish a site without works
    if (process.env.CI) throw err;
    console.warn(`[prerender] Could not read the catalogue (${err.message}); artwork pages are skipped.`);
  }

  const slugs = buildSlugMap(products);
  const works = products.map((p) => ({ ...p, root: `${ARTWORK_ROUTE}/${slugs.get(p.id)}` }));
  const rooms = new Map();
  works.forEach((p) => { if (p.collections) rooms.set(p.collections, [...(rooms.get(p.collections) || []), p]); });
  const today = new Date().toISOString().slice(0, 10);
  const sitemap = new Map(); // rootPath → { lastmod, images }

  for (const lang of LANGS) {
    const t = LOCALES[lang];
    const href = (rootPath) => `${BASE_PATH}${localizePath(rootPath, lang)}`;
    const home = { name: SITE_NAME, path: '/' };
    const linkList = (items) => `<ul>${items.map((p) => `<li><a href="${href(p.root)}">${esc(p.name)}</a>${p.material ? ` — ${esc(p.material)}` : ''}</li>`).join('')}</ul>`;
    const crumbs = (items) => `<nav aria-label="${lang === 'en' ? 'Breadcrumb' : 'Konum'}">${items.map((c, i) => (i < items.length - 1 ? `<a href="${href(c.path)}">${esc(c.name)}</a> / ` : esc(c.name))).join('')}</nav>`;
    const page = (rootPath, opts, body, extra = {}) => {
      writePage(lang, localizePath(rootPath, lang), headTags({ lang, rootPath, ...opts }), body);
      if (!sitemap.has(rootPath)) sitemap.set(rootPath, { lastmod: extra.lastmod || today, images: extra.images || [] });
    };

    // Home
    page('/', {
      title: t.seo.homeTitle,
      description: t.seo.homeDesc,
      schema: jsonLd(websiteSchema(SITE_URL), organizationSchema(SITE_URL), personSchema(SITE_URL, lang)),
    }, `<h1>${esc(t.landing.heroTitle)} ${esc(t.landing.heroTitleItalic)}</h1>
<p>${esc(t.landing.heroSubtitle)}</p>
<h2>${esc(t.landing.featuredTitle)}</h2>${linkList(works.slice(0, 3))}
<p><a href="${href('/products')}">${esc(t.allProducts.heroTitle)}</a> · <a href="${href('/collections')}">${esc(t.nav.collections)}</a></p>
<h2>${esc(ARTIST_NAME)}</h2><blockquote><p>${esc(t.landing.artistQuote)}</p></blockquote><p>${esc(t.landing.artistBio)}</p>
<p><a href="${href('/about')}">${esc(t.landing.artistCta)}</a></p>`);

    // All works
    page('/products', {
      title: t.seo.productsTitle,
      description: t.seo.productsDesc,
      schema: jsonLd(breadcrumbSchema(SITE_URL, [home, { name: t.seo.productsTitle, path: '/products' }], lang)),
    }, `${crumbs([home, { name: t.allProducts.heroTitle, path: '/products' }])}
<h1>${esc(t.allProducts.heroTitle)}</h1><p>${esc(t.allProducts.heroSubtitle)}</p>${linkList(works)}`);

    // Gallery, then one page per room
    const roomLinks = `<ul>${[...rooms.keys()].map((room) => `<li><a href="${href(`/collections/${slugify(room)}`)}">${esc(room)}</a></li>`).join('')}</ul>`;
    page('/collections', {
      title: t.seo.collectionsTitle,
      description: t.seo.collectionsDesc,
      schema: jsonLd(breadcrumbSchema(SITE_URL, [home, { name: t.seo.collectionsTitle, path: '/collections' }], lang)),
    }, `${crumbs([home, { name: t.seo.collectionsTitle, path: '/collections' }])}
<h1>${esc(t.collections.heroTitle)} ${esc(t.collections.heroTitleHighlight)}</h1><p>${esc(t.collections.heroSubtitle)}</p>
${roomLinks}<h2>${esc(t.collections.vaultTitle)}</h2>${linkList(works)}`);

    for (const [room, list] of rooms) {
      const roomPath = `/collections/${slugify(room)}`;
      const trail = [home, { name: t.seo.collectionsTitle, path: '/collections' }, { name: room, path: roomPath }];
      page(roomPath, {
        title: `${room} — ${t.seo.collectionsTitle}`,
        description: `${room}: ${list.map((p) => p.name).join(', ')}. ${t.seo.collectionsDesc}`,
        image: list[0]?.img ? artworkShareImage(list[0].img) : undefined,
        schema: jsonLd(breadcrumbSchema(SITE_URL, trail, lang)),
      }, `${crumbs(trail)}<h1>${esc(room)}</h1>${linkList(list)}`);
    }

    // Artist
    page('/about', {
      title: t.seo.aboutTitle,
      description: t.seo.aboutDesc,
      type: 'profile',
      schema: jsonLd(personSchema(SITE_URL, lang), breadcrumbSchema(SITE_URL, [home, { name: t.seo.aboutTitle, path: '/about' }], lang)),
    }, `${crumbs([home, { name: t.seo.aboutTitle, path: '/about' }])}
<h1>${esc(t.about.heroTitle)} ${esc(t.about.heroTitleHighlight)}</h1><p>${esc(ARTIST_NAME)}</p>
<p>${esc(t.about.bio2)}</p><p>${esc(t.about.bio1)}</p>
<h2>${esc(t.about.doctrineTitle)}</h2>
<h3>${esc(t.about.observationTitle)}</h3><p>${esc(t.about.observationDesc)}</p>
<h3>${esc(t.about.colorMappingTitle)}</h3><p>${esc(t.about.colorMappingDesc)}</p>
<h3>${esc(t.about.executionTitle)}</h3><p>${esc(t.about.executionDesc)}</p>
<h2>${esc(t.about.commissionTitle)}</h2><p>${esc(t.about.commissionDesc)}</p><p><a href="${href('/contact')}">${esc(t.about.commissionCta)}</a></p>`);

    // Contact
    page('/contact', {
      title: t.seo.contactTitle,
      description: t.seo.contactDesc,
      schema: jsonLd(breadcrumbSchema(SITE_URL, [home, { name: t.seo.contactTitle, path: '/contact' }], lang)),
    }, `${crumbs([home, { name: t.seo.contactTitle, path: '/contact' }])}
<h1>${esc(t.contact.heroTitle)}</h1><p>${esc(t.contact.heroSubtitle)}</p>`);

    // Each work
    for (const p of works) {
      const trail = [home, { name: t.seo.productsTitle, path: '/products' }, { name: p.name, path: p.root }];
      const specs = [
        [t.productDetails.dimensionsLabel, p.dimensions],
        [t.productDetails.mediumLabel, p.material],
        ...(p.status === true ? [[t.productDetails.statusLabel, t.productDetails.sold]] : []),
      ].filter(([, v]) => v);
      page(p.root, {
        title: p.name,
        description: artworkDescription(p, lang),
        image: artworkShareImage(p.img),
        imageAlt: artworkAlt(p),
        type: 'article',
        schema: jsonLd(artworkSchema(SITE_URL, p, localizePath(p.root, lang), lang), breadcrumbSchema(SITE_URL, trail, lang)),
      }, `${crumbs(trail)}
<article><h1>${esc(p.name)}</h1><p>${esc(ARTIST_NAME)}</p>
${p.img ? `<img src="${esc(cdn(p.img))}" alt="${esc(artworkAlt(p))}" />` : ''}
<dl>${specs.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
<p>${esc(artworkDescription(p, lang))}</p>
<p><a href="${href('/contact')}">${esc(t.productDetails.inquireButton || t.nav.contact)}</a></p></article>`,
      { lastmod: String(p.timeStamp || '').slice(0, 10) || today, images: [p.img, p.img2, p.img3].filter(Boolean) });
    }
  }

  // Old addresses /product/<id> → permanent move to the readable (Turkish) one
  for (const p of works) {
    const target = absoluteUrl(SITE_URL, p.root);
    const stub = `<!doctype html><html lang="tr"><head><meta charset="utf-8" />
<title>${esc(p.name)} | ${esc(SITE_NAME)}</title>
<link rel="canonical" href="${esc(target)}" />
<meta name="robots" content="noindex" />
<meta http-equiv="refresh" content="0; url=${esc(`${BASE_PATH}${p.root}`)}" />
</head><body><p><a href="${esc(target)}">${esc(p.name)}</a></p></body></html>`;
    const stubFile = path.join(OUT, 'product', `${p.id}.html`);
    fs.mkdirSync(path.dirname(stubFile), { recursive: true });
    fs.writeFileSync(stubFile, stub);
  }

  // GitHub Pages' 404 page sends unknown addresses back into the app. It must
  // keep as many path segments as the base path has: 1 on github.io, 0 on a domain.
  const notFound = path.join(OUT, '404.html');
  if (fs.existsSync(notFound)) {
    const segments = BASE_PATH.split('/').filter(Boolean).length;
    fs.writeFileSync(notFound, fs.readFileSync(notFound, 'utf8').replace(/var pathSegmentsToKeep = \d+;/, `var pathSegmentsToKeep = ${segments};`));
  }

  {
    // Sitemap: every page in both languages, with their alternates and images
    const urlEntry = (rootPath, info, lang) => `  <url>
    <loc>${esc(absoluteUrl(SITE_URL, localizePath(rootPath, lang)))}</loc>
    <lastmod>${info.lastmod}</lastmod>
${LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${esc(absoluteUrl(SITE_URL, localizePath(rootPath, l)))}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(absoluteUrl(SITE_URL, rootPath))}" />${info.images.map((i) => `
    <image:image><image:loc>${esc(i)}</image:loc></image:image>`).join('')}
  </url>`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[...sitemap.entries()].flatMap(([rootPath, info]) => LANGS.map((l) => urlEntry(rootPath, info, l))).join('\n')}
</urlset>
`;
    fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
    fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *
Allow: /
Disallow: ${BASE_PATH}/admin
Disallow: ${BASE_PATH}/verify/
Disallow: ${BASE_PATH}/en/verify/

Sitemap: ${absoluteUrl(SITE_URL, '/sitemap.xml')}
`);
  }

  console.log(`[prerender] ${sitemap.size} pages × ${LANGS.length} languages, ${works.length} works, ${rooms.size} rooms, site: ${SITE_URL}`
    + ' (sitemap.xml + robots.txt written' + (IS_OWN_DOMAIN ? ')' : '; robots.txt takes effect on the own domain)'));
};

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
