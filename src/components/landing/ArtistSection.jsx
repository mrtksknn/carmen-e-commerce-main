import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from '../../lib/constants';

const ArtistSection = ({ t }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative bg-[#030303] py-24 lg:py-32 px-6 z-20 overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#a83229]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2"></div>

      <motion.div 
        className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
      >
        
        {/* ── LEFT: Content ── */}
        <div className="flex-1 w-full flex flex-col justify-center">
          {/* Eyebrow Label */}
          <motion.div variants={item} className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-[#a83229]"></div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">
              {t('landing', 'artistSectionLabel') || 'The Mastermind'}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div variants={item} className="mb-8 lg:mb-10">
            <h2 className="font-serif font-light text-white leading-[1.1] tracking-tight text-4xl sm:text-5xl lg:text-[3.5rem]">
              {t('landing', 'artistQuote') || 'Art is the profound silence that speaks to the soul.'}
            </h2>
          </motion.div>

          {/* Bio text */}
          <motion.p 
            variants={item}
            className="text-gray-400 text-base md:text-lg font-light leading-relaxed mb-12 max-w-xl"
          >
            {t('landing', 'artistBio') || 'Carmen represents a new paradigm in digital artistry. Bringing forward classical techniques married seamlessly with evocative storytelling, each piece is crafted to exist not just as visual pleasure, but as a masterpiece living on the digital canvas.'}
          </motion.p>

          {/* CTA */}
          <motion.div variants={item}>
            <Link to="/about" className="inline-flex items-center gap-3 text-white hover:text-[#a83229] transition-colors duration-300 group">
              <span className="uppercase tracking-widest text-xs font-bold">{t('landing', 'artistCta') || 'Discover More'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* ── RIGHT: Cinematic Image ── */}
        <motion.div 
          variants={item}
          className="flex-1 w-full lg:w-auto relative"
        >
          {/* Framed Image Container (Bento approach) */}
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden group border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            
            {/* The Image with subtle zoom */}
            <img
              src={IMAGES.ARTIST_AT_WORK}
              alt="Artist at work"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-[20s] group-hover:scale-105 ease-out"
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/80 via-transparent to-transparent z-10 opacity-90 group-hover:opacity-70 transition-opacity duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#a83229]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay"></div>

            {/* Floating Signature Badge (Glassmorphism) */}
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20">
              <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-[1.5rem] shadow-xl">
                {/* Avatar / Monogram */}
                <div className="w-10 h-10 rounded-full bg-[#a83229] flex items-center justify-center text-white font-serif tracking-widest text-sm shadow-[0_0_15px_rgba(168,50,41,0.5)]">
                  CM
                </div>
                {/* Details */}
                <div className="flex flex-col pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-white text-lg leading-none">Carmen</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a83229] animate-pulse mt-0.5"></span>
                  </div>
                  <span className="text-[9px] uppercase tracking-widest text-white/50 font-bold mt-1">
                    {t('landing', 'artistSectionLabel') || 'Visual Artist'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

export default ArtistSection;
