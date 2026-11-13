import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  type = 'website',
  schema,
  lang = 'en',
}) => {
  const siteName = "Piece Of Oblivion";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Original hand-made paintings and drawings by Beliz Keskin. One of a kind, certified, shipped worldwide.";
  const defaultImage = "/logo.svg";

  // Auto-resolve canonical URL from current page if not explicitly provided
  const resolvedCanonical = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Canonical */}
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}

      {/* OpenGraph */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage || defaultImage} />
      {resolvedCanonical && <meta property="og:url" content={resolvedCanonical} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage || defaultImage} />

      {/* JSON-LD Structured Data Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
