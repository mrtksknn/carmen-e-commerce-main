import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { MaskLine, FadeUp } from '../components/motion/Reveal';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <main className="min-h-[100svh] bg-background text-white flex items-center px-6">
      <SEO title={t('notFound', 'title')} />
      <div className="w-full max-w-7xl mx-auto">
        <FadeUp>
          <p className="font-serif italic text-2xl text-primary-light mb-6 tabular-nums">{t('notFound', 'errorCode')}</p>
        </FadeUp>
        <h1 className="font-serif font-light tracking-[-0.02em] leading-[1.02] text-[3rem] sm:text-[4.5rem] lg:text-[6rem] max-w-4xl text-balance">
          <MaskLine delay={0.15}>{t('notFound', 'title')}</MaskLine>
        </h1>
        <FadeUp delay={0.45}>
          <p className="mt-8 text-white/60 text-base md:text-lg font-light leading-relaxed max-w-lg">
            {t('notFound', 'subtitle')}
          </p>
          <Link
            to="/"
            className="group relative mt-12 inline-flex items-center gap-3 pl-7 pr-8 py-4 rounded-full bg-white text-black overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span aria-hidden="true" className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <ArrowLeft size={16} className="relative z-10 transition-all duration-500 group-hover:text-white group-hover:-translate-x-1" />
            <span className="relative z-10 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-500 group-hover:text-white">
              {t('notFound', 'backHome')}
            </span>
          </Link>
        </FadeUp>
        <p className="mt-24 text-[11px] tracking-[0.22em] uppercase text-white/35">
          Piece Of Oblivion · Beliz Keskin
        </p>
      </div>
    </main>
  );
};

export default NotFound;
