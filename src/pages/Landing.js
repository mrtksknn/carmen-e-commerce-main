import React, { useEffect } from 'react';
import '../assets/styles/landing.css';
import SubscriptionArea from '../components/SubscriptionArea';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';
import { APP_CONFIG } from '../lib/constants';

// Sub-components
import Hero from '../components/landing/Hero';
import FeaturedExhibition from '../components/landing/FeaturedExhibition';
import ArtistSection from '../components/landing/ArtistSection';

const Landing = () => {
  const { t } = useLanguage();
  const { products } = useProducts();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1 Main Hero piece + 3 Exhibition pieces = Total 4 pieces
  const latestProducts = products.slice(0, 4);
  const heroPiece = latestProducts.length > 0 ? latestProducts[0] : null;
  const galleryPieces = latestProducts.length > 1 ? latestProducts.slice(1, 4) : [];

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": APP_CONFIG.NAME,
    "url": window.location.origin,
    "logo": `${window.location.origin}${APP_CONFIG.LOGO_URL}`,
    "description": APP_CONFIG.DESCRIPTION
  };

  return (
    <main className="landing-container bg-[#030303] text-white font-sans overflow-hidden">
      <SEO
        description="Carmen Art ile size özel el yapımı çizimler, resimler ve sanat eserlerini keşfedin. Benzersiz tasarımlar için hemen inceleyin."
        keywords={APP_CONFIG.KEYWORDS}
        schema={orgSchema}
      />

      <Hero t={t} heroPiece={heroPiece} />

      <FeaturedExhibition t={t} galleryPieces={galleryPieces} />

      <SubscriptionArea />

      <ArtistSection t={t} />
    </main>
  );
};

export default Landing;
