import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { useLocation } from 'react-router-dom';
import { useCustomToast } from '../components/ui/toast-context';
import { User, Mail, Tag, MessageSquare, Send, MapPin, Clock, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

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
        'service_tb170xp',
        'template_6rez0q9',
        {
          name: formData.name,
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'HPGdH6pTAslP_R5k0'
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

  const inputClasses = "w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/5 text-white focus:outline-none focus:bg-[#030303] focus:border-[#782222]/50 focus:ring-1 focus:ring-[#c0392b]/30 transition-all placeholder:text-gray-600 font-light text-sm shadow-inner group-hover:border-white/10";

  return (
    <main className="relative min-h-screen bg-[#030303] text-white font-sans overflow-hidden py-32">
      <SEO 
        title="Contact Me"
        description="Get in touch with Carmen for commissions, exhibitions, or purchase inquiries."
      />

      {/* Cinematic Ambient Glows */}
      <div className="absolute top-[-5%] right-[-10%] w-[50vw] h-[50vw] bg-[#782222]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-15%] w-[60vw] h-[60vw] bg-[#782222]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Noise Texture Overlay for Premium Vibe */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-[85rem] mx-auto px-6 lg:px-20 relative z-10">

        {/* ── Header ── */}
        <header className="text-center mb-16 animate-fade-in flex flex-col items-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#c0392b]"></div>
            <span className="text-[#c0392b] font-extrabold tracking-[0.3em] uppercase text-[0.65rem] opacity-90">
              {t('contact', 'conciergeLabel')}
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#c0392b]"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-serif tracking-tight leading-[1.05]">
            {t('contact', 'heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t('contact', 'heroSubtitle')}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start justify-center max-w-7xl mx-auto">

          {/* ── Left Side: Contact Form (Glassmorphism) ── */}
          <section className="w-full lg:w-3/5 bg-[#111]/40 border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-fade-in delay-100 relative overflow-hidden group/card">
            
            {/* Inner ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#782222]/10 blur-[80px] rounded-full pointer-events-none opacity-50 group-hover/card:opacity-100 transition-opacity duration-1000"></div>

            <h2 className="text-2xl font-serif text-white mb-8 tracking-wide flex items-center gap-4 relative z-10">
              <span className="w-1.5 h-6 bg-gradient-to-b from-[#c0392b] to-transparent rounded-full block"></span>
              {t('contact', 'formTitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

              <div className="relative group">
                <label htmlFor="name" className="sr-only">{t('contact', 'namePlaceholder')}</label>
                <div className="absolute top-[18px] left-5 text-gray-500 group-focus-within:text-[#c0392b] transition-colors duration-300">
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
                <div className="absolute top-[18px] left-5 text-gray-500 group-focus-within:text-[#c0392b] transition-colors duration-300">
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
                <div className="absolute top-[18px] left-5 text-gray-500 group-focus-within:text-[#c0392b] transition-colors duration-300">
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
                  <div className="absolute top-[20px] right-5 text-gray-500 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                )}
              </div>

              <div className="relative group">
                <label htmlFor="message" className="sr-only">Message</label>
                <div className="absolute top-[18px] left-5 text-gray-500 group-focus-within:text-[#c0392b] transition-colors duration-300">
                  <MessageSquare size={18} />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`${inputClasses} resize-y min-h-[140px] pt-[18px]`}
                  placeholder={t('contact', 'messagePlaceholder')}
                />
              </div>

              {/* Glowing Send Button */}
              <div className="relative mt-8 group/btn pt-2">
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-r from-transparent via-[#c0392b] to-transparent h-[1px] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full flex justify-center items-center gap-3 overflow-hidden rounded-xl p-[1px] disabled:opacity-50 disabled:cursor-not-allowed group/text"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[#782222] via-[#c0392b] to-[#782222] opacity-70 group-hover/btn:opacity-100 blur-[2px] transition-opacity duration-500"></span>
                  <span className="relative w-full flex items-center justify-center gap-3 bg-[#0a0a0a] border border-white/10 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-[0.75rem] transition-all duration-300 group-hover/text:bg-transparent">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin text-white" size={18} />
                        <span>{t('contact', 'sending')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('contact', 'sendButton')}</span>
                        <Send size={16} className="transform group-hover/text:translate-x-1 group-hover/text:-translate-y-1 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              </div>

            </form>
          </section>

          {/* ── Right Side: Commission Roadmap & Info ── */}
          <aside className="w-full lg:w-2/5 flex flex-col gap-10 animate-fade-in delay-200 lg:sticky lg:top-32">

            {/* The Commission Roadmap */}
            <div className="bg-[#111]/20 border border-white/5 rounded-3xl p-8 md:p-10 backdrop-blur-md">
              <h3 className="text-xl font-serif text-white mb-8 tracking-wide border-b border-white/10 pb-4 flex items-center gap-3">
                 <span className="w-1.5 h-4 bg-gradient-to-b from-[#c0392b] to-transparent rounded-full block"></span>
                 {t('contact', 'roadmapTitle')}
              </h3>

              <div className="relative pl-6 space-y-8 border-l border-white/10 ml-2">

                {/* Step 1 */}
                <div className="relative group/step">
                  <div className="absolute -left-[30px] p-1 bg-[#030303] group-hover/step:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#c0392b] shadow-[0_0_10px_rgba(192,57,43,0.8)] ring-4 ring-[#782222]/30"></div>
                  </div>
                  <h4 className="text-white font-serif tracking-wide mb-1 text-lg group-hover/step:text-[#c0392b] transition-colors">
                    {t('contact', 'phase1Title')}
                  </h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    {t('contact', 'phase1Desc')}
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative group/step">
                  <div className="absolute -left-[30px] p-1 bg-[#030303] group-hover/step:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover/step:bg-[#c0392b] transition-colors"></div>
                  </div>
                  <h4 className="text-white font-serif tracking-wide mb-1 text-lg group-hover/step:text-[#c0392b] transition-colors">
                    {t('contact', 'phase2Title')}
                  </h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    {t('contact', 'phase2Desc')}
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative group/step">
                  <div className="absolute -left-[30px] p-1 bg-[#030303] group-hover/step:scale-110 transition-transform">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover/step:bg-[#c0392b] transition-colors"></div>
                  </div>
                  <h4 className="text-white font-serif tracking-wide mb-1 text-lg group-hover/step:text-[#c0392b] transition-colors">
                    {t('contact', 'phase3Title')}
                  </h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    {t('contact', 'phase3Desc')}
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative group/step hover:border-transparent">
                  <div className="absolute -left-[30px] p-1 bg-[#030303] group-hover/step:scale-110 transition-transform bg-gradient-to-b from-transparent to-[#030303]">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20 group-hover/step:bg-[#c0392b] transition-colors"></div>
                  </div>
                  <h4 className="text-white font-serif tracking-wide mb-1 text-lg group-hover/step:text-[#c0392b] transition-colors">
                    {t('contact', 'phase4Title')}
                  </h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    {t('contact', 'phase4Desc')}
                  </p>
                </div>

              </div>
            </div>

            {/* Studio Info Card */}
            <div className="bg-[#111]/40 border border-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-md hover:border-[#782222]/30 hover:bg-[#151515]/60 transition-all duration-500 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
              <div className="space-y-6">
                
                <div className="flex items-start gap-5">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[#c0392b] shadow-inner flex-shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[0.65rem] mb-1">{t('contact', 'locationLabel')}</p>
                    <p className="text-gray-200 font-serif text-lg leading-tight">{t('contact', 'locationValue')}</p>
                    <p className="text-gray-500 text-sm mt-1 font-light italic">{t('contact', 'locationNote')}</p>
                  </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                <div className="flex items-start gap-5">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[#c0392b] shadow-inner flex-shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[0.65rem] mb-1">{t('contact', 'responseLabel')}</p>
                    <p className="text-gray-200 font-serif text-lg leading-tight">{t('contact', 'responseValue')}</p>
                    <p className="text-gray-500 text-sm mt-1 font-light italic">{t('contact', 'responseNote')}</p>
                  </div>
                </div>

              </div>
            </div>

          </aside>
        </div>

      </div>
    </main>
  );
};

export default ContactMe;