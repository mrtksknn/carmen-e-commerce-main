import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ArtworkCard from '../components/ArtworkCard';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { MaskLine, FadeUp, EASE_OUT } from '../components/motion/Reveal';
import { artImage } from '../lib/artImage';
import { registerProducts } from '../lib/artworkPath';
import { APP_CONFIG } from '../lib/constants';
import { breadcrumbSchema, jsonLd, slugify } from '../lib/seo-data.mjs';
import { useParams } from 'react-router-dom';
import { Link, Navigate } from '../components/ui/LocaleLink';

const Collections = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [collectionsInfo, setCollectionsInfo] = useState([]);
  // Each room has its own address: /collections/<room>; /collections shows every work
  const { room: roomSlug } = useParams();
  const [loaded, setLoaded] = useState(false);

  // Embla Carousel Hook
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const currentRoom = roomSlug ? collectionsInfo.find((c) => slugify(c.name) === roomSlug) : null;
  const selectedCategory = currentRoom ? currentRoom.name : 'All';

  const filteredArtworks = selectedCategory === 'All'
    ? products
    : products.filter(artwork => artwork.collections === selectedCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        let list = [];
        const colMap = new Map();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          list.push({ id: doc.id, ...data });

          if (data.collections) {
            // Keep the first product image as the cover art for the collection
            if (!colMap.has(data.collections)) {
              colMap.set(data.collections, data.img);
            }
          }
        });

        // Time sorting
        list.sort((a, b) => {
          return (b.timeStamp?.seconds || 0) - (a.timeStamp?.seconds || 0);
        });

        registerProducts(list);
        setProducts(list);

        // Map abstract collections
        const info = Array.from(colMap.entries()).map(([name, cover]) => ({
          name,
          cover
        }));
        setCollectionsInfo(info);
        setLoaded(true);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsub();
  }, []);

  const rooms = [
    { key: 'All', label: t('collections', 'vaultTitle'), sub: t('collections', 'vaultSubtitle'), cover: null, to: '/collections' },
    ...collectionsInfo.map((c) => ({ key: c.name, label: c.name, sub: null, cover: c.cover, to: `/collections/${slugify(c.name)}` })),
  ];

  // A room that no longer exists falls back to the full gallery
  if (roomSlug && loaded && !currentRoom) return <Navigate to="/collections" replace />;

  const seoTitle = currentRoom ? `${currentRoom.name} — ${t('seo', 'collectionsTitle')}` : t('seo', 'collectionsTitle');
  const seoCrumbs = [{ name: 'Piece Of Oblivion', path: '/' }, { name: t('seo', 'collectionsTitle'), path: '/collections' }]
    .concat(currentRoom ? [{ name: currentRoom.name, path: `/collections/${roomSlug}` }] : []);

  return (
    <main className="bg-background min-h-screen text-white font-sans relative">
      <SEO
        title={seoTitle}
        description={t('seo', 'collectionsDesc')}
        schema={jsonLd(breadcrumbSchema(APP_CONFIG.BASE_URL, seoCrumbs, language))}
      />

      {/* ── Header ── */}
      <header className="relative pt-36 lg:pt-44 pb-14 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif font-light tracking-[-0.02em] leading-[1.02] text-[3rem] sm:text-[4rem] lg:text-[5.5rem] text-white">
            <MaskLine delay={0.15}>
              {t('collections', 'heroTitle')}{' '}
              <span className="italic text-primary-light">{t('collections', 'heroTitleHighlight')}</span>
            </MaskLine>
          </h1>
          <FadeUp delay={0.45}>
            <p className="mt-6 text-base md:text-lg text-white/60 max-w-xl font-light leading-relaxed">
              {t('collections', 'heroSubtitle')}
            </p>
          </FadeUp>
        </div>
      </header>

      {/* ── Rooms ── */}
      <FadeUp delay={0.6} className="relative px-6 mb-20">
        <div className="max-w-7xl mx-auto relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {rooms.map((room) => {
                const active = selectedCategory === room.key;
                return (
                  <Link
                    key={room.key}
                    to={room.to}
                    aria-current={active ? 'page' : undefined}
                    className="group flex-[0_0_auto] w-[240px] md:w-[300px] text-left focus-visible:outline-none"
                  >
                    <span className={`relative block h-[150px] md:h-[190px] overflow-hidden rounded-[3px] bg-surface transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-55 group-hover:opacity-90'} group-focus-visible:ring-2 group-focus-visible:ring-primary-light group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-background`}>
                      {room.cover ? (
                        <img
                          {...artImage(room.cover, { sizes: '300px', maxWidth: 800 })}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                        />
                      ) : (
                        <span className="absolute inset-0 bg-[radial-gradient(80%_80%_at_30%_20%,rgba(175,54,44,0.22),transparent_70%)]" />
                      )}
                      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[3px]" />
                    </span>

                    <span className="mt-4 flex items-baseline justify-between gap-3">
                      <span className={`font-serif text-xl md:text-2xl leading-tight transition-colors duration-500 ${active ? 'text-white' : 'text-white/55 group-hover:text-white/85'}`}>
                        {room.label}
                      </span>
                      {room.sub && <span className="text-[11px] tracking-[0.18em] uppercase text-white/40">{room.sub}</span>}
                    </span>

                    {/* Active rule draws across beneath the chosen room */}
                    <span aria-hidden="true" className="mt-3 block h-px bg-white/10 overflow-hidden">
                      <span className={`block h-full bg-primary-light origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {collectionsInfo.length > 2 && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={scrollPrev}
                aria-label={t('collections', 'prevRoom')}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors duration-300"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={scrollNext}
                aria-label={t('collections', 'nextRoom')}
                className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors duration-300"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </FadeUp>

      {/* ── The wall ── */}
      <section className="relative px-6 pb-36 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between border-b border-white/10 pb-5 mb-12 gap-4">
            <AnimatePresence mode="wait">
              <motion.h2
                key={selectedCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="font-serif font-light text-3xl md:text-4xl text-white leading-tight"
              >
                {selectedCategory === 'All' ? t('collections', 'completeArchive') : selectedCategory}
              </motion.h2>
            </AnimatePresence>
            <p className="text-sm text-white/55 tabular-nums whitespace-nowrap">
              {filteredArtworks.length} {t('collections', 'masterworksCount')}
            </p>
          </div>

          <div key={selectedCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 short:grid-cols-3 gap-x-8 short:gap-x-6 gap-y-16 short:gap-y-12">
            {filteredArtworks.map((artwork, i) => (
              <ArtworkCard key={artwork.id} artwork={artwork} delay={Math.min(i % 3, 2) * 0.12} />
            ))}

            {loaded && filteredArtworks.length === 0 && (
              <div className="col-span-full py-28 text-center">
                <p className="font-serif text-2xl text-white mb-3">{t('collections', 'emptyTitle')}</p>
                <p className="text-sm text-white/55 max-w-md mx-auto">{t('collections', 'emptyDesc')}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Collections;
