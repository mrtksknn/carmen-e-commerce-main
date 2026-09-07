import React, { useEffect, useState, useMemo } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import FilterSidebar from '../components/landing/FilterSidebar';
import { Search, SlidersHorizontal, ImageOff, X, Filter as FilterIcon } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';

const AllProducts = () => {
  const { t } = useLanguage();
  const { products, loading } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Advanced Filter State
  const [activeFilters, setActiveFilters] = useState({
    collections: [],
    techniques: [],
    status: []
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Extract unique options for filters
  const filterOptions = useMemo(() => {
    const collections = new Set();
    const techniques = new Set();

    products.forEach(p => {
      if (p.collections) collections.add(p.collections);
      if (p.material) techniques.add(p.material);
    });

    return {
      collections: Array.from(collections).sort(),
      techniques: Array.from(techniques).sort()
    };
  }, [products]);

  // Filter and Sort Processing
  const filteredArtworks = useMemo(() => {
    return products
      .filter(artwork => {
        // Search Term Filter
        const term = searchTerm.toLowerCase();
        const matchesSearch = (
          (artwork.name?.toLowerCase() || "").includes(term) ||
          (artwork.description?.toLowerCase() || "").includes(term) ||
          (artwork.collections?.toLowerCase() || "").includes(term)
        );

        if (!matchesSearch) return false;

        // Collections Filter
        if (activeFilters.collections.length > 0 && !activeFilters.collections.includes(artwork.collections)) {
          return false;
        }

        // Techniques Filter
        if (activeFilters.techniques.length > 0 && !activeFilters.techniques.includes(artwork.material)) {
          return false;
        }

        // Status Filter
        if (activeFilters.status.length > 0) {
          const isSold = artwork.status === true;
          const statusValue = isSold ? 'sold' : 'available';
          if (!activeFilters.status.includes(statusValue)) return false;
        }

        return true;
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
  }, [products, searchTerm, sortBy, activeFilters]);

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
    setActiveFilters({ collections: [], techniques: [], status: [] });
  };

  const hasActiveFilters = searchTerm || sortBy !== 'newest' ||
    activeFilters.collections.length > 0 ||
    activeFilters.techniques.length > 0 ||
    activeFilters.status.length > 0;

  return (
    <main className="relative min-h-screen bg-background text-white font-sans overflow-hidden">
      <SEO
        title={t('seo', 'productsTitle')}
        description={t('seo', 'productsDesc')}
      />

      {/* Cinematic Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[55vw] h-[55vw] bg-primary/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-15%] w-[45vw] h-[45vw] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E")' }}></div>

      <div className='max-w-[85rem] mx-auto px-6 lg:px-20 relative z-10 pt-32 pb-20'>

        {/* ── Header ── */}
        <header className="text-center mb-16 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6 animate-fade-in">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-[0.65rem] font-extrabold tracking-[0.4em] uppercase text-primary">
              {t('allProducts', 'archiveLabel') || 'EXHIBITION WALL'}
            </span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-primary"></div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black mb-6 font-serif tracking-tight leading-[0.95] animate-fade-in delay-75">
            {t('allProducts', 'heroTitle')}
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in delay-150">
            {t('allProducts', 'heroSubtitle')}
          </p>
        </header>

        {/* ── Control Bar ── */}
        <section className="bg-surface/40 border border-white/5 backdrop-blur-xl rounded-2xl p-4 md:p-6 mb-16 shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-fade-in delay-200 relative overflow-hidden group">

          {/* Subtle glow accent */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>

          <div className="flex flex-col lg:flex-row gap-4 lg:items-center relative z-10">

            {/* Search */}
            <div className="relative flex-1 group/search">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/search:text-primary transition-colors duration-300">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder={t('allProducts', 'searchPlaceholder') || 'Search masterworks...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-black/40 border border-white/5 text-white focus:outline-none focus:bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-600 font-light text-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-primary transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Filter Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-xl border transition-all text-sm font-medium ${activeFilters.collections.length > 0 || activeFilters.techniques.length > 0 || activeFilters.status.length > 0
                  ? 'bg-primary/10 border-primary/40 text-primary'
                  : 'bg-black/40 border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                  }`}
              >
                <FilterIcon size={18} />

              </button>

              {/* Sort Dropdown */}
              <div className="relative min-w-[200px] flex-1 lg:flex-none group/sort">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/sort:text-primary transition-colors duration-300">
                  <SlidersHorizontal size={18} />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 rounded-xl bg-black/40 border border-white/5 text-white focus:outline-none focus:bg-background focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer font-light appearance-none text-sm group-hover/sort:border-white/10"
                >
                  <option value="newest" className="bg-[#121212]">{t('allProducts', 'sortNewest')}</option>
                  <option value="price-asc" className="bg-[#121212]">{t('allProducts', 'sortPriceAsc')}</option>
                  <option value="price-desc" className="bg-[#121212]">{t('allProducts', 'sortPriceDesc')}</option>
                  <option value="name-asc" className="bg-[#121212]">{t('allProducts', 'sortNameAsc')}</option>
                  <option value="name-desc" className="bg-[#121212]">{t('allProducts', 'sortNameDesc')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Active Pills Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/5 animate-fade-in relative z-10">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mr-2">Active:</span>

              {searchTerm && (
                <Pill label={`"${searchTerm}"`} onClear={() => setSearchTerm('')} />
              )}
              {activeFilters.collections.map(c => (
                <Pill key={c} label={c} onClear={() => setActiveFilters(prev => ({ ...prev, collections: prev.collections.filter(v => v !== c) }))} />
              ))}
              {activeFilters.techniques.map(t => (
                <Pill key={t} label={t} onClear={() => setActiveFilters(prev => ({ ...prev, techniques: prev.techniques.filter(v => v !== t) }))} />
              ))}
              {activeFilters.status.map(s => (
                <Pill key={s} label={s.toUpperCase()} onClear={() => setActiveFilters(prev => ({ ...prev, status: prev.status.filter(v => v !== s) }))} />
              ))}

              <button onClick={clearFilters} className="text-[10px] uppercase font-bold tracking-widest text-primary hover:text-white ml-auto transition-colors">
                Clear All
              </button>
            </div>
          )}
        </section>

        {/* ── Results ── */}
        <section>
          <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-12">
            <h2 className="text-3xl font-serif text-white">{t('allProducts', 'exhibitionWall') || 'Exhibition'}</h2>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="text-sm font-bold text-white">{filteredArtworks.length}</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">{t('allProducts', 'masterworksCount') || 'Pieces'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((artwork, i) => (
              <div className="animate-fade-in" style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }} key={artwork.id}>
                <ArtworkCard artwork={artwork} />
              </div>
            ))}

            {/* Empty State */}
            {!loading && filteredArtworks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-32 px-4 text-center border border-white/5 bg-white/[0.01] rounded-[2.5rem]">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 text-gray-700 shadow-inner">
                  <ImageOff size={32} />
                </div>
                <h3 className="text-2xl font-serif text-white mb-4">{t('allProducts', 'noMasterworksTitle')}</h3>
                <p className="text-gray-500 max-w-md mx-auto font-light leading-relaxed mb-10">
                  {t('allProducts', 'noMasterworksDesc')}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-10 py-4 bg-primary text-white font-bold text-xs tracking-widest uppercase rounded-full hover:scale-105 transition-all shadow-xl"
                >
                  {t('allProducts', 'clearFilters') || 'Reset Exhibition'}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Advanced Filter Sidebar */}
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={activeFilters}
        setFilters={setActiveFilters}
        options={filterOptions}
        t={t}
      />
    </main>
  );
};

const Pill = ({ label, onClear }) => (
  <button
    onClick={onClear}
    className="group inline-flex items-center gap-2 text-[11px] bg-white/5 border border-white/10 text-gray-300 px-4 py-1.5 rounded-full hover:bg-primary/20 hover:border-primary/50 hover:text-white transition-all"
  >
    <span>{label}</span>
    <X size={12} className="text-gray-500 group-hover:text-white transition-colors" />
  </button>
);

export default AllProducts;
