import React, { useEffect } from 'react';
import '../assets/styles/landing.css';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';
import { APP_CONFIG } from '../lib/constants';

// Sub-components
import Hero from '../components/landing/Hero';
import FeaturedExhibition from '../components/landing/FeaturedExhibition';
import ArtistSection from '../components/landing/ArtistSection';
import { jsonLd, organizationSchema, personSchema, websiteSchema } from '../lib/seo-data.mjs';

const Landing = () => {
  const { t, language } = useLanguage();
  const { products } = useProducts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // The hero is typographic; the three latest works open the exhibition below it
  const galleryPieces = products.slice(0, 3);

  const schema = jsonLd(
    websiteSchema(APP_CONFIG.BASE_URL),
    organizationSchema(APP_CONFIG.BASE_URL),
    personSchema(APP_CONFIG.BASE_URL, language),
  );

  return (
    <main className="landing-container bg-background text-white font-sans overflow-hidden">
      <SEO
        title={t('seo', 'homeTitle')}
        description={t('seo', 'homeDesc')}
        keywords={APP_CONFIG.KEYWORDS}
        schema={schema}
      />

      <Hero t={t} />

      <FeaturedExhibition t={t} galleryPieces={galleryPieces} />


      <ArtistSection t={t} />
    </main>
  );
};

export default Landing;
