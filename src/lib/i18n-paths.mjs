/**
 * Addresses of the two languages. Turkish lives at the root, English under
 * /en/. Every page exists in both; only the artwork segment is translated:
 *
 *   /                      /en/
 *   /products              /en/products
 *   /collections/<room>    /en/collections/<room>
 *   /about, /contact       /en/about, /en/contact
 *   /eser/<slug>           /en/artwork/<slug>
 *   /verify/<id>           /en/verify/<id>
 *
 * Plain JavaScript (no React), shared by the site and the build scripts.
 */

export const LANGS = ['tr', 'en'];
export const DEFAULT_LANG = 'tr';
export const OG_LOCALE = { tr: 'tr_TR', en: 'en_GB' };
export const HTML_LANG = { tr: 'tr', en: 'en' };

const EN_PREFIX = /^\/en(?=\/|$)/;

/** Language of an address (path without the site's base path). */
export const langFromPath = (pathname = '/') => (EN_PREFIX.test(pathname) ? 'en' : 'tr');

/** The Turkish (root) form of an address: "/en/artwork/x" → "/eser/x". */
export const stripLang = (pathname = '/') => {
  const path = pathname.replace(EN_PREFIX, '') || '/';
  return path.replace(/^\/artwork(?=\/|$)/, '/eser');
};

/** Never translated: the studio panel. */
const isUnlocalized = (path) => /^\/admin(?=\/|$)/.test(path);

/** The same page in `lang`. Keeps any ?query or #hash. */
export const localizePath = (path = '/', lang = DEFAULT_LANG) => {
  const match = String(path).match(/^([^?#]*)(.*)$/);
  const pathOnly = match[1] || '/';
  const rest = match[2] || '';
  if (isUnlocalized(pathOnly)) return path;
  const base = stripLang(pathOnly);
  if (lang !== 'en') return base + rest;
  const en = base.replace(/^\/eser(?=\/|$)/, '/artwork');
  return (en === '/' ? '/en/' : `/en${en}`) + rest;
};
