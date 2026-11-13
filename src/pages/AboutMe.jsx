import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import SEO from "../components/SEO";
import StudioImg from "../assets/images/studio.webP";
import { MaskLine, FadeUp, ScrollWords, EASE_OUT } from "../components/motion/Reveal";

const AboutMe = () => {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const heroRef = useRef(null);

  // The studio recedes and dims as the visitor moves from the room into the story
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const process = [
    { id: "observation", title: t("about", "observationTitle"), desc: t("about", "observationDesc") },
    { id: "color", title: t("about", "colorMappingTitle"), desc: t("about", "colorMappingDesc") },
    { id: "execution", title: t("about", "executionTitle"), desc: t("about", "executionDesc") },
  ];

  return (
    <main className="bg-background min-h-screen text-white font-sans relative">
      <SEO title={t("seo", "aboutTitle")} description={t("seo", "aboutDesc")} />

      {/* ── The studio ── */}
      <section ref={heroRef} className="relative h-[100svh] w-full flex items-end overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={reduce ? undefined : { y: imgY, scale: imgScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE_OUT }}
        >
          <img src={StudioImg} alt={t("salon", "studioAlt")} className="w-full h-full object-cover brightness-[0.38] contrast-[1.1]" />
        </motion.div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />

        <motion.div
          className="relative w-full max-w-7xl mx-auto px-6 pb-24 lg:pb-32"
          style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <h1 className="font-serif font-light tracking-[-0.02em] leading-[1.02] text-[3rem] sm:text-[4.5rem] lg:text-[6rem] text-white max-w-4xl">
            <MaskLine delay={0.4}>{t("about", "heroTitle")}</MaskLine>
            <MaskLine delay={0.55} className="italic text-primary-light">
              {t("about", "heroTitleHighlight")}
            </MaskLine>
          </h1>
          <FadeUp delay={0.9}>
            <p className="mt-8 font-serif italic text-xl text-white/70">Beliz Keskin</p>
          </FadeUp>
        </motion.div>
      </section>

      {/* ── The artist: view of art (read as you scroll), then biography and approach ── */}
      <section className="relative py-28 lg:py-40 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20">
          <div className="lg:col-span-7">
            <ScrollWords
              text={t("about", "bio1")}
              className="font-serif font-light text-[1.75rem] sm:text-[2.1rem] lg:text-[2.4rem] leading-[1.25] text-white"
            />
          </div>
          <div className="lg:col-span-5 lg:pt-3">
            <FadeUp inView>
              <span aria-hidden="true" className="block w-12 h-px bg-primary-light mb-8" />
              <p className="text-white/70 font-light leading-relaxed text-base md:text-lg max-w-prose">
                {t("about", "bio2")}
              </p>
            </FadeUp>
            <FadeUp inView delay={0.15}>
              <p className="mt-6 text-white/60 font-light leading-relaxed text-base md:text-lg max-w-prose">
                {t("about", "bio3")}
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="relative py-24 lg:py-32 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 lg:mb-20">
            <h2 className="lg:col-span-5 font-serif font-light text-[2.5rem] md:text-6xl leading-[1.04] tracking-[-0.02em] text-white">
              <MaskLine inView>{t("about", "doctrineTitle")}</MaskLine>
            </h2>
            {t("about", "doctrineSubtitle") && (
              <FadeUp inView delay={0.15} className="lg:col-span-6 lg:col-start-7 lg:pt-4">
                <p className="text-white/60 font-light leading-relaxed text-base md:text-lg">
                  {t("about", "doctrineSubtitle")}
                </p>
              </FadeUp>
            )}
          </div>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
            {process.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: EASE_OUT }}
              >
                <span aria-hidden="true" className="block h-px bg-white/15 mb-8 overflow-hidden">
                  <motion.span
                    className="block h-full bg-primary-light origin-left"
                    initial={{ scaleX: reduce ? 1 : 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 1.2, delay: 0.2 + i * 0.12, ease: EASE_OUT }}
                  />
                </span>
                <h3 className="font-serif font-light text-3xl text-white mb-4">{item.title}</h3>
                <p className="text-white/60 font-light leading-relaxed">{item.desc}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Commission ── */}
      <section className="relative px-6 py-28 lg:py-40 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif font-light text-[2.5rem] md:text-6xl leading-[1.05] tracking-[-0.02em] text-white text-balance">
            <MaskLine inView>{t("about", "commissionTitle")}</MaskLine>
          </h2>
          <FadeUp inView delay={0.15}>
            <p className="mt-8 text-white/60 max-w-xl mx-auto font-light leading-relaxed text-base md:text-lg">
              {t("about", "commissionDesc")}
            </p>
          </FadeUp>
          <FadeUp inView delay={0.3}>
            <Link
              to="/contact"
              className="group relative mt-12 inline-flex items-center gap-3 pl-8 pr-7 py-4 rounded-full bg-white text-black overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span aria-hidden="true" className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="relative z-10 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-500 group-hover:text-white">
                {t("about", "commissionCta")}
              </span>
              <ArrowRight size={16} className="relative z-10 transition-all duration-500 group-hover:text-white group-hover:translate-x-1" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </main>
  );
};

export default AboutMe;
