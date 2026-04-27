import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ArtworkCard from '../components/ArtworkCard';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const Collections = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [collectionsInfo, setCollectionsInfo] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Embla Carousel Hook
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

        setProducts(list);

        // Map abstract collections
        const info = Array.from(colMap.entries()).map(([name, cover]) => ({
          name,
          cover
        }));
        setCollectionsInfo(info);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsub();
  }, []);

  return (
    <main className="collections-container bg-[#030303] min-h-screen text-white font-sans overflow-hidden relative">
      <SEO
        title="Collections"
        description="Explore curated archives and collections of Carmen's masterworks."
      />

      {/* Cinematic Ambient Glows */}
      <div className="absolute top-[-5%] right-[-10%] w-[55vw] h-[55vw] bg-[#a83229]/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[45vw] h-[45vw] bg-[#a83229]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Noise Texture Overlay for Premium Vibe */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E")' }}></div>

      {/* ── Header Section ── */}
      <header className="relative pt-32 pb-16 px-6 lg:px-20 z-10 text-center flex flex-col items-center">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#a83229]"></div>
          <span className="text-[0.65rem] font-extrabold tracking-[0.4em] uppercase text-[#a83229]">
            {t('collections', 'curatedArchive') || 'Curated Archive'}
          </span>
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#a83229]"></div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black mb-6 font-serif tracking-tight leading-[0.95] animate-fade-in delay-75">
          {t('collections', 'heroTitle')} <br className="md:hidden" />
          <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-[#333]">
            {t('collections', 'heroTitleHighlight')}
          </span>{' '}
          {t('collections', 'heroTitleSuffix')}
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in delay-150">
          {t('collections', 'heroSubtitle')}
        </p>
      </header>

      {/* ── Collection "Rooms" Carousel ── */}
      <section className="relative z-20 px-6 lg:px-20 mb-20">
        <div className="max-w-7xl mx-auto relative group">

          <div className="overflow-hidden py-6 px-4 -mx-4" ref={emblaRef}>
            <div className="flex gap-6">

              {/* Default Room: All Vault */}
              <div
                onClick={() => setSelectedCategory('All')}
                className={`flex-[0_0_auto] w-[280px] md:w-[340px] h-[190px] md:h-[240px] rounded-[2rem] relative cursor-pointer overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${selectedCategory === 'All'
                  ? 'ring-1 ring-[#a83229] shadow-[0_15px_40px_rgba(168,50,41,0.4)] scale-[1.03] z-10'
                  : 'ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.01] opacity-60 hover:opacity-100 z-0'
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#121212] to-[#040404] z-0"></div>
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center border border-white/5 rounded-[2rem]">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 transition-all duration-500 ${selectedCategory === 'All' ? 'bg-[#a83229]/20 text-[#a83229] shadow-[0_0_20px_rgba(168,50,41,0.3)]' : 'bg-white/5 text-gray-400'}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"></path></svg>
                  </div>
                  <h3 className={`text-xl font-serif font-bold tracking-widest uppercase transition-colors duration-500 ${selectedCategory === 'All' ? 'text-white drop-shadow-md' : 'text-gray-300'}`}>
                    {t('collections', 'vaultTitle') || 'The Vault'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 font-medium tracking-wide">
                    {t('collections', 'vaultSubtitle') || 'All Masterworks'}
                  </p>
                </div>
              </div>

              {/* Dynamic Collection Rooms */}
              {collectionsInfo.map((col) => (
                <div
                  key={col.name}
                  onClick={() => setSelectedCategory(col.name)}
                  className={`flex-[0_0_auto] w-[280px] md:w-[340px] h-[190px] md:h-[240px] rounded-[2rem] relative cursor-pointer overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${selectedCategory === col.name
                    ? 'ring-1 ring-[#a83229] shadow-[0_15px_40px_rgba(168,50,41,0.4)] scale-[1.03] z-10'
                    : 'ring-1 ring-white/10 hover:ring-white/20 hover:scale-[1.01] opacity-60 hover:opacity-100 z-0'
                    }`}
                >
                  {/* Background Cover Image */}
                  <img
                    src={col.cover}
                    alt={col.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] hover:scale-110"
                  />
                  {/* Dark Overlay gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent opacity-95 z-10 transition-opacity duration-500 hover:opacity-80"></div>

                  {/* Active Red Tint */}
                  <div className={`absolute inset-0 z-10 transition-all duration-500 pointer-events-none ${selectedCategory === col.name ? 'bg-gradient-to-br from-[#a83229]/30 to-transparent mix-blend-overlay' : 'bg-transparent'}`}></div>

                  {/* Content Glass Panel */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-5 transform transition-transform duration-500">
                    <div className="flex flex-col justify-end">
                      <h3 className={`text-2xl md:text-3xl font-serif drop-shadow-xl transition-colors duration-500 ${selectedCategory === col.name ? 'text-white' : 'text-gray-300'}`}>
                        {col.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* Navigation Arrows */}
          {collectionsInfo.length > 2 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-[-20px] md:left-[-30px] top-1/2 -translate-y-1/2 w-12 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white backdrop-blur-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-[#a83229]/50 hover:bg-[#a83229]/80"
                aria-label="Previous Collection"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-[-20px] md:right-[-30px] top-1/2 -translate-y-1/2 w-12 md:w-14 h-12 md:h-14 flex items-center justify-center rounded-full bg-black/50 border border-white/10 text-white backdrop-blur-lg opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out z-30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-[#a83229]/50 hover:bg-[#a83229]/80"
                aria-label="Next Collection"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

        </div>
      </section>

      {/* ── Artworks Grid Viewer ── */}
      <section className="relative z-20 px-6 lg:px-20 pb-32 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">

          {/* Grid Header Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-white/10 pb-5 mb-10 gap-4">
            <div>
              <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-2 block">
                {selectedCategory === 'All' ? 'Complete Archive View' : 'Focus View'}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                {selectedCategory === 'All' ? t('collections', 'completeArchive') : selectedCategory}
              </h2>
            </div>

            <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] mr-2 animate-pulse"></span>
              <span className="text-xs text-gray-300 font-bold tracking-wide">
                <span className="text-white text-sm mr-1">{filteredArtworks.length}</span>
                {t('collections', 'masterworksCount') || 'Pieces'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {filteredArtworks.map((artwork) => (
              <div className="animate-fade-in" key={artwork.id}>
                <ArtworkCard artwork={artwork} />
              </div>
            ))}

            {filteredArtworks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-32 text-center border border-white/5 bg-white/[0.02] rounded-[2rem]">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,50,41,0.15)]">
                  <span className="text-[#a83229] text-2xl font-serif">!</span>
                </div>
                <p className="text-xl font-serif text-white mb-2">{t('collections', 'emptyTitle') || 'The Vault is empty'}</p>
                <p className="text-sm text-gray-500 max-w-md">{t('collections', 'emptyDesc') || 'No masterworks found in this collection at the moment.'}</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
};

export default Collections;