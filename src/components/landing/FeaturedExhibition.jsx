import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FeaturedExhibition = ({ t, galleryPieces }) => {
  // Framer motion variants for scroll reveal
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
    <section className="relative bg-[#030303] py-24 lg:pt-8 lg:pb-16 px-6 z-20 overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#a83229]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 lg:mb-20 gap-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          <div className="max-w-2xl">
            {/* Title */}
            <motion.h2
              variants={item}
              className="font-serif font-light text-white leading-[1.05] tracking-tight text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem]"
            >
              {t('landing', 'featuredTitle') || 'Featured Exhibition'}
              <span className="text-[#a83229]">.</span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={item}
              className="text-gray-400 text-base md:text-lg font-light mt-6 leading-relaxed tracking-wide border-l border-[#a83229]/30 pl-5"
            >
              {t('landing', 'featuredSubtitle') || 'Discover the most monumental pieces curated exclusively for our digital gallery viewers.'}
            </motion.p>
          </div>

          {/* View All — desktop */}
          <motion.div variants={item} className="hidden md:flex pb-2">
            <Link
              to="/collections"
              className="group flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300"
            >
              <span>{t('landing', 'viewFullGallery') || 'View Collection'}</span>
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Asymmetric Bento Gallery Grid ── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 auto-rows-min"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
        >
          {galleryPieces && galleryPieces.length > 0 ? galleryPieces.slice(0, 3).map((artwork, index) => {
            const isFeatured = index === 0;

            return (
              <motion.div
                key={artwork.id}
                variants={item}
                className={`${isFeatured ? 'md:col-span-2 md:row-span-2 h-[450px] md:h-[600px] lg:h-[700px]' : 'col-span-1 h-[350px] md:h-[284px] lg:h-[334px]'} relative rounded-[2rem] overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5 bg-[#0a0a0a]`}
              >
                <Link to={`/product/${artwork.id}`} className="absolute inset-0 block w-full h-full">
                  {/* Image with Ken Burns effect */}
                  <img
                    src={artwork.img}
                    alt={artwork.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-[20s] group-hover:scale-110 ease-out"
                  />

                  {/* Dynamic Dark & Color Overlays */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${isFeatured ? 'from-[#030303] via-[#030303]/30' : 'from-[#030303] via-black/10'} to-transparent z-10 opacity-90 group-hover:opacity-80 transition-opacity duration-700`}></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#a83229]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay"></div>

                  {/* Top Badge Overlay (Price Only) */}
                  <div className="absolute top-6 left-6 right-6 flex justify-end items-start z-20">
                    {/* Elegant Price Tag */}
                    {artwork.price && (
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-end shadow-lg">
                        <span className="text-[7px] sm:text-[8px] tracking-widest uppercase text-white/60 mb-0.5">
                          {t('landing', 'startingAt') || 'Price'}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white tabular-nums tracking-wide">
                          {artwork.price}₺
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Info Panel (Glassmorphism Bento inside frame) */}
                  <div className={`absolute bottom-0 left-0 w-full z-20 p-4 sm:p-6 lg:p-8`}>
                    <div className={`rounded-[1.5rem] bg-black/40 backdrop-blur-2xl border border-white/10 flex flex-row items-center justify-between overflow-hidden relative group-hover:bg-[#a83229]/10 transition-colors duration-700 gap-4 sm:gap-6 ${isFeatured ? 'p-5 sm:p-8' : 'p-4 sm:p-6'}`}>
                      {/* Highlight line on top */}
                      <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40"></div>

                      <div className="flex-1 min-w-0 z-10">
                        <p className="text-[#a83229] text-[9px] font-bold tracking-[0.3em] uppercase mb-1 sm:mb-2 drop-shadow-md">
                          {artwork.collections || t('landing', 'featuredSelection') || 'Curated'}
                        </p>
                        <h3 className={`font-serif text-white leading-tight font-light truncate drop-shadow-md ${isFeatured ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-lg sm:text-2xl'}`}>
                          {artwork.name}
                        </h3>
                        {/* Summary Description, only for featured item */}
                        {isFeatured && artwork.description && (
                          <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-2 font-light max-w-lg hidden md:block">
                            {artwork.description}
                          </p>
                        )}
                      </div>

                      {/* Arrow Discover Button */}
                      <div className={`flex-shrink-0 flex items-center justify-center text-white transition-all duration-500 z-10 ${isFeatured ? 'w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#a83229] shadow-[0_0_20px_rgba(168,50,41,0.5)] group-hover:scale-110 group-hover:bg-white group-hover:text-[#a83229]' : 'flex w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/5 group-hover:border-[#a83229] group-hover:bg-[#a83229]'}`}>
                        <ArrowRight className={`-rotate-45 group-hover:rotate-0 transition-transform duration-500 ${isFeatured ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-4 h-4'}`} />
                      </div>

                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          }) : (
            /* Elegant Skeleton Loaders */
            <>
              <div className="md:col-span-2 md:row-span-2 h-[450px] md:h-[600px] lg:h-[700px] rounded-[2rem] bg-white/5 animate-pulse border border-white/10"></div>
              <div className="col-span-1 h-[350px] md:h-[284px] lg:h-[334px] rounded-[2rem] bg-white/5 animate-pulse border border-white/10"></div>
              <div className="col-span-1 h-[350px] md:h-[284px] lg:h-[334px] rounded-[2rem] bg-white/5 animate-pulse border border-white/10"></div>
            </>
          )}
        </motion.div>

        {/* View All — mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center md:hidden relative z-10"
        >
          <Link
            to="/collections"
            className="group flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300"
          >
            <span>{t('landing', 'viewAllArtworks') || 'Explore Gallery'}</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedExhibition;
