import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedExhibition = ({ t, galleryPieces }) => {
  return (
    <section className="relative py-24 px-6 z-20 exhibition-section-enter">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div>
            {/* Title */}
            <h2 className="font-serif font-bold text-white leading-[0.92] tracking-tight text-[2.4rem] md:text-[5vw] lg:text-[4rem]">
              {t('landing', 'featuredTitle')}
              <span className="text-[#782222]">.</span>
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
  );
};

export default FeaturedExhibition;
