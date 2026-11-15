import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { submitInquiry } from '../../services/inquiryService';
import { EASE_OUT } from '../motion/Reveal';
import { artImage } from '../../lib/artImage';

const fieldClass =
  'w-full bg-transparent border-0 border-b border-white/20 px-0 py-3 text-white text-base font-light placeholder:text-white/35 focus:outline-none focus:border-primary-light transition-colors duration-300';
const labelClass = 'block text-[11px] font-medium tracking-[0.18em] uppercase text-white/55';

const ConciergeModal = ({ artwork, t, children, isMulti = false, onSuccess, open: controlledOpen, onOpenChange: controlledOnOpenChange }) => {
  const reduce = useReducedMotion();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setIsOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setUncontrolledOpen;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    interest: 'purchase',
    message: '',
    website: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setHasError(false);

    try {
      const artworkInfo = isMulti
        ? (artwork.items?.map(item => ({ id: item.id, name: item.name })) || [])
        : { id: artwork?.id || 'unknown', name: artwork?.name || 'unknown' };

      // Saved to the panel, then emailed to the address set in admin settings
      await submitInquiry({
        customer: {
          name: formData.name,
          email: formData.email,
          location: formData.location
        },
        interest: formData.interest,
        message: formData.message,
        website: formData.website,
        artwork: artworkInfo,
        type: isMulti ? 'multi' : 'single',
        subjectLine: isMulti ? 'Toplu eser talebi' : `${artwork?.name} - Eser talebi`,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();

      // Reset after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setFormData({ name: '', email: '', location: '', interest: 'purchase', message: '', website: '' });
      }, 3000);
    } catch (error) {
      console.error("Inquiry error:", error);
      setIsSubmitting(false);
      setHasError(true);
    }
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });
  const multiSubtitle = (t('productDetails', 'multiConciergeSubtitle') || '').replace('{n}', artwork?.items?.length || 0);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-[120] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-2xl max-h-[calc(100svh-2rem)] overflow-y-auto z-[121] outline-none">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="bg-[#0b0b0b] border border-white/10 rounded-[4px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] relative"
          >
            {/* Header */}
            <div className="flex items-center gap-5 px-6 sm:px-10 pt-8 sm:pt-10 pb-6 border-b border-white/10">
              {isMulti ? (
                <div className="flex -space-x-3 flex-shrink-0">
                  {artwork.items?.slice(0, 3).map((item, i) => (
                    <div key={item.id || i} className="w-12 h-14 rounded-[2px] overflow-hidden ring-2 ring-[#0b0b0b]" style={{ zIndex: 3 - i }}>
                      <img {...artImage(item.img, { sizes: '96px', maxWidth: 480 })} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  {artwork.items?.length > 3 && (
                    <div className="w-12 h-14 rounded-[2px] bg-white/10 ring-2 ring-[#0b0b0b] flex items-center justify-center text-xs tabular-nums">
                      +{artwork.items.length - 3}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-14 h-16 sm:w-16 sm:h-20 flex-shrink-0 rounded-[2px] overflow-hidden ring-1 ring-white/10">
                  <img {...artImage(artwork?.img, { sizes: '160px', maxWidth: 480 })} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="min-w-0 pr-10">
                <Dialog.Title className="font-serif font-light text-2xl sm:text-3xl text-white leading-tight">
                  {isMulti ? t('productDetails', 'multiConciergeTitle') : (artwork?.name || t('productDetails', 'conciergeTitle'))}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-white/55 font-light mt-1.5">
                  {isMulti ? multiSubtitle : t('productDetails', 'conciergeSubtitle')}
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label={t('productDetails', 'close')}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-white/60 transition-colors"
              >
                <X size={16} />
              </Dialog.Close>
            </div>

            <div className="px-6 sm:px-10 py-8 sm:py-10">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                    role="status"
                  >
                    <span className="w-14 h-14 rounded-full border border-primary-light/60 flex items-center justify-center mb-6 text-primary-light">
                      <Check size={22} />
                    </span>
                    <h3 className="font-serif font-light text-3xl text-white mb-2">{t('productDetails', 'successTitle')}</h3>
                    <p className="text-white/60 font-light">{t('productDetails', 'successDesc')}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Honeypot: hidden from people and assistive tech, filled in only by bots */}
                    <input type="text" name="website" value={formData.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
                    <label className="block">
                      <span className={labelClass}>{t('productDetails', 'fullNameLabel')}</span>
                      <input required type="text" autoComplete="name" maxLength={100} className={fieldClass} value={formData.name} onChange={set('name')} />
                    </label>

                    <label className="block">
                      <span className={labelClass}>{t('productDetails', 'emailLabel')}</span>
                      <input required type="email" autoComplete="email" maxLength={254} className={fieldClass} value={formData.email} onChange={set('email')} />
                    </label>

                    <label className="block">
                      <span className={labelClass}>{t('productDetails', 'locationLabel')}</span>
                      <input type="text" autoComplete="address-level2" maxLength={120} className={fieldClass} value={formData.location} onChange={set('location')} />
                    </label>

                    <label className="block">
                      <span className={labelClass}>{t('productDetails', 'interestLabel')}</span>
                      <select className={`${fieldClass} appearance-none cursor-pointer`} value={formData.interest} onChange={set('interest')}>
                        <option className="bg-[#121212]" value="purchase">{t('productDetails', 'interestPurchase')}</option>
                        <option className="bg-[#121212]" value="commission">{t('productDetails', 'interestCommission')}</option>
                        <option className="bg-[#121212]" value="other">{t('productDetails', 'interestOther')}</option>
                      </select>
                    </label>

                    <label className="block sm:col-span-2">
                      <span className={labelClass}>{t('productDetails', 'messageLabel')}</span>
                      <textarea rows="3" maxLength={4000} className={`${fieldClass} resize-none`} value={formData.message} onChange={set('message')} />
                    </label>

                    {hasError && (
                      <p className="sm:col-span-2 text-sm text-primary-light" role="alert">
                        {t('productDetails', 'sendError')}
                      </p>
                    )}

                    <div className="sm:col-span-2 pt-2">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="group relative w-full inline-flex items-center justify-center gap-3 py-4 rounded-full bg-white text-black overflow-hidden disabled:opacity-60 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0b]"
                      >
                        <span aria-hidden="true" className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 group-disabled:scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        {isSubmitting ? (
                          <span className="relative z-10 w-4 h-4 border-2 border-black/25 border-t-black rounded-full animate-spin" />
                        ) : (
                          <>
                            <span className="relative z-10 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-500 group-hover:text-white">
                              {t('productDetails', 'sendInquiry')}
                            </span>
                            <ArrowRight size={16} className="relative z-10 transition-all duration-500 group-hover:text-white group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConciergeModal;
