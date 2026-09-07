import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Send, CheckCircle2, MapPin, User, Mail, MessageSquare, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { addInquiry } from '../../services/firebaseService';

const ConciergeModal = ({ artwork, t, children, isMulti = false, onSuccess, open: controlledOpen, onOpenChange: controlledOnOpenChange }) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setIsOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setUncontrolledOpen;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    interest: 'purchase',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const artworkInfo = isMulti
        ? (artwork.items?.map(item => ({ id: item.id, name: item.name })) || [])
        : { id: artwork?.id || 'unknown', name: artwork?.name || 'unknown' };

      const inquiryData = {
        customer: {
          name: formData.name,
          email: formData.email,
          location: formData.location
        },
        interest: formData.interest,
        message: formData.message,
        artwork: artworkInfo,
        type: isMulti ? 'multi' : 'single'
      };

      // 1. Save to Firebase for Dashboard
      await addInquiry(inquiryData);

      // 2. Send via EmailJS for instant notification
      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: isMulti ? 'Toplu Eser Bilgi Talebi' : `${artwork?.name} - Eser Bilgi Talebi`,
        message: `
          ${formData.message}

          Konum: ${formData.location}

          İlgi Alanı: ${formData.interest}
          
          Talep Edilen Eser(ler): ${isMulti ? artwork.items?.map(i => i.name).join(', ') : artwork?.name}
        `.trim()
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        emailParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setIsSubmitting(false);
      setIsSuccess(true);
      if (onSuccess) onSuccess();

      // Reset after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setFormData({ name: '', email: '', location: '', interest: 'purchase', message: '' });
      }, 3000);
    } catch (error) {
      console.error("Inquiry error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-[120] animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl z-[121] outline-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-[#0c0c0c] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
          >
            {/* Header / Banner */}
            <div className="relative h-32 sm:h-40 bg-gradient-to-br from-primary/20 to-transparent flex items-center px-8 sm:px-12 border-b border-white/5">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              <div className="flex items-center gap-6">
                {isMulti ? (
                  <div className="flex -space-x-4">
                    {artwork.items?.slice(0, 3).map((item, i) => (
                      <div key={i} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-[#0c0c0c] shadow-xl relative" style={{ zIndex: 3 - i }}>
                        <img src={item.img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {artwork.items?.length > 3 && (
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-white/10 border-2 border-[#0c0c0c] flex items-center justify-center text-[10px] font-bold z-0">
                        +{artwork.items.length - 3}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                    <img src={artwork?.img} alt={artwork?.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <Dialog.Title className="text-xl sm:text-2xl font-serif text-white tracking-tight">
                    {isMulti ? t('productDetails', 'multiConciergeTitle') || 'Toplu Danışmanlık' : t('productDetails', 'conciergeTitle')}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs sm:text-sm text-gray-400 font-light mt-1 max-w-xs">
                    {isMulti ? `${artwork.items?.length} ${t('allProducts', 'masterworksCount')} için bilgi alıyorsunuz.` : t('productDetails', 'conciergeSubtitle')}
                  </Dialog.Description>
                </div>
              </div>
              <Dialog.Close className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary transition-all">
                <X size={18} />
              </Dialog.Close>
            </div>

            {/* Content Area */}
            <div className="p-8 sm:p-12">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-2">{t('productDetails', 'successTitle')}</h3>
                    <p className="text-gray-400 font-light">{t('productDetails', 'successDesc')}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 flex items-center gap-2">
                        <User size={12} className="text-primary" />
                        {t('productDetails', 'fullNameLabel')}
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 flex items-center gap-2">
                        <Mail size={12} className="text-primary" />
                        {t('productDetails', 'emailLabel')}
                      </label>
                      <input
                        required
                        type="email"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 flex items-center gap-2">
                        <MapPin size={12} className="text-primary" />
                        {t('productDetails', 'locationLabel')}
                      </label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>

                    {/* Nature of Interest */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 flex items-center gap-2">
                        <Info size={12} className="text-primary" />
                        {t('productDetails', 'interestLabel')}
                      </label>
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none appearance-none"
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      >
                        <option value="purchase">{t('productDetails', 'interestPurchase')}</option>
                        <option value="viewing">{t('productDetails', 'interestViewing')}</option>
                        <option value="framing">{t('productDetails', 'interestFraming')}</option>
                        <option value="other">{t('productDetails', 'interestOther')}</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 flex items-center gap-2">
                        <MessageSquare size={12} className="text-primary" />
                        {t('productDetails', 'messageLabel')}
                      </label>
                      <textarea
                        rows="3"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-2 pt-4">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-hover text-white font-bold tracking-[0.2em] uppercase text-xs py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 group"
                      >
                        {isSubmitting ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        ) : (
                          <>
                            {t('productDetails', 'sendInquiry')}
                            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
