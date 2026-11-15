import React, { createContext, useContext, useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { artImage } from '../../lib/artImage';

// Shared motion language for the gallery.
// Arrivals decelerate (expo-out); the curtain that unveils an artwork moves in-out,
// like fabric drawn by hand rather than a UI element sliding in.
export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_CURTAIN = [0.77, 0, 0.175, 1];

/**
 * A line of text that rises from behind its own baseline mask.
 * Use one per visual line so headings read as set type, not a fading block.
 */
export const MaskLine = ({ children, delay = 0, inView = false, className = '', as = 'span' }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] || motion.span;

  if (reduce) {
    return (
      <span className={`block ${className}`}>{children}</span>
    );
  }

  const animateProps = inView
    ? { whileInView: { y: '0%' }, viewport: { once: true, margin: '-80px' } }
    : { animate: { y: '0%' } };

  return (
    // pb/-mb gives descenders and italic overhang room inside the mask
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <Tag
        className={`block will-change-transform ${className}`}
        initial={{ y: '105%' }}
        {...animateProps}
        transition={{ duration: 1.1, delay, ease: EASE_OUT }}
      >
        {children}
      </Tag>
    </span>
  );
};

/**
 * Fades content up a short distance. Reserved for supporting copy and controls;
 * the focal moments use MaskLine and Unveil instead.
 */
export const FadeUp = ({ children, delay = 0, inView = false, className = '', distance = 16 }) => {
  const reduce = useReducedMotion();
  const animateProps = inView
    ? { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' } }
    : { animate: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : distance }}
      {...animateProps}
      transition={{ duration: reduce ? 0.4 : 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
};

/**
 * The gallery's signature: an artwork is unveiled the way a covered canvas is,
 * the frame opening from the bottom while the painting settles from a slight
 * over-scale. With reduced motion it simply fades in.
 */
// Lets an artwork inside an Unveil settle in step with its curtain.
// Visibility is observed on the unclipped wrapper: a fully clipped element
// never registers as intersecting, so it could never trigger its own reveal.
const UnveilContext = createContext(true);

export const Unveil = ({
  children,
  className = '',
  delay = 0,
  inView = false,
  duration = 1.4,
  ready = true, // lets a caller hold the curtain closed (e.g. while an intro plays)
}) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const shown = (inView ? seen : true) && ready;

  return (
    <div ref={ref} className={className}>
      <UnveilContext.Provider value={shown}>
        <motion.div
          className="absolute inset-0"
          initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={
            shown
              ? (reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' })
              : undefined
          }
          transition={reduce ? { duration: 0.6, delay } : { duration, delay, ease: EASE_CURTAIN }}
        >
          {children}
        </motion.div>
      </UnveilContext.Provider>
    </div>
  );
};

export const useUnveiled = () => useContext(UnveilContext);

/**
 * Artwork image that settles from over-scale when unveiled and then drifts
 * against the scroll, so the canvas feels hung behind its frame.
 * The parent must be `relative overflow-hidden`.
 */
export const ArtworkImage = ({
  src,
  alt,
  delay = 0,
  inView = false,
  drift = 8,
  className = '',
  imgClassName = '',
  sizes = '100vw',
  ...imgProps
}) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${drift}%`, `${drift}%`]);
  const unveiled = useUnveiled();
  const animateProps = unveiled ? { animate: { scale: 1 } } : {};

  return (
    <div ref={ref} className={`absolute inset-0 ${className}`}>
      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={reduce ? { top: 0, bottom: 0 } : { y, top: `-${drift}%`, bottom: `-${drift}%` }}
      >
        <motion.img
          {...artImage(src, { sizes })}
          alt={alt}
          className={`w-full h-full object-cover object-center ${imgClassName}`}
          initial={{ scale: reduce ? 1 : 1.18 }}
          {...animateProps}
          transition={{ duration: 2, delay, ease: EASE_OUT }}
          {...imgProps}
        />
      </motion.div>
    </div>
  );
};

/**
 * A statement that is read as the visitor scrolls: each word brightens from
 * a faint impression to full ink as its moment in the passage arrives.
 */
export const ScrollWords = ({ text, className = '' }) => {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });

  if (reduce || !text) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(' ');

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

const Word = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span aria-hidden="true" style={{ opacity }} className="inline">
      {children}{' '}
    </motion.span>
  );
};
