import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, Brush, Eye, Mail, ArrowRight, Quote } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import { motion, useScroll, useTransform } from "framer-motion";

// Import new storytelling assets
import StudioImg from "../assets/images/studio.webP";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const AboutMe = () => {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen text-white font-sans overflow-hidden relative selection:bg-primary selection:text-white">
      <SEO
        title={t('seo', 'aboutTitle')}
        description={t('seo', 'aboutDesc')}
      />

      {/* ── 1. CINEMATIC HERO SECTION (Full Bleed) ── */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img
            src={StudioImg}
            alt="Artist Studio"
            className="w-full h-full object-cover scale-110 brightness-[0.3] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]"></div>
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-px bg-primary mb-8 shadow-[0_0_10px_rgba(168,50,41,1)]"></div>
            <h1 className="text-5xl md:text-8xl font-serif font-black tracking-tight leading-tight mb-8">
              {t('about', 'heroTitle')} <br />
              <span className="text-primary italic font-light">{t('about', 'heroTitleHighlight')}</span>
            </h1>
            <div className="flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.4em] text-gray-400">
              <span>EST. 2014</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
              <span>CARMEN ARTS</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500">Discover the Process</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </motion.div>
      </section>

      {/* ── 2. THE PHILOSOPHY (Split Text) ── */}
      <section className="relative z-10 py-24 lg:py-40 px-6 lg:px-20 max-w-[85rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="space-y-8"
        >
          <div className="p-4 bg-primary/5 border border-primary/20 inline-block rounded-2xl">
            <Quote className="text-primary w-8 h-8" />
          </div>
          <p className="text-2xl md:text-4xl font-serif leading-snug text-white/90">
            {t('about', 'bio1')}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="space-y-10"
        >
          <div className="w-16 h-px bg-white/20"></div>
          <div className="space-y-6 text-gray-400 font-light leading-relaxed text-base md:text-lg">
            <p>{t('about', 'bio2')}</p>
          </div>

          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/5">
            <div>
              <span className="text-4xl font-serif text-white block mb-2">12+</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t('about', 'yearsCreating')}</span>
            </div>
            <div>
              <span className="text-4xl font-serif text-white block mb-2">300+</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t('about', 'originalPieces')}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 4. THE DOCTRINE (Bento Grid) ── */}
      <section className="relative z-10 py-24 lg:py-40 px-6 lg:px-20 max-w-[85rem] mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">{t('about', 'doctrineTitle')}</h2>
          <div className="w-20 h-px bg-primary mx-auto mb-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { id: 'observation', icon: Eye, title: t('about', 'observationTitle'), desc: t('about', 'observationDesc') },
            { id: 'color', icon: Palette, title: t('about', 'colorMappingTitle'), desc: t('about', 'colorMappingDesc') },
            { id: 'execution', icon: Brush, title: t('about', 'executionTitle'), desc: t('about', 'executionDesc') }
          ].map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group p-10 rounded-[2.5rem] bg-[#0c0c0c] border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="text-2xl font-serif text-white mb-4">{item.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. FINAL CALL (Luxury Card) ── */}
      <section className="relative z-10 px-6 lg:px-20 pb-40 max-w-[60rem] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 md:p-24 rounded-[3rem] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 relative overflow-hidden group shadow-3xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-primary"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">{t('about', 'commissionTitle')}</h2>
            <p className="text-gray-400 max-w-lg mx-auto font-light leading-relaxed mb-12">
              {t('about', 'commissionDesc')}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-6 px-10 py-5 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 font-bold uppercase tracking-[0.2em] text-[11px] group"
            >
              {t('about', 'commissionCta')}
              <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform" />
            </Link>
          </div>

          {/* Subtle Glow */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000"></div>
        </motion.div>
      </section>
    </main>
  );
};

export default AboutMe;
