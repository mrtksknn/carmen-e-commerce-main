import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useInquiry } from '../../context/InquiryContext';
import { useLanguage } from '../../context/LanguageContext';
import { X, ArrowRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import ConciergeModal from './ConciergeModal';
import { EASE_OUT } from '../motion/Reveal';
import { artImage } from '../../lib/artImage';

const InquiryFloatingBar = () => {
  const reduce = useReducedMotion();
  const { inquiryList, removeFromInquiry, clearInquiry } = useInquiry();
  const { t } = useLanguage();
  const [isListOpen, setIsListOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);

  if (inquiryList.length === 0 && !isConciergeOpen) return null;

  const handleStartConcierge = () => {
    setIsListOpen(false);
    // Small delay to let the list modal close before opening the concierge
    setTimeout(() => {
      setIsConciergeOpen(true);
    }, 300);
  };

  return (
    <>
      {/* Floating list button: thumbnails of the chosen works */}
      <AnimatePresence>
        {inquiryList.length > 0 && !isListOpen && !isConciergeOpen && (
          <motion.div
            initial={{ y: reduce ? 0 : 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduce ? 0 : 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80]"
          >
            <button
              type="button"
              onClick={() => setIsListOpen(true)}
              className="group flex items-center gap-4 pl-2 pr-6 py-2 rounded-full bg-[#111]/95 border border-white/15 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] hover:border-white/35 transition-colors duration-500"
            >
              <span className="flex -space-x-2">
                {inquiryList.slice(0, 3).map((item, i) => (
                  <span key={item.id} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#111]" style={{ zIndex: 3 - i }}>
                    <img {...artImage(item.img, { sizes: '96px', maxWidth: 480 })} alt="" className="w-full h-full object-cover" />
                  </span>
                ))}
              </span>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-white">
                {t('productDetails', 'multiInquiryLabel')}
              </span>
              <span className="text-sm tabular-nums text-primary-light">{inquiryList.length}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Inquiry list */}
      <Dialog.Root open={isListOpen} onOpenChange={setIsListOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 z-[100]" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-xl z-[101] outline-none">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
              className="bg-[#0b0b0b] border border-white/10 rounded-[4px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]"
            >
              <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-white/10 flex items-start justify-between gap-6">
                <div>
                  <Dialog.Title className="font-serif font-light text-2xl sm:text-3xl text-white">{t('productDetails', 'inquiryCollectionTitle')}</Dialog.Title>
                  <Dialog.Description className="text-sm text-white/55 mt-1 tabular-nums">
                    {inquiryList.length} {t('allProducts', 'masterworksCount')}
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  aria-label={t('productDetails', 'close')}
                  className="w-10 h-10 flex-shrink-0 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors"
                >
                  <X size={16} />
                </Dialog.Close>
              </div>

              <ul className="max-h-[50vh] overflow-y-auto px-6 sm:px-8 divide-y divide-white/10">
                <AnimatePresence initial={false}>
                  {inquiryList.map((item) => (
                    <motion.li
                      key={item.id}
                      layout={!reduce}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: reduce ? 0 : 24 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-4 py-4"
                    >
                      <span className="w-14 h-16 flex-shrink-0 rounded-[2px] overflow-hidden ring-1 ring-white/10">
                        <img {...artImage(item.img, { sizes: '96px', maxWidth: 480 })} alt="" className="w-full h-full object-cover" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-serif text-lg text-white leading-tight truncate">{item.name}</span>
                        {item.collections && (
                          <span className="block mt-1 text-[11px] tracking-[0.18em] uppercase text-white/45">{item.collections}</span>
                        )}
                      </span>
                      {item.price && <span className="text-sm text-white/70 tabular-nums">{item.price} ₺</span>}
                      <button
                        type="button"
                        onClick={() => removeFromInquiry(item.id)}
                        aria-label={`${t('productDetails', 'removeFromList')}: ${item.name}`}
                        className="w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <X size={15} />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="px-6 sm:px-8 py-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center gap-4">
                <button
                  type="button"
                  onClick={clearInquiry}
                  className="text-[11px] tracking-[0.18em] uppercase text-white/50 hover:text-white transition-colors"
                >
                  {t('productDetails', 'clearList')}
                </button>
                <button
                  type="button"
                  onClick={handleStartConcierge}
                  className="group relative sm:ml-auto w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-white text-black overflow-hidden"
                >
                  <span aria-hidden="true" className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <span className="relative z-10 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-500 group-hover:text-white">
                    {t('productDetails', 'sendMultiInquiry')}
                  </span>
                  <ArrowRight size={16} className="relative z-10 transition-all duration-500 group-hover:text-white group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 2. Concierge form for the whole list */}
      <ConciergeModal
        artwork={{ name: 'Multiple Artworks', items: inquiryList }}
        t={t}
        isMulti={true}
        open={isConciergeOpen}
        onOpenChange={setIsConciergeOpen}
        onSuccess={clearInquiry}
      />
    </>
  );
};

export default InquiryFloatingBar;
