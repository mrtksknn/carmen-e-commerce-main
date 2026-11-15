import React from 'react';
import { Link } from '../ui/LocaleLink';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { MaskLine, FadeUp, Unveil, ArtworkImage, EASE_OUT } from '../motion/Reveal';
import { artworkPath } from '../../lib/artworkPath';
import { artworkAlt } from '../../lib/seo-data.mjs';

const UnderlineLink = ({ to, children, className = '' }) => (
  <Link
    to={to}
    className={`hit group relative inline-flex items-center gap-3 py-2 whitespace-nowrap text-xs font-semibold tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors duration-500 focus-visible:outline-none focus-visible:text-white ${className}`}
  >
    <span>{children}</span>
    <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
    <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-px bg-white/15 overflow-hidden">
      <span className="absolute inset-0 bg-primary-light origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
    </span>
  </Link>
);

const FeaturedExhibition = ({ t, galleryPieces }) => {
  const reduce = useReducedMotion();
  const pieces = galleryPieces ? galleryPieces.slice(0, 3) : [];

  return (
    <section id="latest-works" className="relative scroll-mt-20 bg-background pt-16 pb-28 lg:pt-24 lg:pb-36 px-6 z-20">
      <div className="max-w-7xl mx-auto relative">

        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 lg:mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="font-serif font-light text-white leading-[1.04] tracking-[-0.02em] text-[2.6rem] md:text-[3.5rem] lg:text-[4.5rem]">
              <MaskLine inView>
                {t('landing', 'featuredTitle')}
                <span className="text-primary-light">.</span>
              </MaskLine>
            </h2>
            <FadeUp inView delay={0.2}>
              <p className="text-white/60 text-base md:text-lg font-light mt-6 leading-relaxed max-w-xl">
                {t('landing', 'featuredSubtitle')}
              </p>
            </FadeUp>
          </div>

          <FadeUp inView delay={0.3} className="hidden md:block pb-2">
            <UnderlineLink to="/collections">{t('landing', 'viewFullGallery')}</UnderlineLink>
          </FadeUp>
        </div>

        {/* ── Hang: one major work, two companions ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
          {pieces.length > 0 ? pieces.map((artwork, index) => {
            const isFeatured = index === 0;
            // With a single companion it takes the full height of the hang
            // instead of leaving an empty bay beneath it.
            const loneCompanion = !isFeatured && pieces.length === 2;
            const size = isFeatured
              ? 'md:col-span-2 md:row-span-2 h-[460px] md:h-[600px] lg:h-[720px]'
              : loneCompanion
                ? 'md:row-span-2 h-[460px] md:h-[600px] lg:h-[720px]'
                : 'h-[380px] md:h-[290px] lg:h-[344px]';

            return (
              <Unveil
                key={artwork.id}
                inView
                delay={reduce ? 0 : index * 0.15}
                duration={1.3}
                className={`${size} relative`}
              >
                <Link
                  to={artworkPath(artwork)}
                  className="group absolute inset-0 block overflow-hidden rounded-[3px] bg-surface shadow-[0_40px_80px_-30px_rgba(0,0,0,0.85)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <ArtworkImage
                    src={artwork.img}
                    alt={artworkAlt(artwork)}
                    inView
                    delay={index * 0.15}
                    drift={isFeatured ? 6 : 8}
                    sizes={isFeatured ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
                    loading="lazy"
                    decoding="async"
                    imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />

                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
                  <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3px]" />

                  {/* Wall label */}
                  <motion.div
                    className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 ${isFeatured ? 'p-6 sm:p-10' : 'p-5 sm:p-6'}`}
                    initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.9, delay: 0.9 + index * 0.15, ease: EASE_OUT }}
                  >
                    <div className="min-w-0">
                      {artwork.collections && (
                        <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/60 mb-2">
                          {artwork.collections}
                        </p>
                      )}
                      <h3 className={`font-serif font-light text-white leading-tight line-clamp-2 text-balance ${isFeatured ? 'text-3xl sm:text-5xl' : 'text-xl sm:text-2xl'}`}>
                        {artwork.name}
                      </h3>
                      {isFeatured && artwork.description && (
                        <p className="hidden md:block text-white/60 text-sm mt-3 leading-relaxed line-clamp-2 font-light max-w-lg">
                          {artwork.description}
                        </p>
                      )}
                      {artwork.material && (
                        <p className="mt-2 text-sm text-white/70">{artwork.material}</p>
                      )}
                    </div>

                    <span className={`flex-shrink-0 rounded-full border border-white/30 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-primary group-hover:border-primary ${isFeatured ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10'}`}>
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
                    </span>
                  </motion.div>
                </Link>
              </Unveil>
            );
          }) : (
            <>
              <div className="md:col-span-2 md:row-span-2 h-[460px] md:h-[600px] lg:h-[720px] rounded-[3px] bg-white/[0.04] animate-pulse" />
              <div className="h-[380px] md:h-[290px] lg:h-[344px] rounded-[3px] bg-white/[0.04] animate-pulse" />
              <div className="h-[380px] md:h-[290px] lg:h-[344px] rounded-[3px] bg-white/[0.04] animate-pulse" />
            </>
          )}
        </div>

        {/* View all — mobile */}
        <FadeUp inView className="mt-12 flex justify-center md:hidden">
          <UnderlineLink to="/collections">{t('landing', 'viewAllArtworks')}</UnderlineLink>
        </FadeUp>
      </div>
    </section>
  );
};

export default FeaturedExhibition;
