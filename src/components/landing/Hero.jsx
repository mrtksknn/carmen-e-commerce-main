import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { MaskLine, FadeUp, Unveil, ArtworkImage, EASE_OUT } from '../motion/Reveal';

const Hero = ({ t, heroPiece }) => {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  // As the visitor scrolls on, the copy recedes and the painting drifts back
  // into the wall, handing the stage to the exhibition below.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const frameY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100svh] pt-28 pb-16 lg:pt-24 z-10 flex items-center bg-background overflow-hidden"
    >
      {/* Single gallery light falling on the wall behind the work */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_55%_at_72%_45%,rgba(175,54,44,0.10),transparent_70%)]"
      />

      <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-8 gap-14 lg:gap-16">

        {/* ── Copy ── */}
        <motion.div
          className="w-full lg:w-[44%] flex flex-col justify-center"
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <h1 className="font-serif font-light leading-[1.02] tracking-[-0.02em] mb-8 text-[3rem] sm:text-[4rem] md:text-[4.75rem] lg:text-[5.5rem] text-white text-balance">
            <MaskLine delay={0.35}>{t('landing', 'heroTitle')}</MaskLine>
            <MaskLine delay={0.5} className="italic text-primary-light">
              {t('landing', 'heroTitleItalic')}
            </MaskLine>
          </h1>

          <FadeUp delay={0.8}>
            <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-md mb-12">
              {t('landing', 'heroSubtitle')}
            </p>
          </FadeUp>

          <FadeUp delay={0.95} className="flex flex-row items-center flex-wrap gap-x-8 gap-y-4">
            <Link
              to="/collections"
              className="group relative inline-flex items-center gap-3 pl-8 pr-7 py-4 bg-white text-black rounded-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
              <span className="relative z-10 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-500 group-hover:text-white">
                {t('landing', 'heroCtaPrimary')}
              </span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-all duration-500 group-hover:text-white group-hover:translate-x-1" />
            </Link>

            <Link
              to="/about"
              className="group relative inline-flex items-center py-2 text-xs font-semibold tracking-[0.18em] uppercase text-white/60 hover:text-white transition-colors duration-500 focus-visible:outline-none focus-visible:text-white"
            >
              {t('landing', 'heroCtaSecondary')}
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-0.5 h-px bg-white/25 overflow-hidden"
              >
                <span className="absolute inset-0 bg-primary-light origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </span>
            </Link>
          </FadeUp>
        </motion.div>

        {/* ── The work ── */}
        <motion.div
          className="w-full lg:w-[52%] relative"
          style={reduce ? undefined : { y: frameY, scale: frameScale }}
        >
          {heroPiece ? (
            <Unveil delay={0.1} duration={1.5} className="relative w-full h-[440px] sm:h-[540px] lg:h-[74vh] max-h-[720px]">
              <Link
                to={`/product/${heroPiece.id}`}
                className="group absolute inset-0 block overflow-hidden rounded-[3px] bg-surface shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <ArtworkImage
                  src={heroPiece.img || ''}
                  alt={heroPiece.name}
                  delay={0.1}
                  drift={5}
                  fetchpriority="high"
                  decoding="async"
                  imgClassName="transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />

                {/* Legibility for the caption only; the painting stays untinted */}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3px]" />

                {/* Wall label */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between gap-6"
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 1.35, ease: EASE_OUT }}
                >
                  <div className="min-w-0">
                    {heroPiece.collections && (
                      <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/60 mb-2">
                        {heroPiece.collections}
                      </p>
                    )}
                    <h2 className="font-serif font-light text-white text-2xl sm:text-4xl leading-tight line-clamp-2 text-balance">
                      {heroPiece.name}
                    </h2>
                    {heroPiece.material && (
                      <p className="mt-2 text-sm text-white/70">{heroPiece.material}</p>
                    )}
                  </div>

                  <span className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/30 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-primary group-hover:border-primary">
                    <ArrowUpRight className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" strokeWidth={1.5} />
                  </span>
                </motion.div>
              </Link>
            </Unveil>
          ) : (
            <div
              className="w-full h-[440px] sm:h-[540px] lg:h-[74vh] max-h-[720px] rounded-[3px] bg-surface ring-1 ring-inset ring-white/5 flex items-center justify-center"
              role="status"
            >
              <motion.span
                className="text-white/40 font-serif italic text-lg"
                animate={reduce ? undefined : { opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              >
                {t('landing', 'curatingVault')}
              </motion.span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
