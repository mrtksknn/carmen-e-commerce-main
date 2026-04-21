import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/landing.css';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import SubscriptionArea from '../components/SubscriptionArea';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const Landing = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        // Zaman damgasına göre sırala (En yeni en üstte)
        list.sort((a, b) => {
          return (b.timeStamp?.seconds || 0) - (a.timeStamp?.seconds || 0);
        });

        // 1 Ana Hero eseri + 3 Sergi Eseri = Toplam 4 eser çekiyoruz
        const latestMasterworks = list.slice(0, 4);
        setProducts(latestMasterworks);
      },
      (error) => {
        console.error("Firebase fetch error: ", error);
      }
    );

    return () => {
      unsub();
    }
  }, []);

  const heroPiece = products.length > 0 ? products[0] : null;
  const galleryPieces = products.length > 1 ? products.slice(1, 4) : [];

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Carmen E-Commerce",
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "description": "Unique hand-crafted models, figures and arts by Carmen."
  };

  return (
    <main className="landing-container bg-[#030303] text-white font-sans overflow-hidden">
      <SEO 
        title="Home"
        description="Welcome to Carmen E-Commerce, featuring unique hand-crafted models, figures and arts."
        schema={orgSchema}
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen pt-24 pb-16 z-10 overflow-hidden flex items-center">

        {/* Noise + Scan line */}
        <div className="hero-noise-overlay"></div>

        {/* 1280px Max-Width Wrapper */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 gap-12 lg:gap-8">

          {/* ── LEFT: Typography & CTA ── */}
          <div className="w-full lg:w-[48%] flex flex-col justify-center z-30">

            {/* Eyebrow badge */}
            <div className="hero-badge-animate flex items-center gap-3 mb-10">
              <span className="hero-accent-line"></span>
              <span
                className="text-[10px] font-bold tracking-[0.45em] uppercase"
                style={{ color: '#782222' }}
              >
                {t('landing', 'exhibitionBadge')}
              </span>
            </div>

            {/* Main heading */}
            <h1 className="hero-title-animate font-serif font-black leading-[0.88] tracking-[-0.02em] mb-8"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)' }}>
              {t('landing', 'heroTitle')}
              <br />
              <span className="hero-shimmer-text italic font-light">
                {t('landing', 'heroTitleItalic')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-sub-animate text-base md:text-lg text-gray-400 font-light leading-relaxed max-w-md mb-10">
              {t('landing', 'heroSubtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta-animate flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-0">
              <Link to="/collections" className="hero-cta-primary">
                <span>{t('landing', 'heroCtaPrimary')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/about" className="hero-cta-secondary">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
                {t('landing', 'heroCtaSecondary')}
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Dynamic Masterpiece Frame ── */}
          <div className="hero-image-animate w-full lg:w-[52%] relative"
            style={{ height: 'clamp(420px, 72vh, 680px)' }}>

            {heroPiece ? (
              <Link
                to={`/product/${heroPiece.id}`}
                className="hero-image-frame group shadow-2xl"
                style={{ display: 'block', height: '100%' }}
              >
                {/* Glow ring (shown on hover via CSS) */}
                <div className="hero-glow-ring"></div>

                {/* Artwork image */}
                <img
                  src={heroPiece.img}
                  alt={heroPiece.name}
                  fetchpriority="high"
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[18s] ease-out group-hover:scale-110"
                />

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/30 to-transparent z-10 opacity-90 transition-opacity duration-700 group-hover:opacity-70"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent z-10"></div>
                <div
                  className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: 'radial-gradient(circle at 60% 40%, rgba(120,34,34,0.18), transparent 70%)', mixBlendMode: 'screen' }}
                ></div>

                {/* ── Floating "New Drop" Badge (top-left) ── */}
                <div className="hero-floating-badge top-5 left-5 z-30 px-4 py-2.5 flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/80">
                    {t('landing', 'latestDrop') || 'New Drop'}
                  </span>
                </div>

                {/* ── Price Badge (top-right) ── */}
                {heroPiece.price && (
                  <div className="hero-floating-badge top-5 right-5 z-30 px-4 py-2.5 flex flex-col items-end"
                    style={{ animationDelay: '1.5s' }}>
                    <span className="text-[9px] tracking-wider uppercase text-white/40 mb-0.5">
                      {t('landing', 'startingAt') || 'Fiyat'}
                    </span>
                    <span className="text-base font-bold text-white tabular-nums">
                      {heroPiece.price}₺
                    </span>
                  </div>
                )}

                {/* ── Informational Lower Third ── */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-10 z-20">
                  <div
                    className="rounded-2xl p-5 flex items-end justify-between gap-4"
                    style={{
                      background: 'rgba(5,5,5,0.55)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transform: 'translateY(8px)',
                      transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(0)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(8px)'}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase truncate"
                          style={{ color: '#c0392b' }}>
                          {heroPiece.collections || t('landing', 'latestDrop')}
                        </p>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight truncate">
                        {heroPiece.name}
                      </h2>
                    </div>

                    {/* Arrow button */}
                    <div
                      className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-400 group-hover:scale-110"
                      style={{
                        background: 'linear-gradient(135deg, #782222, #c0392b)',
                        boxShadow: '0 0 20px rgba(120,34,34,0.5)',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>

              </Link>
            ) : (
              <div className="hero-image-frame bg-white/5 border border-white/10 flex items-center justify-center animate-pulse"
                style={{ height: '100%' }}>
                <span className="text-gray-600 font-serif tracking-widest uppercase text-sm">
                  {t('landing', 'curatingVault')}
                </span>
              </div>
            )}
          </div>

        </div>

      </section>

      {/* ── Curated Exhibition Section ── */}
      <section className="relative py-24 px-6 z-20 exhibition-section-enter">

        <div className="max-w-7xl mx-auto">

          {/* ── Section Header ── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
            <div>

              {/* Title */}
              <h2 className="font-serif font-bold text-white leading-[0.92] tracking-tight"
                style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
                {t('landing', 'featuredTitle')}
                <span style={{ color: '#782222' }}>.</span>
              </h2>

              {/* Subtitle */}
              <p className="text-gray-500 text-sm font-light mt-4 max-w-sm leading-relaxed">
                {t('landing', 'featuredSubtitle')}
              </p>
            </div>

            {/* View All — desktop */}
            <Link to="/products" className="exhibition-view-all hidden md:inline-flex">
              {t('landing', 'viewFullGallery')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* ── Asymmetric Gallery Grid ── */}
          <div className="featured-gallery">
            {galleryPieces.length > 0 ? galleryPieces.map((artwork, index) => (
              <Link
                to={`/product/${artwork.id}`}
                key={artwork.id}
                className={`gallery-card gallery-item-${index} ${index === 0 ? 'min-h-[420px] md:min-h-[520px]' : 'min-h-[240px] md:min-h-[248px]'}`}
              >
                {/* Artwork image */}
                <img src={artwork.img} alt={artwork.name} loading="lazy" />

                {/* Overlays */}
                <div className="gallery-card-overlay"></div>
                <div className="gallery-card-tint"></div>

                {/* Info panel */}
                <div className="gallery-card-info">
                  <span className="gallery-card-label">
                    {artwork.collections || t('landing', 'featuredSelection')}
                  </span>
                  <h3 className="font-serif text-white leading-snug drop-shadow-lg"
                    style={{ fontSize: index === 0 ? 'clamp(1.3rem, 2.5vw, 1.9rem)' : '1.1rem' }}>
                    {artwork.name}
                  </h3>
                  {index === 0 && (
                    <p className="text-gray-400 text-xs mt-1.5 leading-relaxed line-clamp-2 max-w-[80%]">
                      {artwork.description}
                    </p>
                  )}
                  {artwork.price && (
                    <span className="gallery-card-price">
                      {artwork.price}₺
                    </span>
                  )}
                </div>

                {/* Arrow button (appears on hover) */}
                <div className="gallery-card-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )) : (
              /* Skeleton loaders */
              <>
                <div className="gallery-skeleton gallery-item-0 min-h-[420px] md:min-h-[520px]"></div>
                <div className="gallery-skeleton gallery-item-1 min-h-[240px]"></div>
                <div className="gallery-skeleton gallery-item-2 min-h-[240px]"></div>
              </>
            )}
          </div>

          {/* View All — mobile */}
          <div className="text-center mt-12 md:hidden">
            <Link to="/products" className="exhibition-mobile-cta">
              {t('landing', 'viewAllArtworks')}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>
      </section>

      <SubscriptionArea />

      {/* ── The Mastermind Section ── */}
      <section className="mastermind-section">
        <div className="mastermind-inner">

          {/* ── LEFT: Content ── */}
          <div>
            {/* Eyebrow */}
            <div className="mastermind-eyebrow">
              <span className="mastermind-eyebrow-line"></span>
              <span className="mastermind-eyebrow-text">
                {t('landing', 'artistSectionLabel')}
              </span>
            </div>

            {/* Blockquote */}
            <div className="mastermind-quote">
              <p className="mastermind-quote-text">
                {t('landing', 'artistQuote')}
              </p>
            </div>

            {/* Bio */}
            <p className="mastermind-bio">
              {t('landing', 'artistBio')}
            </p>

            {/* CTA */}
            <Link to="/about" className="mastermind-cta">
              <span>{t('landing', 'artistCta')}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* ── RIGHT: Cinematic Image ── */}
          <div className="mastermind-image-wrap">

            {/* Outer glow ring */}
            <div className="mastermind-glow-ring"></div>

            {/* Image container */}
            <div className="mastermind-image-container">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=800&fit=crop"
                alt="Artist at work"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div className="mastermind-image-overlay"></div>

              {/* Decorative corner lines */}
              <div className="mastermind-corner mastermind-corner-tl"></div>
              <div className="mastermind-corner mastermind-corner-tr"></div>
              <div className="mastermind-corner mastermind-corner-bl"></div>
              <div className="mastermind-corner mastermind-corner-br"></div>

              {/* Floating signature badge */}
              <div className="mastermind-signature">
                <div className="mastermind-signature-avatar">CM</div>
                <div>
                  <div className="mastermind-signature-name">Carmen</div>
                  <div className="mastermind-signature-role">{t('landing', 'artistSectionLabel') || 'Visual Artist'}</div>
                </div>
                <div className="mastermind-status-dot"></div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
};

export default Landing;
