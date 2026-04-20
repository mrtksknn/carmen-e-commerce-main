import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { useLocation } from 'react-router-dom';
import { useCustomToast } from '../components/ui/toast-context';
import { User, Mail, Tag, MessageSquare, Send, MapPin, Clock, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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

  const inputClasses = "w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/5 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-600 font-light backdrop-blur-md";

  return (
    <div className="relative min-h-screen bg-[#030303] text-white font-sans overflow-hidden py-24">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-5%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[140px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] left-[-15%] w-[60vw] h-[60vw] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block opacity-80">
            {t('contact', 'conciergeLabel')}
          </span>
          <h1 className="text-5xl md:text-6xl font-black mb-6 font-serif tracking-tight">
            {t('contact', 'heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            {t('contact', 'heroSubtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          
          {/* Left Side: Contact Form (Glassmorphism) */}
          <div className="w-full lg:w-3/5 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl animate-fade-in delay-100">
            <h2 className="text-2xl font-bold text-white mb-8 font-serif tracking-wide flex items-center gap-3">
              {t('contact', 'formTitle')}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="relative group">
                <label htmlFor="name" className="sr-only">{t('contact', 'namePlaceholder')}</label>
                <div className="absolute top-4 left-4 text-gray-500 group-focus-within:text-primary transition-colors">
                  <User size={20} />
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
                <div className="absolute top-4 left-4 text-gray-500 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
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
                <div className="absolute top-4 left-4 text-gray-500 group-focus-within:text-primary transition-colors">
                  <Tag size={20} />
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
                    <option className='bg-[#121212]' value="">{t('contact', 'subjectDefault')}</option>
                    <option className='bg-[#121212]' value="Purchase Inquiry">{t('contact', 'subjectPurchase')}</option>
                    <option className='bg-[#121212]' value="Commission Request">{t('contact', 'subjectCommission')}</option>
                    <option className='bg-[#121212]' value="Exhibition Opportunity">{t('contact', 'subjectExhibition')}</option>
                    <option className='bg-[#121212]' value="General Question">{t('contact', 'subjectGeneral')}</option>
                    {location.state?.subject && (
                      <option className='bg-[#121212]' value={location.state.subject}>{location.state.subject}</option>
                    )}
                  </select>
                )}
                {/* Custom chevron for select */}
                {(!location.state?.subject || formData.subject.includes(location.state.subject)) && (
                   <div className="absolute top-4 right-4 text-gray-500 pointer-events-none">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                   </div>
                )}
              </div>

              <div className="relative group">
                <label htmlFor="message" className="sr-only">Message</label>
                <div className="absolute top-4 left-4 text-gray-500 group-focus-within:text-primary transition-colors">
                  <MessageSquare size={20} />
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={`${inputClasses} resize-y min-h-[140px]`}
                  placeholder={t('contact', 'messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-primary hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(120,34,34,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group mt-4 overflow-hidden relative"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>{t('contact', 'sending')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('contact', 'sendButton')}</span>
                    <Send size={18} className="transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Side: Commission Roadmap & Info */}
          <div className="w-full lg:w-2/5 flex flex-col gap-12 animate-fade-in delay-200">
            
            {/* The Commission Roadmap */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8 font-serif tracking-wide border-b border-white/10 pb-4">
                {t('contact', 'roadmapTitle')}
              </h3>
              
              <div className="relative pl-6 space-y-8 border-l border-white/10 ml-3">
                
                <div className="relative">
                  <div className="absolute -left-[31px] bg-[#030303] p-1">
                    <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20"></div>
                  </div>
                  <h4 className="text-white font-bold tracking-wide mb-1 flex items-center gap-2">
                    {t('contact', 'phase1Title')}
                  </h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    {t('contact', 'phase1Desc')}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] bg-[#030303] p-1">
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  </div>
                  <h4 className="text-white font-bold tracking-wide mb-1">
                    {t('contact', 'phase2Title')}
                  </h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    {t('contact', 'phase2Desc')}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] bg-[#030303] p-1">
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  </div>
                  <h4 className="text-white font-bold tracking-wide mb-1">
                    {t('contact', 'phase3Title')}
                  </h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    {t('contact', 'phase3Desc')}
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] bg-[#030303] p-1">
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  </div>
                  <h4 className="text-white font-bold tracking-wide mb-1">
                    {t('contact', 'phase4Title')}
                  </h4>
                  <p className="text-gray-400 font-light text-sm leading-relaxed">
                    {t('contact', 'phase4Desc')}
                  </p>
                </div>

              </div>
            </div>

            {/* Studio Info Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="p-3 rounded-lg bg-black/40 text-primary mt-1">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <p className="text-white font-medium uppercase tracking-widest text-xs mb-1 opacity-60">{t('contact', 'locationLabel')}</p>
                     <p className="text-gray-300 font-serif text-lg">{t('contact', 'locationValue')}</p>
                     <p className="text-gray-500 text-sm mt-1">{t('contact', 'locationNote')}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-4">
                   <div className="p-3 rounded-lg bg-black/40 text-primary mt-1">
                     <Clock size={20} />
                   </div>
                   <div>
                     <p className="text-white font-medium uppercase tracking-widest text-xs mb-1 opacity-60">{t('contact', 'responseLabel')}</p>
                     <p className="text-gray-300 font-serif text-lg">{t('contact', 'responseValue')}</p>
                     <p className="text-gray-500 text-sm mt-1">{t('contact', 'responseNote')}</p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactMe;