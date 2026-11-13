import React, { useEffect, useState, useMemo } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import FilterSidebar from '../components/landing/FilterSidebar';
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';
import { MaskLine, FadeUp } from '../components/motion/Reveal';

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
        switch (sortBy) {
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

  const filterCount = activeFilters.collections.length + activeFilters.techniques.length + activeFilters.status.length;
  const hasActiveFilters = searchTerm || sortBy !== 'newest' || filterCount > 0;

  const statusLabel = (s) => (s === 'sold' ? t('common', 'sold') : s);

  return (
    <main className="relative min-h-screen bg-background text-white font-sans">
      <SEO
        title={t('seo', 'productsTitle')}
        description={t('seo', 'productsDesc')}
      />

      <div className="max-w-7xl mx-auto px-6 relative pt-36 lg:pt-44 pb-36">

        {/* ── Header ── */}
        <header className="mb-16">
          <h1 className="font-serif font-light tracking-[-0.02em] leading-[1.02] text-[3rem] sm:text-[4rem] lg:text-[5.5rem] text-white">
            <MaskLine delay={0.15}>{t('allProducts', 'heroTitle')}</MaskLine>
          </h1>
          <FadeUp delay={0.45}>
            <p className="mt-6 text-base md:text-lg text-white/60 max-w-2xl font-light leading-relaxed">
              {t('allProducts', 'heroSubtitle')}
            </p>
          </FadeUp>
        </header>

        {/* ── Controls ── */}
        <FadeUp delay={0.6}>
          <section className="flex flex-col lg:flex-row gap-6 lg:gap-10 lg:items-end pb-6 border-b border-white/10">
            {/* Search */}
            <label className="relative flex-1 group block">
              <span className="sr-only">{t('allProducts', 'searchLabel')}</span>
              <Search size={18} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-light transition-colors duration-300" />
              <input
                type="text"
                placeholder={t('allProducts', 'searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-10 py-3 bg-transparent border-0 border-b border-white/20 text-white text-base font-light placeholder:text-white/40 focus:outline-none focus:border-primary-light transition-colors duration-300"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label={t('allProducts', 'clearAll')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <div className="flex items-center gap-6">
              {/* Filters */}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className={`inline-flex items-center gap-2.5 py-3 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ${filterCount > 0 ? 'text-primary-light' : 'text-white/70 hover:text-white'}`}
              >
                <SlidersHorizontal size={16} strokeWidth={1.5} />
                {t('allProducts', 'filtersLabel')}
                {filterCount > 0 && <span className="tabular-nums">({filterCount})</span>}
              </button>

              {/* Sort */}
              <label className="relative inline-flex items-center">
                <span className="sr-only">{t('allProducts', 'sortLabel')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border-0 border-b border-white/20 py-3 pr-7 text-sm text-white/80 cursor-pointer focus:outline-none focus:border-primary-light transition-colors"
                >
                  <option value="newest" className="bg-[#121212]">{t('allProducts', 'sortNewest')}</option>
                  <option value="name-asc" className="bg-[#121212]">{t('allProducts', 'sortNameAsc')}</option>
                  <option value="name-desc" className="bg-[#121212]">{t('allProducts', 'sortNameDesc')}</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 pointer-events-none text-white/50" />
              </label>
            </div>
          </section>

          {/* Active selections + count */}
          <div className="flex flex-wrap items-center gap-3 pt-5 mb-14 min-h-[2.5rem]">
            {hasActiveFilters && (
              <>
                <span className="text-[11px] tracking-[0.18em] uppercase text-white/45 mr-1">{t('allProducts', 'activeLabel')}</span>
                {searchTerm && <Pill label={`“${searchTerm}”`} onClear={() => setSearchTerm('')} />}
                {activeFilters.collections.map(c => (
                  <Pill key={c} label={c} onClear={() => setActiveFilters(prev => ({ ...prev, collections: prev.collections.filter(v => v !== c) }))} />
                ))}
                {activeFilters.techniques.map(tech => (
                  <Pill key={tech} label={tech} onClear={() => setActiveFilters(prev => ({ ...prev, techniques: prev.techniques.filter(v => v !== tech) }))} />
                ))}
                {activeFilters.status.map(s => (
                  <Pill key={s} label={statusLabel(s)} onClear={() => setActiveFilters(prev => ({ ...prev, status: prev.status.filter(v => v !== s) }))} />
                ))}
                <button type="button" onClick={clearFilters} className="text-[11px] uppercase tracking-[0.18em] text-primary-light hover:text-white transition-colors ml-1">
                  {t('allProducts', 'clearAll')}
                </button>
              </>
            )}
            <span className="ml-auto text-sm text-white/55 tabular-nums">
              {filteredArtworks.length} {t('allProducts', 'masterworksCount')}
            </span>
          </div>
        </FadeUp>

        {/* ── The wall ── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredArtworks.map((artwork, i) => (
              <ArtworkCard key={artwork.id} artwork={artwork} delay={Math.min(i % 3, 2) * 0.12} />
            ))}

            {!loading && filteredArtworks.length === 0 && (
              <div className="col-span-full py-28 text-center">
                <h3 className="font-serif text-2xl text-white mb-3">{t('allProducts', 'noMasterworksTitle')}</h3>
                <p className="text-white/55 max-w-md mx-auto font-light leading-relaxed mb-10">
                  {t('allProducts', 'noMasterworksDesc')}
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-8 py-3.5 rounded-full border border-white/30 text-xs font-semibold tracking-[0.18em] uppercase text-white hover:bg-white hover:text-black transition-colors duration-500"
                >
                  {t('allProducts', 'clearFilters')}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        filters={activeFilters}
        setFilters={setActiveFilters}
        options={filterOptions}
        resultCount={filteredArtworks.length}
        t={t}
      />
    </main>
  );
};

const Pill = ({ label, onClear }) => (
  <button
    type="button"
    onClick={onClear}
    className="group inline-flex items-center gap-2 text-xs text-white/80 pl-3 pr-2 py-1.5 rounded-full border border-white/15 hover:border-white/40 hover:text-white transition-colors"
  >
    <span>{label}</span>
    <X size={12} className="text-white/50 group-hover:text-white transition-colors" />
  </button>
);

export default AllProducts;
