import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = ({ t, heroPiece }) => {
  // Setup Framer Motion variants for staggered elegant entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative w-full min-h-screen pt-24 pb-16 z-10 flex items-center bg-[#030303] overflow-hidden">
      {/* Absolute Ambient Glows - gives a museum lighting feel */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#a83229]/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#a83229]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      {/* Subtle modern dot-grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRlcm4gaWQ9InNtYWxsR3JpZCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMTAgMEwwIDBMMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjAuNSIvPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9InVybCgjc21hbGxHcmlkKSIvPjxwYXRoIGQ9Ik00MCAwTDAgMEwwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40 mix-blend-overlay pointer-events-none z-0"></div>

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-8 gap-12 lg:gap-12 z-10">

        {/* ── LEFT: Typography & Storytelling ── */}
        <motion.div
          className="w-full lg:w-[45%] flex flex-col justify-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-[#a83229]"></div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#a83229]/20 bg-[#a83229]/10 backdrop-blur-md">
              <Sparkles size={12} className="text-[#a83229]" />
              <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/90">
                {t('landing', 'exhibitionBadge') || 'Curated Exhibition'}
              </span>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="font-serif font-light leading-[1.05] tracking-[-0.02em] mb-6 text-[2.75rem] md:text-[4.5rem] lg:text-[5rem] text-white"
          >
            {t('landing', 'heroTitle')}
            <br />
            <span className="hero-shimmer-text italic font-light">
              {t('landing', 'heroTitleItalic')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-gray-400 font-light leading-relaxed max-w-md mb-10 tracking-wide border-l border-white/10 pl-5"
          >
            {t('landing', 'heroSubtitle')}
          </motion.p>

          {/* CTA Links */}
          <motion.div variants={itemVariants} className="flex flex-row items-center flex-wrap gap-4 sm:gap-6 mt-3">
            <Link
              to="/collections"
              className="group relative flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black rounded-full overflow-hidden transition-transform hover:scale-105 duration-500"
            >
              <div className="absolute inset-0 bg-[#a83229] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
              <span className="relative z-10 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors group-hover:text-white">
                {t('landing', 'heroCtaPrimary') || 'Enter Gallery'}
              </span>
              <ArrowRight className="relative z-10 transition-colors group-hover:text-white w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>

            <Link
              to="/about"
              className="group flex items-center gap-2 sm:gap-3 px-1.5 sm:px-4 py-3.5 sm:py-4 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-white/50 hover:text-white transition-colors"
            >
              <div className="w-5 sm:w-10 h-[1px] bg-white/20 group-hover:bg-[#a83229] transition-colors duration-500"></div>
              {t('landing', 'heroCtaSecondary') || 'The Mastermind'}
            </Link>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Dynamic Masterpiece Frame (Bento Style & Glassmorphism) ── */}
        <motion.div
          className="w-full lg:w-[50%] relative h-[400px] sm:h-[500px] lg:h-[75vh] max-h-[700px] mt-4 lg:mt-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {heroPiece ? (
            <Link
              to={`/product/${heroPiece.id}`}
              className="relative block w-full h-full rounded-[2rem] overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
              {/* Image with extreme slow Ken Burns pan effect */}
              <motion.img
                src={heroPiece.img || ""}
                alt={`Masterpiece: ${heroPiece.name}`}
                fetchpriority="high"
                className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-[15s] group-hover:scale-110 ease-out"
              />

              {/* Dynamic Gradients for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-[#a83229]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay"></div>

              {/* Top Glass Pill & Price Badge */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                <div className="px-5 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a83229] animate-pulse"></span>
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/90">
                    {heroPiece.collections || t('landing', 'latestDrop') || 'Highlight'}
                  </span>
                </div>
                
                {/* ── Price Badge (top-right) ── */}
                {heroPiece.price && (
                  <div className="px-4 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-end">
                    <span className="text-[8px] tracking-widest uppercase text-white/60 mb-0.5">
                      {t('landing', 'startingAt') || 'Price'}
                    </span>
                    <span className="text-sm font-bold text-white tabular-nums tracking-wide">
                      {heroPiece.price}₺
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Glassmorphism Section (Bento Card Feel) */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-20">
                <div className="p-4 sm:p-8 rounded-[1.5rem] bg-black/30 backdrop-blur-xl border border-white/10 flex flex-row items-end justify-between gap-4 sm:gap-6 overflow-hidden relative group-hover:bg-[#a83229]/10 transition-colors duration-700">
                  {/* Subtle highlight line at top of inner card */}
                  <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

                  <div className="flex-1 min-w-0 z-10">
                    <p className="text-[#a83229] text-[9px] font-bold tracking-[0.3em] uppercase mb-1 sm:mb-3 drop-shadow-md">
                      {t('landing', 'featured') || 'Featured Work'}
                    </p>
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-serif text-white leading-tight font-light truncate drop-shadow-lg">
                      {heroPiece.name}
                    </h2>
                  </div>

                  {/* Elegant Discover Button */}
                  <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white bg-[#a83229] shadow-[0_0_20px_rgba(168,50,41,0.5)] group-hover:scale-110 group-hover:bg-white group-hover:text-[#a83229] transition-all duration-500 z-10 cursor-pointer">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            /* Loading / No Data Fallback focused on Art UX */
            <div className="w-full h-full rounded-[2rem] bg-[#0a0a0a] border border-white/5 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#a83229]/5"></div>
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-5 relative z-10"
              >
                <Sparkles className="text-[#a83229]" size={28} />
                <span className="text-white/40 font-serif tracking-[0.3em] uppercase text-xs">
                  {t('landing', 'curatingVault') || 'Curating Masterpiece...'}
                </span>
              </motion.div>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
