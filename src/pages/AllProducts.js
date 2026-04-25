import React, { useEffect, useState } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import { Search, SlidersHorizontal, ImageOff, X } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';

const AllProducts = () => {
  const { t } = useLanguage();
  const { products, loading } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
  };

  return (
    <main className="relative min-h-screen bg-[#030303] text-white font-sans overflow-hidden">
      <SEO 
        title="All Products"
        description="Browse the complete exhibition of unique hand-crafted works."
      />

      {/* Cinematic Ambient Glows */}
      <div className="absolute top-[-5%] right-[-10%] w-[55vw] h-[55vw] bg-[#782222]/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[45vw] h-[45vw] bg-[#782222]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Noise Texture Overlay for Premium Vibe */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E")' }}></div>

      <div className='max-w-[85rem] mx-auto px-6 lg:px-20 relative z-10 pt-32 pb-20'>

        {/* ── Header ── */}
        <header className="text-center mb-16 flex flex-col items-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#c0392b]"></div>
            <span className="text-[0.65rem] font-extrabold tracking-[0.4em] uppercase text-[#c0392b]">
              {t('allProducts', 'archiveLabel') || 'EXHIBITION WALL'}
            </span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#c0392b]"></div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black mb-6 font-serif tracking-tight leading-[0.95] animate-fade-in delay-75">
            {t('allProducts', 'heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in delay-150">
            {t('allProducts', 'heroSubtitle')}
          </p>
        </header>

        {/* ── Search and Sort Control Bar (Glassmorphism) ── */}
        <section className="bg-[#111]/60 border border-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-16 shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-fade-in delay-200 relative overflow-hidden">

          {/* Red glow accent inside bar */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#782222]/20 blur-3xl rounded-full pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center relative z-10">

            {/* Search Input */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#c0392b] transition-colors duration-300">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder={t('allProducts', 'searchPlaceholder') || 'Search masterworks...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search masterworks"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-black/40 border border-white/5 text-white focus:outline-none focus:bg-[#030303] focus:border-[#782222]/50 focus:ring-1 focus:ring-[#c0392b]/30 transition-all placeholder:text-gray-600 font-light text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[#c0392b] transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Divider for desktop */}
            <div className="hidden md:block w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[220px] shrink-0 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#c0392b] transition-colors duration-300">
                <SlidersHorizontal size={18} />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-black/40 border border-white/5 text-white focus:outline-none focus:bg-[#030303] focus:border-[#782222]/50 focus:ring-1 focus:ring-[#c0392b]/30 transition-all cursor-pointer font-light appearance-none text-sm group-hover:border-white/10"
              >
                <option value="newest" className="bg-[#121212] py-2">{t('allProducts', 'sortNewest')}</option>
                <option value="price-asc" className="bg-[#121212] py-2">{t('allProducts', 'sortPriceAsc')}</option>
                <option value="price-desc" className="bg-[#121212] py-2">{t('allProducts', 'sortPriceDesc')}</option>
                <option value="name-asc" className="bg-[#121212] py-2">{t('allProducts', 'sortNameAsc')}</option>
                <option value="name-desc" className="bg-[#121212] py-2">{t('allProducts', 'sortNameDesc')}</option>
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </div>
            </div>

          </div>

          {/* Active Filters Pill */}
          {(searchTerm || sortBy !== 'newest') && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5 animate-fade-in relative z-10">
              <span className="text-[0.65rem] text-gray-500 uppercase tracking-widest font-bold">Active Filters:</span>

              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full hover:bg-[#782222]/20 hover:border-[#782222]/50 hover:text-white transition-all">
                  "{searchTerm}" <X size={10} strokeWidth={3} />
                </button>
              )}
              {sortBy !== 'newest' && (
                <button onClick={() => setSortBy('newest')} className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full hover:bg-[#782222]/20 hover:border-[#782222]/50 hover:text-white transition-all">
                  {sortBy.replace('-', ' ').toUpperCase()} <X size={10} strokeWidth={3} />
                </button>
              )}

              <button onClick={clearFilters} className="text-xs text-[#c0392b] hover:text-red-400 ml-auto font-medium transition-colors">
                Clear All
              </button>
            </div>
          )}
        </section>

        {/* ── Results Container ── */}
        <section>
          {/* ── Results Metadata ── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-5 mb-10 gap-4">
            <h2 className="text-2xl md:text-3xl font-serif text-white">{t('allProducts', 'exhibitionWall') || 'Exhibition'}</h2>

          <div className="flex items-center bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] mr-2 animate-pulse"></span>
            <span className="text-xs text-gray-300 font-bold tracking-wide">
              <span className="text-white text-sm mr-1">{filteredArtworks.length}</span>
              {t('allProducts', 'masterworksCount') || 'Pieces'}
            </span>
          </div>
        </div>

        {/* ── Artworks Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 min-h-[40vh]">
          {filteredArtworks.map((artwork, i) => (
            <div className="animate-fade-in" style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }} key={artwork.id}>
              <ArtworkCard artwork={artwork} />
            </div>
          ))}

          {/* ── Empty State / Not Found ── */}
          {!loading && filteredArtworks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 px-4 text-center border border-white/5 bg-white/[0.02] rounded-[2rem] mt-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10 text-gray-600">
                <ImageOff size={28} />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">{t('allProducts', 'noMasterworksTitle')}</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                {t('allProducts', 'noMasterworksDesc')}
              </p>
              {(searchTerm || sortBy !== 'newest') && (
                <button
                  onClick={clearFilters}
                  className="mt-6 px-6 py-2 bg-[#782222]/20 text-[#c0392b] font-medium border border-[#782222]/30 rounded-full hover:bg-[#c0392b] hover:text-white transition-all duration-300 text-sm shadow-[0_0_15px_rgba(120,34,34,0.3)]"
                >
                  {t('allProducts', 'clearFilters') || 'Clear Filters'}
                </button>
              )}
            </div>
          )}
        </div>
        </section>

      </div>
    </main>
  );
};

export default AllProducts;