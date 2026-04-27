import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, Brush, Eye, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const AboutMe = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#030303] min-h-screen text-white font-sans overflow-hidden relative selection:bg-[#a83229] selection:text-white">
      <SEO 
        title="About Me"
        description="Learn about the master artist behind Carmen's unique creations."
      />

      {/* Cinematic Ambient Glows */}
      <div className="absolute top-[10%] left-[-20%] w-[60vw] h-[60vw] bg-[#a83229]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#a83229]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Noise Texture Overlay for Premium Vibe */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E")' }}></div>

      {/* ── Editorial Split Hero Section ── */}
      <section className="relative z-10 w-full min-h-[80vh] flex justify-center pt-24 lg:pt-32">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[80rem] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8 xl:gap-16"
        >

          {/* Left Side: Photography */}
          <motion.div variants={fadeInUp} className="lg:w-1/2 relative min-h-[50vh] lg:min-h-[80vh] w-full p-6 lg:p-0 group flex items-center justify-center">
            <div className="w-full h-[60vh] lg:h-full lg:max-h-[800px] relative rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 bg-[#0a0a0a]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10 opacity-80"></div>
              
              <div className="absolute inset-0 bg-gradient-to-tr from-[#a83229]/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-overlay pointer-events-none"></div>

              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=1600&fit=crop"
                alt="The Artist Studio"
                fetchpriority="high"
                loading="eager"
                className="w-full h-full object-cover object-center filter grayscale-[30%] contrast-110 group-hover:grayscale-0 transition-transform duration-[20s] ease-out group-hover:scale-110"
              />
              
              <div className="absolute bottom-10 left-8 z-20 hidden lg:block opacity-40 mix-blend-overlay">
                <p className="writing-vertical-rl rotate-180 uppercase tracking-[0.5em] text-sm font-bold text-white">{t('about', 'behindCanvas') || 'BEHIND THE CANVAS'}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Manifesto & Bio */}
          <motion.div variants={staggerContainer} className="lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-8 py-0 relative z-10">
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#a83229]"></div>
              <span className="text-[#a83229] font-extrabold tracking-[0.3em] uppercase text-[9px] opacity-90 drop-shadow-[0_0_15px_rgba(168,50,41,0.5)]">
                {t('about', 'mastermindLabel') || 'The Mastermind'}
              </span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-[5rem] font-black mb-8 font-serif leading-[1.05] tracking-tight">
              {t('about', 'heroTitle')} <br className="hidden md:block" />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-[#a83229]/60">
                {t('about', 'heroTitleHighlight')}
              </span>
            </motion.h1>

            <motion.div variants={fadeInUp} className="w-16 h-[1px] bg-white/20 mb-10"></motion.div>

            <motion.div variants={fadeInUp} className="space-y-6 text-gray-400 font-light leading-relaxed text-sm md:text-base max-w-xl pr-4">
              <p className="text-gray-300">{t('about', 'bio1')}</p>
              <p>{t('about', 'bio2')}</p>
            </motion.div>

            {/* Social Proof / Stats Area */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8 mt-12 border-t border-white/5 pt-10 max-w-sm">
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-serif text-white leading-none mb-2"><span className="text-[#a83229]">+</span>12</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{t('about', 'yearsCreating')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-serif text-white leading-none mb-2"><span className="text-[#a83229]">+</span>300</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{t('about', 'originalPieces')}</span>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
      </section>

      {/* ── Method & Philosophy Bento Matrix (Glassmorphism) ── */}
      <section className="relative z-10 py-24 lg:py-32 px-6 lg:px-20 max-w-[85rem] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 tracking-tight">{t('about', 'doctrineTitle')}</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base font-light leading-relaxed">
            {t('about', 'doctrineSubtitle')}
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Card 1 */}
          <motion.div variants={fadeInUp} className="group bg-[#0a0a0a]/50 border border-white/5 p-8 lg:p-10 rounded-[2rem] backdrop-blur-3xl hover:bg-[#a83229]/5 hover:border-[#a83229]/40 hover:shadow-[0_20px_40px_rgba(168,50,41,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white group-hover:scale-[1.8] group-hover:text-[#a83229] transition-transform duration-[1s] ease-out pointer-events-none">
              <Eye size={120} />
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-8 text-gray-400 group-hover:bg-[#a83229] group-hover:border-[#a83229] group-hover:text-white transition-all duration-500 shadow-inner">
              <Eye size={20} />
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-white mb-4 z-10">{t('about', 'observationTitle')}</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed flex-1 z-10">
              {t('about', 'observationDesc')}
            </p>
          </motion.div>

          {/* Card 2 (Elevated) */}
          <motion.div variants={fadeInUp} className="group bg-[#0a0a0a]/50 border border-white/5 p-8 lg:p-10 rounded-[2rem] backdrop-blur-3xl hover:bg-[#a83229]/5 hover:border-[#a83229]/40 hover:shadow-[0_20px_40px_rgba(168,50,41,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col md:-translate-y-6">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white group-hover:scale-[1.8] group-hover:text-[#a83229] transition-transform duration-[1s] ease-out pointer-events-none">
              <Palette size={120} />
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-8 text-gray-400 group-hover:bg-[#a83229] group-hover:border-[#a83229] group-hover:text-white transition-all duration-500 shadow-inner">
              <Palette size={20} />
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-white mb-4 z-10">{t('about', 'colorMappingTitle')}</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed flex-1 z-10">
              {t('about', 'colorMappingDesc')}
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeInUp} className="group bg-[#0a0a0a]/50 border border-white/5 p-8 lg:p-10 rounded-[2rem] backdrop-blur-3xl hover:bg-[#a83229]/5 hover:border-[#a83229]/40 hover:shadow-[0_20px_40px_rgba(168,50,41,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white group-hover:scale-[1.8] group-hover:text-[#a83229] transition-transform duration-[1s] ease-out pointer-events-none">
              <Brush size={120} />
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-8 text-gray-400 group-hover:bg-[#a83229] group-hover:border-[#a83229] group-hover:text-white transition-all duration-500 shadow-inner">
              <Brush size={20} />
            </div>
            <h3 className="text-xl md:text-2xl font-serif text-white mb-4 z-10">{t('about', 'executionTitle')}</h3>
            <p className="text-gray-400 font-light text-sm leading-relaxed flex-1 z-10">
              {t('about', 'executionDesc')}
            </p>
          </motion.div>

        </motion.div>
      </section>

      {/* ── Connect & Contact Glass Card ── */}
      <section className="relative z-10 px-6 lg:px-20 pb-24 md:pb-32 max-w-[55rem] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10 group bg-[#050505]/60 backdrop-blur-3xl"
        >

          {/* Full Glassmorphism background & Glows */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
          
          <div className="absolute -top-[50%] -right-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(168,50,41,0.08)_0%,transparent_60%)] opacity-30 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none z-0"></div>
          
          {/* Content */}
          <div className="relative z-10 p-10 md:p-16 lg:p-20 text-center flex flex-col items-center">

            <div className="w-16 h-16 bg-[#0a0a0a] rounded-full flex items-center justify-center mb-6 border border-white/5 text-[#a83229] group-hover:border-[#a83229]/40 group-hover:bg-[#a83229]/10 transition-all duration-500 shadow-[0_0_30px_rgba(168,50,41,0.15)]">
              <Mail size={24} />
            </div>

            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 drop-shadow-md tracking-tight">
              {t('about', 'commissionTitle')}
            </h2>

            <p className="text-sm md:text-base text-gray-400 max-w-lg mx-auto font-light leading-relaxed mb-10">
              {t('about', 'commissionDesc')}
            </p>

            {/* Subtle Luxury Action Button */}
            <Link
              to="/contact"
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center p-4 sm:px-8 sm:py-5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-[#a83229] hover:border-[#a83229] transition-all duration-500 group/btn shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_15px_30px_rgba(168,50,41,0.4)] gap-6"
            >
              <span className="uppercase tracking-[0.2em] text-[11px] font-bold pl-2">{t('about', 'commissionCta') || 'Acquire Work'}</span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-[#a83229] transition-all duration-500">
                <ArrowRight size={14} className="-rotate-45 group-hover/btn:rotate-0 transition-transform duration-500" />
              </div>
            </Link>

          </div>
        </motion.div>
      </section>

    </main>
  );
};

export default AboutMe;
