import React from 'react';
import { X, Filter, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  setFilters, 
  options, 
  t 
}) => {
  const sidebarVariants = {
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const clearCategory = (category) => {
    setFilters(prev => ({ ...prev, [category]: [] }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-surface/95 backdrop-blur-2xl border-l border-white/5 z-[70] shadow-2xl overflow-y-auto"
          >
            <div className="p-8 pb-32">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Filter size={20} />
                  </div>
                  <h2 className="text-2xl font-serif text-white tracking-wide">
                    {t('allProducts', 'filterTitle') || 'Curate View'}
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Collections Filter */}
              <FilterSection 
                title={t('allProducts', 'filterCollections') || 'Collections'}
                items={options.collections}
                selectedItems={filters.collections}
                onToggle={(val) => toggleFilter('collections', val)}
                onClear={() => clearCategory('collections')}
              />

              {/* Technique/Material Filter */}
              <FilterSection 
                title={t('allProducts', 'filterTechniques') || 'Techniques'}
                items={options.techniques}
                selectedItems={filters.techniques}
                onToggle={(val) => toggleFilter('techniques', val)}
                onClear={() => clearCategory('techniques')}
              />

              {/* Status Filter */}
              <FilterSection 
                title={t('allProducts', 'filterStatus') || 'Availability'}
                items={[
                  { label: t('allProducts', 'statusAvailable') || 'Available', value: 'available' },
                  { label: t('allProducts', 'statusSold') || 'Sold', value: 'sold' }
                ]}
                selectedItems={filters.status}
                onToggle={(val) => toggleFilter('status', val)}
                onClear={() => clearCategory('status')}
                isSimple
              />

            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-surface/90 backdrop-blur-md border-t border-white/5 flex gap-4">
              <button 
                onClick={() => setFilters({ collections: [], techniques: [], status: [] })}
                className="flex-1 py-4 px-6 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-xs font-bold tracking-widest uppercase"
              >
                Reset
              </button>
              <button 
                onClick={onClose}
                className="flex-[2] py-4 px-6 rounded-2xl bg-primary text-white shadow-[0_10px_20px_rgba(168,50,41,0.3)] hover:scale-[1.02] transition-all text-xs font-bold tracking-widest uppercase"
              >
                Show Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const FilterSection = ({ title, items, selectedItems, onToggle, onClear, isSimple }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-10 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-extrabold tracking-[0.2em] uppercase text-gray-500">
          {title}
        </h3>
        {selectedItems.length > 0 && (
          <button 
            onClick={onClear}
            className="text-[9px] font-bold text-primary hover:underline uppercase tracking-widest"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const value = isSimple ? item.value : item;
          const label = isSimple ? item.label : item;
          const isSelected = selectedItems.includes(value);

          return (
            <button
              key={value}
              onClick={() => onToggle(value)}
              className={`px-4 py-2 rounded-xl text-xs transition-all border ${
                isSelected 
                  ? 'bg-primary/20 border-primary/50 text-white shadow-[0_0_15px_rgba(168,50,41,0.2)]' 
                  : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterSidebar;
