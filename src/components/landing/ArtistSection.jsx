import React from 'react';
import { Link } from '../ui/LocaleLink';
import { ArrowRight } from 'lucide-react';
import StudioImg from '../../assets/images/studio.webP';
import { FadeUp, Unveil, ArtworkImage, ScrollWords } from '../motion/Reveal';

const ArtistSection = ({ t }) => {
  return (
    <section className="relative bg-background py-28 short:py-16 lg:py-40 px-6 z-20">
      <div className="max-w-7xl mx-auto relative flex flex-col md:flex-row items-center gap-16 md:gap-12 lg:gap-24">

        {/* ── Statement ── */}
        <div className="flex-1 w-full flex flex-col justify-center">
          <ScrollWords
            text={t('landing', 'artistQuote')}
            className="font-serif font-light text-white leading-[1.2] tracking-[-0.01em] text-[1.85rem] sm:text-[2.3rem] md:text-[1.75rem] lg:text-[2.3rem] xl:text-[2.75rem] mb-10 text-pretty"
          />

          <FadeUp inView>
            <p className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-12 max-w-xl">
              {t('landing', 'artistBio')}
            </p>
          </FadeUp>

          <FadeUp inView delay={0.15}>
            <Link
              to="/about"
              className="hit group relative inline-flex items-center gap-3 py-2 text-xs font-semibold tracking-[0.18em] uppercase text-white hover:text-white transition-colors duration-500 focus-visible:outline-none"
            >
              <span>{t('landing', 'artistCta')}</span>
              <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
              <span aria-hidden="true" className="absolute left-0 right-0 bottom-0 h-px bg-white/15 overflow-hidden">
                <span className="absolute inset-0 bg-primary-light origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </span>
            </Link>
          </FadeUp>
        </div>

        {/* ── Studio ── */}
        <div className="flex-1 w-full">
          <Unveil inView duration={1.4} className="relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[4/5] short:aspect-[4/3]">
            <figure className="absolute inset-0 overflow-hidden rounded-[3px] bg-surface shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]">
              <ArtworkImage
                src={StudioImg}
                alt={t('landing', 'artistSectionLabel')}
                inView
                drift={7}
                loading="lazy"
                decoding="async"
                imgClassName="brightness-[0.85] contrast-[1.05]"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
              <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3px]" />

              <figcaption className="absolute left-6 bottom-6 sm:left-8 sm:bottom-8">
                <span className="block font-serif text-white text-2xl leading-none">Beliz Keskin</span>
                <span className="block mt-2 text-[11px] uppercase tracking-[0.22em] text-white/60 font-medium">
                  {t('landing', 'artistSectionLabel')}
                </span>
              </figcaption>
            </figure>
          </Unveil>
        </div>
      </div>
    </section>
  );
};

export default ArtistSection;
