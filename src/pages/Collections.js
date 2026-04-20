import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ArtworkCard from '../components/ArtworkCard';
import { useLanguage } from '../context/LanguageContext';

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
    <div className="collections-container bg-[#030303] min-h-screen text-white font-sans overflow-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Header Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-20 z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-6 font-serif tracking-tight animate-fade-in">
          {t('collections', 'heroTitle')} <span className="text-primary">{t('collections', 'heroTitleHighlight')}</span> {t('collections', 'heroTitleSuffix')}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in delay-100">
          {t('collections', 'heroSubtitle')}
        </p>
      </section>

      {/* Collection "Album Covers" Carousel */}
      <section className="relative z-20 px-6 lg:px-20 mb-16">
        <div className="max-w-7xl mx-auto relative group">
          
          <div className="overflow-hidden py-4 px-2" ref={emblaRef}>
            <div className="flex gap-6">
              
              {/* The "All" Default Room */}
              <div 
                onClick={() => setSelectedCategory('All')}
                className={`flex-[0_0_auto] w-[260px] md:w-[320px] h-[180px] md:h-[220px] rounded-2xl relative cursor-pointer overflow-hidden transition-all duration-500 ${
                  selectedCategory === 'All' 
                    ? 'ring-2 ring-primary shadow-[0_0_30px_rgba(120,34,34,0.3)] scale-[1.02]' 
                    : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-[1.02] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black z-0"></div>
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-primary bg-primary/10 p-3 rounded-full mb-3 backdrop-blur-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6"></path></svg>
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white tracking-widest uppercase">{t('collections', 'vaultTitle')}</h3>
                  <p className="text-xs text-gray-400 mt-2 font-medium">{t('collections', 'vaultSubtitle')}</p>
                </div>
              </div>

              {/* Dynamic Collection Rooms */}
              {collectionsInfo.map((col) => (
                <div 
                  key={col.name}
                  onClick={() => setSelectedCategory(col.name)}
                  className={`flex-[0_0_auto] w-[260px] md:w-[320px] h-[180px] md:h-[220px] rounded-2xl relative cursor-pointer overflow-hidden transition-all duration-500 ${
                    selectedCategory === col.name 
                      ? 'ring-2 ring-primary shadow-[0_0_30px_rgba(120,34,34,0.4)] scale-[1.02]' 
                      : 'ring-1 ring-white/10 hover:ring-white/30 hover:scale-[1.02] opacity-70 hover:opacity-100'
                  }`}
                >
                  {/* Background Cover Image */}
                  <img 
                    src={col.cover} 
                    alt={col.name} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  {/* Dark Overlay gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 z-10"></div>
                  <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${selectedCategory === col.name ? 'bg-primary/20 mix-blend-overlay' : 'bg-transparent'}`}></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                    <span className="text-[10px] text-primary font-bold tracking-widest uppercase mb-1">{t('collections', 'roomLabel')}</span>
                    <h3 className="text-xl md:text-2xl font-serif text-white drop-shadow-lg">{col.name}</h3>
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
                className="absolute left-[-15px] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/80 z-30 shadow-xl"
                aria-label="Previous Collection"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={scrollNext}
                className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/80 z-30 shadow-xl"
                aria-label="Next Collection"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

        </div>
      </section>

      {/* Artworks Grid Viewer */}
      <section className="relative z-20 px-6 lg:px-20 pb-24 min-h-[50vh]">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-10">
            <h2 className="text-2xl font-serif text-white">
              {selectedCategory === 'All' ? t('collections', 'completeArchive') : `${selectedCategory} ${t('collections', 'collectionSuffix')}`}
            </h2>
            <span className="text-sm text-gray-500 font-medium">{filteredArtworks.length} {t('collections', 'masterworksCount')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork) => (
              <div className="animate-fade-in" key={artwork.id}>
                <ArtworkCard artwork={artwork} />
              </div>
            ))}
            
            {filteredArtworks.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-gray-500">
                <p>{t('collections', 'noMasterworks')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Collections;