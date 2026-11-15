import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/ui/LocaleLink';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { verifyCertificate } from '../services/firebaseService';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { MaskLine, FadeUp, EASE_OUT } from '../components/motion/Reveal';

const VerifyCertificate = () => {
  const { certId } = useParams();
  const { t, language } = useLanguage();
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const checkCert = async () => {
      try {
        const data = await verifyCertificate(certId);
        setCertificate(data);
      } catch (error) {
        console.error("Verification error details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (certId && certId !== 'PREVIEW') {
      checkCert();
    } else {
      setLoading(false);
    }
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="status">
        <motion.span
          className="font-serif italic text-white/40 text-lg"
          animate={reduce ? undefined : { opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          {t('verify', 'loading')}
        </motion.span>
      </div>
    );
  }

  const issued = certificate?.createdAt
    ? new Date(certificate.createdAt.toDate()).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';

  const rows = certificate ? [
    { label: t('verify', 'artist'), value: 'Beliz Keskin', serif: true },
    { label: t('verify', 'collector'), value: certificate.collectorName || '—', serif: true },
    { label: t('verify', 'issued'), value: issued },
    { label: t('verify', 'edition'), value: t('verify', 'editionValue') },
    { label: t('verify', 'certId'), value: certId, mono: true },
  ] : [];

  return (
    <main className="min-h-screen bg-background text-white pt-36 lg:pt-44 pb-32 px-6">
      <SEO title={t('verify', 'title')} noindex />

      <div className="max-w-3xl mx-auto">
        {!certificate ? (
          <div>
            <h1 className="font-serif font-light tracking-[-0.02em] leading-[1.04] text-[2.75rem] sm:text-6xl text-white text-balance">
              <MaskLine delay={0.1}>{t('verify', 'failTitle')}</MaskLine>
            </h1>
            <FadeUp delay={0.35}>
              <p className="mt-6 text-white/60 font-light leading-relaxed text-base md:text-lg max-w-xl">{t('verify', 'failDesc')}</p>
              <Link to="/contact" className="hit group mt-10 inline-flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors">
                {t('verify', 'contact')}
                <ArrowRight size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </FadeUp>
          </div>
        ) : (
          <div>
            {/* The seal: a ring that draws itself closed before the check appears */}
            <div className="relative w-16 h-16 mb-10" aria-hidden="true">
              <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                <motion.circle
                  cx="32" cy="32" r="30" fill="none" stroke="#f26868" strokeWidth="1.25"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: EASE_OUT }}
                />
              </svg>
              <motion.span
                className="absolute inset-0 flex items-center justify-center text-primary-light"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: reduce ? 0 : 1.1, ease: EASE_OUT }}
              >
                <Check size={24} strokeWidth={1.5} />
              </motion.span>
            </div>

            <h1 className="font-serif font-light tracking-[-0.02em] leading-[1.04] text-[2.75rem] sm:text-6xl text-white">
              <MaskLine delay={0.2}>{t('verify', 'okTitle')}</MaskLine>
            </h1>
            <FadeUp delay={0.45}>
              <p className="mt-4 text-[11px] font-medium tracking-[0.22em] uppercase text-white/50">{t('verify', 'okSub')}</p>
            </FadeUp>

            <FadeUp delay={0.6}>
              <h2 className="mt-14 font-serif font-light italic text-3xl md:text-4xl text-white">
                {certificate.artwork?.name}
              </h2>

              <dl className="mt-8 border-t border-white/10">
                {rows.map((r) => (
                  <div key={r.label} className="flex items-baseline justify-between gap-6 py-4 border-b border-white/10">
                    <dt className="text-[11px] tracking-[0.18em] uppercase text-white/50">{r.label}</dt>
                    <dd className={`text-right ${r.serif ? 'font-serif text-lg text-white' : r.mono ? 'font-mono text-sm text-primary-light break-all' : 'text-white/85'}`}>
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 inline-flex items-center gap-2.5 text-[11px] tracking-[0.18em] uppercase text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light" aria-hidden="true" />
                {t('verify', 'status')}
              </p>

              <p className="mt-12 text-sm text-white/45 font-light leading-relaxed max-w-md">
                {t('verify', 'note')}
              </p>
            </FadeUp>
          </div>
        )}
      </div>
    </main>
  );
};

export default VerifyCertificate;
