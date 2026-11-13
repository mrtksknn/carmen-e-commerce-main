import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Unveil, ArtworkImage } from './motion/Reveal';
import LogoMark from './motion/LogoMark';

// How long the studio mark holds in the empty frame before the curtain opens
const INTRO_MS = 1300;

/**
 * A work as it hangs on the wall: first the studio's mark is drawn in the
 * empty frame, then the curtain opens on the canvas. Beneath it, a small
 * label with the room it belongs to, its title and its medium.
 */
const ArtworkCard = ({ artwork, delay = 0 }) => {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const isSold = artwork.status === true;

  const frameRef = useRef(null);
  const seen = useInView(frameRef, { once: true, margin: '0px 0px -10% 0px' });
  const [ready, setReady] = useState(!!reduce);

  useEffect(() => {
    if (!seen || ready) return undefined;
    const timer = setTimeout(() => setReady(true), INTRO_MS + delay * 1000);
    return () => clearTimeout(timer);
  }, [seen, ready, delay]);

  return (
    <Link
      to={`/product/${artwork.id}`}
      className="group block focus-visible:outline-none"
    >
      <div ref={frameRef} className="relative w-full aspect-[4/5] rounded-[3px] bg-surface ring-1 ring-inset ring-white/[0.06]">
        {/* Intro: the mark is drawn in the empty frame, then gives way */}
        <AnimatePresence>
          {seen && !ready && (
            <motion.div
              key="intro"
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, delay } }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            >
              <LogoMark size={56} delay={delay} />
            </motion.div>
          )}
        </AnimatePresence>

        <Unveil ready={ready} duration={1.2} className="absolute inset-0">
          <figure className="absolute inset-0 m-0 overflow-hidden rounded-[3px] bg-surface shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)] group-focus-visible:ring-2 group-focus-visible:ring-primary-light group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background">
            <ArtworkImage
              src={artwork.img}
              alt={`${t('common', 'artworkAlt')}${artwork.name}`}
              drift={5}
              loading="lazy"
              decoding="async"
              imgClassName={`transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] ${isSold ? 'grayscale-[35%]' : ''}`}
            />
            <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3px]" />

            {isSold && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-[2px] bg-black/70 text-[11px] font-medium tracking-[0.18em] uppercase text-white/85">
                {t('common', 'sold')}
              </span>
            )}

            <span
              aria-hidden="true"
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white opacity-0 translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 group-hover:bg-primary group-hover:border-primary"
            >
              <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
            </span>
          </figure>
        </Unveil>
      </div>

      {/* Wall label */}
      <div className="pt-5 min-w-0">
        {artwork.collections && (
          <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/50 mb-1.5">
            {artwork.collections}
          </p>
        )}
        <h2 className="font-serif font-light text-white text-xl sm:text-2xl leading-snug line-clamp-2">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_100%] group-hover:bg-[length:100%_1px] transition-[background-size] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {artwork.name}
          </span>
        </h2>
        {artwork.material && (
          <p className="mt-1 text-sm text-white/45">{artwork.material}</p>
        )}
      </div>
    </Link>
  );
};

export default ArtworkCard;
