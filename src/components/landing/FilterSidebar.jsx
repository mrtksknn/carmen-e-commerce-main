import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../motion/Reveal';

const FilterSidebar = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  options,
  resultCount = 0,
  t
}) => {
  const reduce = useReducedMotion();

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      }
      return { ...prev, [category]: [...current, value] };
    });
  };

  const clearCategory = (category) => {
    setFilters(prev => ({ ...prev, [category]: [] }));
  };

  const sections = [
    { key: 'collections', title: t('allProducts', 'filterCollections'), items: options.collections.map(v => ({ value: v, label: v })) },
    { key: 'techniques', title: t('allProducts', 'filterTechniques'), items: options.techniques.map(v => ({ value: v, label: v })) },
    {
      key: 'status', title: t('allProducts', 'filterStatus'), items: [
        { value: 'available', label: t('allProducts', 'statusAvailable') },
        { value: 'sold', label: t('allProducts', 'statusSold') },
      ]
    },
  ].filter(s => s.items.length > 0);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 bg-black/70 z-[60]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.aside
                className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#0b0b0b] border-l border-white/10 z-[70] flex flex-col outline-none"
                initial={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }}
                transition={{ duration: 0.55, ease: EASE_OUT }}
              >
                <div className="flex items-center justify-between px-7 pt-8 pb-6 border-b border-white/10">
                  <Dialog.Title className="font-serif font-light text-3xl text-white">
                    {t('allProducts', 'filterTitle')}
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">{t('allProducts', 'filterTitle')}</Dialog.Description>
                  <Dialog.Close
                    aria-label={t('productDetails', 'close')}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors"
                  >
                    <X size={16} />
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto px-7 py-4">
                  {sections.map((section, si) => {
                    const selected = filters[section.key] || [];
                    return (
                      <motion.fieldset
                        key={section.key}
                        className="py-6 border-b border-white/10 last:border-b-0"
                        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 + si * 0.07, ease: EASE_OUT }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <legend className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/55">
                            {section.title}
                          </legend>
                          {selected.length > 0 && (
                            <button
                              type="button"
                              onClick={() => clearCategory(section.key)}
                              className="text-[11px] tracking-[0.18em] uppercase text-primary-light hover:text-white transition-colors"
                            >
                              {t('allProducts', 'clearSection')}
                            </button>
                          )}
                        </div>
                        <ul>
                          {section.items.map((item) => {
                            const isSelected = selected.includes(item.value);
                            return (
                              <li key={item.value}>
                                <button
                                  type="button"
                                  role="checkbox"
                                  aria-checked={isSelected}
                                  onClick={() => toggleFilter(section.key, item.value)}
                                  className="group w-full flex items-center justify-between gap-4 py-3 text-left"
                                >
                                  <span className={`font-serif text-xl transition-colors duration-300 ${isSelected ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>
                                    {item.label}
                                  </span>
                                  <span className={`w-5 h-5 rounded-[3px] border flex items-center justify-center transition-colors duration-300 ${isSelected ? 'bg-primary border-primary text-white' : 'border-white/30 group-hover:border-white/60'}`}>
                                    {isSelected && <Check size={13} strokeWidth={2.5} />}
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.fieldset>
                    );
                  })}
                </div>

                <div className="px-7 py-6 border-t border-white/10 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFilters({ collections: [], techniques: [], status: [] })}
                    className="text-[11px] tracking-[0.18em] uppercase text-white/55 hover:text-white transition-colors px-2 py-3"
                  >
                    {t('allProducts', 'resetFilters')}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="group relative ml-auto flex-1 inline-flex items-center justify-center py-4 rounded-full bg-white text-black overflow-hidden"
                  >
                    <span aria-hidden="true" className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <span className="relative z-10 text-xs font-semibold tracking-[0.18em] uppercase tabular-nums transition-colors duration-500 group-hover:text-white">
                      {(t('allProducts', 'showResults') || '').replace('{n}', resultCount)}
                    </span>
                  </button>
                </div>
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export default FilterSidebar;
