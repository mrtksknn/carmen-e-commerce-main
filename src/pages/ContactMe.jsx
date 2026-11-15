import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useCustomToast } from '../components/ui/toast-context';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { submitInquiry } from '../services/inquiryService';
import { MaskLine, FadeUp } from '../components/motion/Reveal';
import { APP_CONFIG } from '../lib/constants';
import { breadcrumbSchema, jsonLd } from '../lib/seo-data.mjs';

const fieldClass =
  'w-full bg-transparent border-0 border-b border-white/20 px-0 py-3.5 text-white text-base md:text-lg font-light placeholder:text-white/35 focus:outline-none focus:border-primary-light transition-colors duration-300';
const labelClass = 'block text-[11px] font-medium tracking-[0.18em] uppercase text-white/55';

const ContactMe = () => {
  const location = useLocation();
  const showToast = useCustomToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    website: '',
    name: '',
    email: '',
    subject: location.state?.subject || '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Saved to the panel, then emailed to the address set in admin settings
      await submitInquiry({
        customer: {
          name: formData.name,
          email: formData.email,
          location: ''
        },
        interest: formData.subject || 'General Question',
        website: formData.website,
        message: formData.message,
        artwork: null,
        type: 'contact_form',
        subjectLine: `İletişim formu - ${formData.subject || 'Genel soru'}`,
      });

      showToast({ type: "success", message: t('contact', 'successMessage') });
      setFormData({ website: '', name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Contact submit error:', error);
      showToast({ type: "error", message: t('contact', 'errorMessage') });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const presetSubject = location.state?.subject;
  const useFreeSubject = presetSubject && !formData.subject.includes(presetSubject);

  const facts = [
    { label: t('contact', 'responseLabel'), value: t('contact', 'responseValue'), note: t('contact', 'responseNote') },
    { label: t('contact', 'locationLabel'), value: t('contact', 'locationValue'), note: t('contact', 'locationNote') },
    { label: t('contact', 'commissionLabel'), value: t('contact', 'commissionValue'), note: t('contact', 'commissionNote') },
  ];

  return (
    <main className="relative min-h-screen bg-background text-white font-sans pt-36 lg:pt-44 pb-36">
      <SEO
        title={t('seo', 'contactTitle')}
        description={t('seo', 'contactDesc')}
        schema={jsonLd(breadcrumbSchema(APP_CONFIG.BASE_URL, [{ name: 'Piece Of Oblivion', path: '/' }, { name: t('seo', 'contactTitle'), path: '/contact' }], language))}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <header className="mb-20 lg:mb-24 max-w-3xl">
          <h1 className="font-serif font-light tracking-[-0.02em] leading-[1.02] text-[3rem] sm:text-[4rem] lg:text-[5.5rem] text-white text-balance">
            <MaskLine delay={0.15}>{t('contact', 'heroTitle')}</MaskLine>
          </h1>
          <FadeUp delay={0.45}>
            <p className="mt-6 text-base md:text-lg text-white/60 max-w-xl font-light leading-relaxed">
              {t('contact', 'heroSubtitle')}
            </p>
          </FadeUp>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          {/* ── Form ── */}
          <FadeUp delay={0.6} className="lg:col-span-7">
            <h2 className="sr-only">{t('contact', 'formTitle')}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
              {/* Honeypot: hidden from people and assistive tech, filled in only by bots */}
              <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] w-px h-px opacity-0" />
              <label className="block">
                <span className={labelClass}>{t('contact', 'namePlaceholder')}</span>
                <input
                  type="text"
                  name="name"
                  maxLength={100}
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </label>

              <label className="block">
                <span className={labelClass}>{t('contact', 'emailPlaceholder')}</span>
                <input
                  type="email"
                  name="email"
                  maxLength={254}
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={fieldClass}
                />
              </label>

              <label className="block sm:col-span-2 relative">
                <span className={labelClass}>{t('contact', 'subjectLabel')}</span>
                {useFreeSubject ? (
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={fieldClass}
                  />
                ) : (
                  <>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className={`${fieldClass} appearance-none cursor-pointer pr-8 ${formData.subject ? '' : 'text-white/45'}`}
                    >
                      <option className="bg-[#121212] text-white" value="">{t('contact', 'subjectDefault')}</option>
                      <option className="bg-[#121212] text-white" value="Purchase Inquiry">{t('contact', 'subjectPurchase')}</option>
                      <option className="bg-[#121212] text-white" value="Commission Request">{t('contact', 'subjectCommission')}</option>
                      <option className="bg-[#121212] text-white" value="Exhibition Opportunity">{t('contact', 'subjectExhibition')}</option>
                      <option className="bg-[#121212] text-white" value="General Question">{t('contact', 'subjectGeneral')}</option>
                      {presetSubject && (
                        <option className="bg-[#121212] text-white" value={presetSubject}>{presetSubject}</option>
                      )}
                    </select>
                    <ChevronDown size={16} className="absolute right-0 bottom-4 pointer-events-none text-white/50" />
                  </>
                )}
              </label>

              <label className="block sm:col-span-2">
                <span className={labelClass}>{t('contact', 'messageLabel')}</span>
                <textarea
                  name="message"
                  maxLength={4000}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`${fieldClass} resize-y min-h-[140px]`}
                  placeholder={t('contact', 'messagePlaceholder')}
                />
              </label>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center gap-3 pl-8 pr-7 py-4 rounded-full bg-white text-black overflow-hidden disabled:opacity-60 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span aria-hidden="true" className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 group-disabled:scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <span className="relative z-10 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-500 group-hover:text-white">
                    {isSubmitting ? t('contact', 'sending') : t('contact', 'sendButton')}
                  </span>
                  {isSubmitting ? (
                    <span className="relative z-10 w-4 h-4 border-2 border-black/25 border-t-black rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={16} className="relative z-10 transition-all duration-500 group-hover:text-white group-hover:translate-x-1" />
                  )}
                </button>
              </div>
            </form>
          </FadeUp>

          {/* ── Studio facts ── */}
          <aside className="lg:col-span-4 lg:col-start-9 lg:sticky lg:top-32">
            <dl className="border-t border-white/10">
              {facts.map((f, i) => (
                <FadeUp key={f.label} delay={0.7 + i * 0.1}>
                  <div className="py-7 border-b border-white/10">
                    <dt className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/50">{f.label}</dt>
                    <dd className="mt-2">
                      <span className="block font-serif font-light text-3xl text-white">{f.value}</span>
                      <span className="block mt-2 text-sm text-white/55 font-light leading-relaxed">{f.note}</span>
                    </dd>
                  </div>
                </FadeUp>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ContactMe;
