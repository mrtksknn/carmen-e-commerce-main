import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ t, heroPiece }) => {
  return (
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
              className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#782222]"
            >
              {t('landing', 'exhibitionBadge')}
            </span>
          </div>

          {/* Main heading */}
          <h1 className="hero-title-animate font-serif font-black leading-[0.88] tracking-[-0.02em] mb-8 text-[3.5rem] md:text-[5vw] lg:text-[6.5rem]">
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
        <div className="hero-image-animate w-full lg:w-[52%] relative h-[420px] lg:h-[72vh] max-h-[680px]">

          {heroPiece ? (
            <Link
              to={`/product/${heroPiece.id}`}
              className="hero-image-frame group shadow-2xl block h-full"
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
                <div className="hero-floating-badge top-5 right-5 z-30 px-4 py-2.5 flex flex-col items-end animate-delay-1500">
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
                  className="rounded-2xl p-5 flex items-end justify-between gap-4 bg-[rgba(5,5,5,0.55)] backdrop-blur-[20px] border border-white/5 transform translate-y-2 transition-transform duration-500 hover:translate-y-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
                      <p className="text-[10px] font-bold tracking-[0.3em] uppercase truncate text-[#c0392b]">
                        {heroPiece.collections || t('landing', 'latestDrop')}
                      </p>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight truncate">
                      {heroPiece.name}
                    </h2>
                  </div>

                  {/* Arrow button */}
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white transition-all duration-400 group-hover:scale-110 bg-gradient-to-br from-[#782222] to-[#c0392b] shadow-[0_0_20px_rgba(120,34,34,0.5)]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

            </Link>
          ) : (
            <div className="hero-image-frame bg-white/5 border border-white/10 flex items-center justify-center animate-pulse h-full">
              <span className="text-gray-600 font-serif tracking-widest uppercase text-sm">
                {t('landing', 'curatingVault')}
              </span>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default Hero;
