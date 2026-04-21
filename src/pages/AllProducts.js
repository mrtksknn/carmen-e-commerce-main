import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import ArtworkCard from '../components/ArtworkCard';
import { collection, onSnapshot } from "firebase/firestore";
import { Search, SlidersHorizontal, ImageOff } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';

const AllProducts = () => {
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [products, setProducts] = useState([]);

  // Fetch from Firebase
  useEffect(() => {
    window.scrollTo(0, 0);
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setProducts(list);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsub();
  }, []);

  // Filter and Sort Processing
  const filteredArtworks = products
    .filter(artwork => {
      const term = searchTerm.toLowerCase();
      return (
        (artwork.name?.toLowerCase() || "").includes(term) ||
        (artwork.description?.toLowerCase() || "").includes(term) ||
        (artwork.collections?.toLowerCase() || "").includes(term)
      );
    })
    .sort((a, b) => {
      const getPrice = (str) => parseFloat(String(str || "0").replace(/[^\d.-]/g, ''));

      switch (sortBy) {
        case 'price-asc':
          return getPrice(a.price) - getPrice(b.price);
        case 'price-desc':
          return getPrice(b.price) - getPrice(a.price);
        case 'name-asc':
          return String(a.name || "").localeCompare(String(b.name || ""));
        case 'name-desc':
          return String(b.name || "").localeCompare(String(a.name || ""));
        case 'newest':
        default:
          return (b.timeStamp?.seconds || 0) - (a.timeStamp?.seconds || 0);
      }
    });

  return (
    <div className="relative min-h-screen bg-[#030303] text-white font-sans overflow-hidden">

      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-primary/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className='max-w-7xl mx-auto px-6 lg:px-20 relative z-10 pt-24 pb-20'>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs animate-fade-in opacity-80 mb-2 block">
            {t('allProducts', 'archiveLabel')}
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-serif tracking-tight animate-fade-in">
            {t('allProducts', 'heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in delay-100">
            {t('allProducts', 'heroSubtitle')}
          </p>
        </div>

        {/* Search and Sort Control Bar (Glassmorphism) */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 mb-12 shadow-2xl animate-fade-in delay-200">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">

            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder={t('allProducts', 'searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-transparent text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-500 font-light"
              />
            </div>

            {/* Divider for desktop */}
            <div className="hidden md:block w-px h-12 bg-white/10"></div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[200px] shrink-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <SlidersHorizontal size={18} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-12 pr-10 py-4 rounded-xl bg-black/40 border border-transparent text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all cursor-pointer font-light appearance-none"
              >
                <option value="newest" className="bg-[#121212]">{t('allProducts', 'sortNewest')}</option>
                <option value="price-asc" className="bg-[#121212]">{t('allProducts', 'sortPriceAsc')}</option>
                <option value="price-desc" className="bg-[#121212]">{t('allProducts', 'sortPriceDesc')}</option>
                <option value="name-asc" className="bg-[#121212]">{t('allProducts', 'sortNameAsc')}</option>
                <option value="name-desc" className="bg-[#121212]">{t('allProducts', 'sortNameDesc')}</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>

          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-8">
          <h2 className="text-2xl font-serif text-white">{t('allProducts', 'exhibitionWall')}</h2>
          <span className="text-sm text-gray-500 font-medium bg-white/5 py-1 px-3 rounded-full border border-white/5">
            {filteredArtworks.length} {t('allProducts', 'masterworksCount')}
          </span>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredArtworks.map((artwork) => (
            <div className="animate-fade-in" key={artwork.id}>
              <ArtworkCard artwork={artwork} />
            </div>
          ))}
        </div>

        {/* Empty State / Not Found */}
        {filteredArtworks.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm mt-8 animate-fade-in">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10 text-gray-600">
              <ImageOff size={32} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">{t('allProducts', 'noMasterworksTitle')}</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {t('allProducts', 'noMasterworksDesc')}
            </p>
            {searchTerm && (
              <button
                onClick={() => { setSearchTerm(''); setSortBy('newest'); }}
                className="mt-6 px-6 py-2 bg-primary/20 text-primary border border-primary/30 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                {t('allProducts', 'clearFilters')}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllProducts;