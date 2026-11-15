import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../lib/constants';
import { OG_IMAGE_PATH, SITE_NAME, absoluteUrl } from '../lib/seo-data.mjs';
import { LANGS, OG_LOCALE, localizePath, stripLang } from '../lib/i18n-paths.mjs';
import { useLanguage } from '../context/LanguageContext';

/**
 * Per-page head tags. The same tags are written into each page's static HTML
 * at build time (scripts/prerender.mjs); Helmet replaces them in the browser.
 *
 * - canonical: the clean address of the page (no query string)
 * - noindex: for pages that must stay out of search (admin, 404, certificates)
 * - hreflang: every page names its Turkish and English versions (x-default: Turkish)
 */
// "</script>" inside a product name must not end the JSON-LD block early
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogImageAlt,
  path,
  type = 'website',
  schema,
  noindex = false,
}) => {
  const location = useLocation();
  const { language } = useLanguage();
  // Turkish (root) form of this page, from which both language versions follow
  const rootPath = stripLang(path || location.pathname);
  const alternates = LANGS.map((lang) => ({ lang, href: absoluteUrl(APP_CONFIG.BASE_URL, localizePath(rootPath, lang)) }));
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const desc = description || APP_CONFIG.DESCRIPTION;
  const canonical = absoluteUrl(APP_CONFIG.BASE_URL, localizePath(rootPath, language));
  const image = absoluteUrl(APP_CONFIG.BASE_URL, ogImage || OG_IMAGE_PATH);
  const imageAlt = ogImageAlt || SITE_NAME;
  const schemas = [].concat(schema || []);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      {!noindex && <link rel="canonical" href={canonical} />}
      {!noindex && alternates.map((a) => <link key={a.lang} rel="alternate" hrefLang={a.lang} href={a.href} />)}
      {!noindex && <link rel="alternate" hrefLang="x-default" href={alternates[0].href} />}

      {/* Open Graph (WhatsApp, Facebook, LinkedIn…) */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={OG_LOCALE[language]} />
      {LANGS.filter((l) => l !== language).map((l) => <meta key={l} property="og:locale:alternate" content={OG_LOCALE[l]} />)}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />

      {/* X / Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{safeJson(s)}</script>
      ))}
    </Helmet>
  );
};

export default SEO;
