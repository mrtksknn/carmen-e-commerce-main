import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Palette, Brush, Eye, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const AboutMe = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#030303] min-h-screen text-white font-sans overflow-hidden relative">

      {/* Cinematic Ambient Glows */}
      <div className="absolute top-[10%] left-[-20%] w-[60vw] h-[60vw] bg-[#782222]/10 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#782222]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Noise Texture Overlay for Premium Vibe */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E")' }}></div>

      {/* ── Editorial Split Hero Section ── */}
      <section className="relative z-10 w-full min-h-[80vh] flex justify-center pt-24 lg:pt-12">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center">

          {/* Left Side: Photography */}
          <div className="lg:w-5/12 relative min-h-[50vh] lg:min-h-[85vh] w-full p-6 lg:p-12 group flex items-center justify-center">
            <div className="w-full h-[60vh] lg:h-full relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent z-10"></div>

              {/* Red Tint on Hover */}
              <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-[2s] pointer-events-none"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(120, 34, 34, 0.15) 0%, transparent 60%)' }}></div>

              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=1600&fit=crop"
                alt="The Artist Studio"
                className="w-full h-full object-cover object-center filter grayscale-[60%] contrast-110 group-hover:grayscale-0 transition-all duration-[20s] ease-out group-hover:scale-110"
              />
              {/* Vertical Text overlay for desktop */}
              <div className="absolute bottom-10 left-8 z-20 hidden lg:block opacity-40">
                <p className="writing-vertical-rl rotate-180 uppercase tracking-[0.5em] text-sm font-bold text-white">{t('about', 'behindCanvas') || 'BEHIND THE CANVAS'}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Manifesto & Bio */}
          <div className="lg:w-7/12 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 animate-fade-in relative z-10">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#c0392b]"></div>
              <span className="text-[#c0392b] font-extrabold tracking-[0.3em] uppercase text-[0.65rem] opacity-90">
                {t('about', 'mastermindLabel')}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black mb-8 font-serif leading-[1.05] tracking-tight">
              {t('about', 'heroTitle')} <br className="hidden md:block" />
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-[#c0392b]">
                {t('about', 'heroTitleHighlight')}
              </span>
            </h1>

            <div className="w-16 h-[2px] bg-gradient-to-r from-[#782222] to-transparent mb-10"></div>

            <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg max-w-2xl border-l-2 border-white/5 pl-6 group relative">
              {/* Sliding red border indicator */}
              <div className="absolute left-[-2px] inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-[#c0392b] to-transparent opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100 origin-top transition-all duration-700"></div>
              <p className="text-gray-300">{t('about', 'bio1')}</p>
              <p>{t('about', 'bio2')}</p>
            </div>

            {/* Social Proof / Stats Area */}
            <div className="grid grid-cols-2 gap-8 mt-16 border-t border-white/10 pt-10 max-w-sm">
              <div className="flex flex-col">
                <span className="text-5xl font-serif text-white leading-none mb-1 group"><span className="text-[#c0392b]">+</span>12</span>
                <span className="text-[0.6rem] text-gray-500 uppercase tracking-widest font-bold">{t('about', 'yearsCreating')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-5xl font-serif text-white leading-none mb-1 group"><span className="text-[#c0392b]">+</span>300</span>
                <span className="text-[0.6rem] text-gray-500 uppercase tracking-widest font-bold">{t('about', 'originalPieces')}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Method & Philosophy Matrix ── */}
      <section className="relative z-10 py-24 px-6 lg:px-20 max-w-[85rem] mx-auto">
        <div className="text-center mb-16 animate-fade-in flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 tracking-tight">{t('about', 'doctrineTitle')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            {t('about', 'doctrineSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="group bg-[#111]/40 border border-white/5 p-10 rounded-2xl backdrop-blur-md hover:bg-[#151515]/80 hover:border-[#782222]/40 hover:shadow-[0_20px_40px_rgba(120,34,34,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white group-hover:scale-150 group-hover:text-[#c0392b] transition-all duration-700">
              <Eye size={120} />
            </div>
            <div className="w-14 h-14 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-8 text-gray-300 group-hover:bg-[#782222]/20 group-hover:border-[#782222]/50 group-hover:text-[#c0392b] transition-all duration-500 shadow-inner">
              <Eye size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">{t('about', 'observationTitle')}</h3>
            <p className="text-gray-400 font-light leading-relaxed flex-1">
              {t('about', 'observationDesc')}
            </p>
          </div>

          {/* Card 2 (Elevated Center Card) */}
          <div className="group bg-[#111]/40 border border-white/5 p-10 rounded-2xl backdrop-blur-md hover:bg-[#151515]/80 hover:border-[#782222]/40 hover:shadow-[0_20px_40px_rgba(120,34,34,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col md:-translate-y-4">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white group-hover:scale-150 group-hover:text-[#c0392b] transition-all duration-700">
              <Palette size={120} />
            </div>
            <div className="w-14 h-14 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-8 text-gray-300 group-hover:bg-[#782222]/20 group-hover:border-[#782222]/50 group-hover:text-[#c0392b] transition-all duration-500 shadow-inner">
              <Palette size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">{t('about', 'colorMappingTitle')}</h3>
            <p className="text-gray-400 font-light leading-relaxed flex-1">
              {t('about', 'colorMappingDesc')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-[#111]/40 border border-white/5 p-10 rounded-2xl backdrop-blur-md hover:bg-[#151515]/80 hover:border-[#782222]/40 hover:shadow-[0_20px_40px_rgba(120,34,34,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white group-hover:scale-150 group-hover:text-[#c0392b] transition-all duration-700">
              <Brush size={120} />
            </div>
            <div className="w-14 h-14 bg-white/5 rounded-full border border-white/10 flex items-center justify-center mb-8 text-gray-300 group-hover:bg-[#782222]/20 group-hover:border-[#782222]/50 group-hover:text-[#c0392b] transition-all duration-500 shadow-inner">
              <Brush size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-4">{t('about', 'executionTitle')}</h3>
            <p className="text-gray-400 font-light leading-relaxed flex-1">
              {t('about', 'executionDesc')}
            </p>
          </div>

        </div>
      </section>

      {/* ── Connect & Contact Glass Card ── */}
      <section className="relative z-10 py-12 px-6 lg:px-20 mb-16 max-w-[65rem] mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)] border border-white/10 group">

          {/* Glass background & Glows */}
          <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-2xl z-0"></div>
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,34,34,0.3)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(120,34,34,0.15)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

          {/* Content */}
          <div className="relative z-10 p-12 md:p-20 text-center flex flex-col items-center">

            <div className="w-20 h-20 bg-[#111] rounded-full flex items-center justify-center mb-8 shadow-inner ring-1 ring-white/10 text-[#c0392b] group-hover:ring-[#c0392b]/50 group-hover:bg-[#782222]/10 transition-all duration-500">
              <Mail size={32} />
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg tracking-tight">
              {t('about', 'commissionTitle')}
            </h2>

            <p className="text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed mb-10">
              {t('about', 'commissionDesc')}
            </p>

            {/* Premium Call to Action Button */}
            <Link
              to="/contact"
              className="relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full p-[1px] group/btn"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#782222] via-[#c0392b] to-[#782222] opacity-70 group-hover/btn:opacity-100 blur-[2px] transition-opacity duration-500"></span>
              <span className="relative flex items-center justify-center gap-3 bg-[#0a0a0a] border border-white/10 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[0.7rem] transition-all duration-300 group-hover/btn:bg-transparent">
                {t('about', 'commissionCta')} <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutMe;
