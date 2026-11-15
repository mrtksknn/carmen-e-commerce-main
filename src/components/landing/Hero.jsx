import React, { useEffect, useRef } from 'react';
import { Link } from '../ui/LocaleLink';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { MaskLine, FadeUp, EASE_OUT } from '../motion/Reveal';

// The studio's mark, the same paths as the header logo, drawn here at wall
// scale as a faint line in the dark: the room before any work is hung.
const B_PATH = 'M 30 20 L 30 80 M 30 20 L 60 20 C 75 20, 75 45, 60 50 L 30 50 M 60 50 C 75 50, 75 80, 60 80 L 30 80';
const C_PATH = 'M 70 30 A 30 30 0 1 0 70 70';

const WallMark = ({ reduce }) => {
  const draw = (delay, duration) => ({
    initial: { pathLength: reduce ? 1 : 0 },
    animate: { pathLength: 1 },
    transition: { duration: reduce ? 0 : duration, delay, ease: [0.65, 0, 0.35, 1] },
  });

  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className="w-full h-full overflow-visible">
      <motion.path d={C_PATH} stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" strokeLinecap="round" {...draw(0.6, 2.4)} />
      <motion.path
        d={B_PATH}
        stroke="rgba(242,104,104,0.16)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(0.9, 2.8)}
      />
    </svg>
  );
};

const Hero = ({ t }) => {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  // A single gallery light on the wall. It settles on the title, then follows
  // the visitor's pointer at a walking pace.
  const lightX = useMotionValue(38);
  const lightY = useMotionValue(46);
  const x = useSpring(lightX, { stiffness: 40, damping: 20, mass: 1 });
  const y = useSpring(lightY, { stiffness: 40, damping: 20, mass: 1 });
  const light = useMotionTemplate`radial-gradient(48% 58% at ${x}% ${y}%, rgba(175,54,44,0.13), rgba(175,54,44,0.04) 45%, transparent 72%)`;

  useEffect(() => {
    if (reduce) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return undefined;
    const el = sectionRef.current;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      lightX.set(((e.clientX - r.left) / r.width) * 100);
      lightY.set(((e.clientY - r.top) / r.height) * 100);
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [reduce, lightX, lightY]);

  // As the visitor scrolls on, the title recedes into the wall and hands the
  // stage to the works below.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const markY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100svh] pt-32 pb-10 lg:pt-28 short:pt-24 short:pb-6 z-10 flex flex-col bg-background overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: light }}
      />

      {/* The mark, drawn large and faint at the right of the wall */}
      <motion.div
        aria-hidden="true"
        className="absolute pointer-events-none right-[-18vw] top-[12%] w-[78vw] h-[78vw] sm:right-[-10vw] sm:w-[62vw] sm:h-[62vw] lg:right-[-4vw] lg:top-[8%] lg:w-[min(52vw,88vh)] lg:h-[min(52vw,88vh)]"
        style={reduce ? undefined : { y: markY }}
      >
        <WallMark reduce={reduce} />
      </motion.div>

      <motion.div
        className="relative flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-center"
        style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <h1 className="font-serif font-light leading-[0.98] tracking-[-0.025em] text-white text-[3.4rem] sm:text-[4.75rem] md:text-[5.25rem] lg:text-[6rem] short:text-[3.75rem] max-w-[11ch] sm:max-w-none">
          <MaskLine delay={0.3}>{t('landing', 'heroTitle')}</MaskLine>
          <MaskLine delay={0.45} className="italic text-primary-light sm:pl-[0.9em]">
            {t('landing', 'heroTitleItalic')}
          </MaskLine>
        </h1>

        {/* A hairline drawn under the title, the line the rest of the page hangs from */}
        <motion.span
          aria-hidden="true"
          className="block h-px bg-white/15 mt-12 lg:mt-16 short:mt-6 origin-left"
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.75, ease: EASE_OUT }}
        />

        <div className="mt-10 short:mt-6 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          <FadeUp delay={0.9} className="md:col-span-6 lg:col-span-5">
            <p className="text-base md:text-lg text-white/65 font-light leading-relaxed max-w-md text-pretty">
              {t('landing', 'heroSubtitle')}
            </p>
          </FadeUp>

          <FadeUp
            delay={1.05}
            className="md:col-span-6 lg:col-span-6 lg:col-start-7 flex flex-row items-center flex-wrap gap-x-8 gap-y-4 md:justify-end"
          >
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
              className="hit group relative inline-flex items-center py-2 text-xs font-semibold tracking-[0.18em] uppercase text-white/65 hover:text-white transition-colors duration-500 focus-visible:outline-none focus-visible:text-white"
            >
              {t('landing', 'heroCtaSecondary')}
              <span aria-hidden="true" className="absolute left-0 right-0 -bottom-0.5 h-px bg-white/25 overflow-hidden">
                <span className="absolute inset-0 bg-primary-light origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </span>
            </Link>
          </FadeUp>
        </div>
      </motion.div>

      {/* Way down to the works */}
      <motion.a
        href="#latest-works"
        onClick={(e) => {
          const target = document.getElementById('latest-works');
          if (!target) return;
          e.preventDefault();
          target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }}
        className="group relative mx-auto mt-12 flex flex-col items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase text-white/50 hover:text-white transition-colors duration-500 focus-visible:outline-none focus-visible:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.5, ease: EASE_OUT }}
      >
        <span>{t('landing', 'featuredTitle')}</span>
        <span aria-hidden="true" className="relative block w-px h-10 bg-white/15 overflow-hidden">
          {!reduce && (
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-primary-light"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1], repeatDelay: 0.6 }}
            />
          )}
        </span>
        <ArrowDown aria-hidden="true" className="w-3.5 h-3.5 -mt-1 transition-transform duration-500 group-hover:translate-y-0.5" strokeWidth={1.5} />
      </motion.a>
    </section>
  );
};

export default Hero;
