import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInquiry } from '../../context/InquiryContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShoppingBag, X, Send, Trash2, ArrowRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import ConciergeModal from './ConciergeModal';

const InquiryFloatingBar = () => {
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
      {/* Floating Badge Button */}
      <AnimatePresence>
        {inquiryList.length > 0 && !isListOpen && !isConciergeOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[80]"
          >
            <button
              onClick={() => setIsListOpen(true)}
              className="bg-primary text-white px-6 py-4 rounded-full shadow-[0_15px_30px_rgba(168,50,41,0.4)] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all group border border-white/20"
            >
              <div className="relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-2 -right-2 bg-white text-primary text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg">
                  {inquiryList.length}
                </span>
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase pr-2">
                {t('productDetails', 'multiInquiryLabel')}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Inquiry List Modal */}
      <Dialog.Root open={isListOpen} onOpenChange={setIsListOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-xl z-[101] outline-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
                <div>
                  <Dialog.Title className="text-xl font-serif text-white">{t('productDetails', 'inquiryCollectionTitle')}</Dialog.Title>
                  <Dialog.Description className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{inquiryList.length} {t('allProducts', 'masterworksCount')}</Dialog.Description>
                </div>
                <Dialog.Close className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all">
                  <X size={18} />
                </Dialog.Close>
              </div>

              {/* Items List */}
              <div className="max-h-[50vh] overflow-y-auto p-6 space-y-4 scrollbar-hide">
                <AnimatePresence>
                  {inquiryList.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">{item.collections}</p>
                      </div>
                      <button
                        onClick={() => removeFromInquiry(item.id)}
                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer / Action */}
              <div className="p-8 bg-white/[0.02] border-t border-white/5 flex flex-col gap-4">
                <button
                  onClick={handleStartConcierge}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-primary-hover transition-all shadow-xl group"
                >
                  {t('productDetails', 'sendMultiInquiry')}
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                
                <button
                  onClick={clearInquiry}
                  className="text-[10px] text-gray-600 uppercase tracking-widest font-bold hover:text-white transition-colors"
                >
                  {t('allProducts', 'clearFilters')}
                </button>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* 2. Concierge Form Modal (Triggered by state) */}
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
