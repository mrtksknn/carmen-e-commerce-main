import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { useLocation } from 'react-router-dom';
import { useCustomToast } from '../components/ui/toast-context';
import { User, Mail, Tag, MessageSquare, MapPin, Clock, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const ContactMe = () => {
  const location = useLocation();
  const showToast = useCustomToast();
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: location.state?.subject || '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        showToast({ type: "success", message: t('contact', 'successMessage') });
        setFormData({ name: '', email: '', subject: '', message: '' });
      })
      .catch((error) => {
        showToast({ type: "error", message: t('contact', 'errorMessage') });
        console.error('Email send error:', error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses = "w-full pl-14 pr-6 py-5 rounded-2xl bg-[#030303]/60 border border-white/5 text-white focus:outline-none focus:bg-[#0a0a0a] focus:border-[#a83229]/50 focus:ring-1 focus:ring-[#a83229]/30 transition-all placeholder:text-gray-600 font-light text-sm shadow-inner group-hover:border-white/10 group-focus-within:border-[#a83229]/30";

  return (
    <main className="relative min-h-screen bg-[#030303] text-white font-sans overflow-hidden py-32 selection:bg-[#a83229] selection:text-white">
      <SEO 
        title="Contact Me"
        description="Get in touch with Carmen for commissions, exhibitions, or purchase inquiries."
      />

      {/* Cinematic Ambient Glows */}
      <div className="absolute top-[-5%] right-[-10%] w-[50vw] h-[50vw] bg-[#a83229]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-15%] w-[60vw] h-[60vw] bg-[#a83229]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Noise Texture Overlay for Premium Vibe */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-[85rem] mx-auto px-6 lg:px-20 relative z-10">

        {/* ── Header ── */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#a83229]"></div>
            <span className="text-[#a83229] font-extrabold tracking-[0.3em] uppercase text-[9px] opacity-90 drop-shadow-[0_0_15px_rgba(168,50,41,0.5)]">
              {t('contact', 'conciergeLabel') || 'The Concierge'}
            </span>
            <div className="w-10 h-px bg-gradient-to-l from-transparent to-[#a83229]"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-serif tracking-tight leading-[1.05]">
            {t('contact', 'heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t('contact', 'heroSubtitle')}
          </p>
        </motion.header>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start justify-center max-w-7xl mx-auto"
        >

          {/* ── Left Side: Contact Form (Glassmorphism) ── */}
          <motion.section variants={fadeInUp} className="w-full lg:w-2/3 bg-[#0a0a0a]/60 border border-white/5 p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative overflow-hidden group/card z-10">
            
            {/* Inner ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#a83229]/10 blur-[80px] rounded-full pointer-events-none opacity-50 group-hover/card:opacity-100 transition-opacity duration-1000"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"></div>

            <h2 className="text-2xl lg:text-3xl font-serif text-white mb-10 tracking-wide flex items-center gap-4 relative z-10">
              <span className="w-1.5 h-6 bg-gradient-to-b from-[#a83229] to-transparent rounded-full block"></span>
              {t('contact', 'formTitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

              <div className="relative group">
                <label htmlFor="name" className="sr-only">{t('contact', 'namePlaceholder')}</label>
                <div className="absolute top-[22px] left-6 text-gray-500 group-focus-within:text-[#a83229] transition-colors duration-300">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder={t('contact', 'namePlaceholder')}
                />
              </div>

              <div className="relative group">
                <label htmlFor="email" className="sr-only">{t('contact', 'emailPlaceholder')}</label>
                <div className="absolute top-[22px] left-6 text-gray-500 group-focus-within:text-[#a83229] transition-colors duration-300">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                  title="Please enter a valid email address (e.g. user@domain.com)"
                  className={inputClasses}
                  placeholder={t('contact', 'emailPlaceholder')}
                />
              </div>

              <div className="relative group">
                <label htmlFor="subject" className="sr-only">Subject</label>
                <div className="absolute top-[22px] left-6 text-gray-500 group-focus-within:text-[#a83229] transition-colors duration-300">
                  <Tag size={18} />
                </div>
                {location.state?.subject && !formData.subject.includes(location.state.subject) ? (
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={inputClasses}
                  />
                ) : (
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`${inputClasses} appearance-none cursor-pointer`}
                  >
                    <option className='bg-[#121212] py-2' value="">{t('contact', 'subjectDefault')}</option>
                    <option className='bg-[#121212] py-2' value="Purchase Inquiry">{t('contact', 'subjectPurchase')}</option>
                    <option className='bg-[#121212] py-2' value="Commission Request">{t('contact', 'subjectCommission')}</option>
                    <option className='bg-[#121212] py-2' value="Exhibition Opportunity">{t('contact', 'subjectExhibition')}</option>
                    <option className='bg-[#121212] py-2' value="General Question">{t('contact', 'subjectGeneral')}</option>
                    {location.state?.subject && (
                      <option className='bg-[#121212] py-2' value={location.state.subject}>{location.state.subject}</option>
                    )}
                  </select>
                )}
                {/* Custom chevron for select */}
                {(!location.state?.subject || formData.subject.includes(location.state.subject)) && (
                  <div className="absolute top-[22px] right-6 text-gray-500 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                )}
              </div>

              <div className="relative group">
                <label htmlFor="message" className="sr-only">Message</label>
                <div className="absolute top-[22px] left-6 text-gray-500 group-focus-within:text-[#a83229] transition-colors duration-300">
                  <MessageSquare size={18} />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`${inputClasses} resize-y min-h-[160px] pt-[22px]`}
                  placeholder={t('contact', 'messagePlaceholder')}
                />
              </div>

              {/* Glowing Send Button */}
              <div className="relative mt-8 pt-2 group/btn">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl p-[1px] hover:shadow-[0_15px_30px_rgba(168,50,41,0.3)] transition-shadow duration-500 disabled:opacity-50 disabled:cursor-not-allowed group/text"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#a83229] via-[#ff4d4d] to-[#a83229] opacity-40 group-hover/text:opacity-100 blur-[2px] transition-opacity duration-500"></span>
                  <span className="relative w-full flex items-center justify-center gap-4 bg-[#050505] border border-white/10 text-white px-8 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-300 group-hover/text:bg-[#0a0a0a]">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin text-white" size={18} />
                        <span>{t('contact', 'sending')}</span>
                      </>
                    ) : (
                      <>
                        <span className="pl-2">{t('contact', 'sendButton')}</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/text:bg-white group-hover/text:text-[#a83229] transition-all duration-500">
                          <ArrowRight size={14} className="-rotate-45 group-hover/text:rotate-0 transition-transform duration-500" />
                        </div>
                      </>
                    )}
                  </span>
                </button>
              </div>

            </form>
          </motion.section>

          {/* ── Right Side: Studio Info minimalist ── */}
          <motion.aside variants={fadeInUp} className="w-full lg:w-1/3 flex flex-col gap-8 lg:sticky lg:top-32 relative z-10">
            <div className="bg-[#050505]/60 border border-white/5 rounded-[2.5rem] p-8 lg:p-10 backdrop-blur-3xl hover:border-[#a83229]/30 transition-all duration-500 shadow-[0_30px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group">
              
              <div className="absolute inset-0 bg-gradient-to-br from-[#a83229]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0 pointer-events-none"></div>

              <div className="space-y-10 relative z-10">
                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-full bg-[#0a0a0a] border border-white/10 text-[#a83229] shadow-inner w-max group-hover:bg-[#a83229]/10 group-hover:border-[#a83229]/30 transition-all duration-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-white mb-2">{t('contact', 'locationValue')}</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('contact', 'locationLabel')}</p>
                    <p className="text-gray-400 text-sm mt-3 font-light leading-relaxed">{t('contact', 'locationNote')}</p>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-full bg-[#0a0a0a] border border-white/10 text-[#a83229] shadow-inner w-max group-hover:bg-[#a83229]/10 group-hover:border-[#a83229]/30 transition-all duration-500">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-white mb-2">{t('contact', 'responseValue')}</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{t('contact', 'responseLabel')}</p>
                    <p className="text-gray-400 text-sm mt-3 font-light leading-relaxed">{t('contact', 'responseNote')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

        </motion.div>

      </div>
    </main>
  );
};

export default ContactMe;