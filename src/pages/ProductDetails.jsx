import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { useProduct } from "../hooks/useProduct";
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { ArrowLeft, ArrowRight, X, Maximize2 } from 'lucide-react';
import ConciergeModal from '../components/landing/ConciergeModal';
import { MaskLine, FadeUp, Unveil, EASE_OUT } from '../components/motion/Reveal';

const Details = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const { product: data, loading: isLoading } = useProduct(id);
  const [activeImage, setActiveImage] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync active image when product data loads
  useEffect(() => {
    if (data?.img && !activeImage) {
      setActiveImage(data.img);
    }
  }, [data, activeImage]);

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center" role="status">
      <motion.span
        className="font-serif italic text-white/40 text-lg"
        animate={reduce ? undefined : { opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        {t('landing', 'curatingVault')}
      </motion.span>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-24 text-center">
      <SEO title={t('productDetails', 'notFoundTitle')} description={t('productDetails', 'notFoundDesc')} />
      <div className="max-w-lg">
        <h1 className="text-4xl md:text-5xl font-serif font-light text-white mb-4">{t('productDetails', 'notFoundTitle')}</h1>
        <p className="text-white/60 mb-10 font-light">{t('productDetails', 'notFoundDesc')}</p>
        <Link to="/products" className="inline-flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          {t('productDetails', 'backToProducts')}
        </Link>
      </div>
    </div>
  );

  const isSold = data.status === true;
  const images = [data.img, data.img2, data.img3].filter(Boolean);
  const shown = activeImage || data.img;

  // Prices are not published, so the work is described as an artwork rather than a priced product
  const artworkSchema = {
    "@context": "https://schema.org/",
    "@type": "VisualArtwork",
    "name": data.name,
    "image": data.img,
    "description": data.description || `${data.name} — Beliz Keskin.`,
    "creator": { "@type": "Person", "name": "Beliz Keskin" },
    ...(data.material ? { "artMedium": data.material } : {}),
    ...(data.dimensions ? { "size": data.dimensions } : {}),
    "artEdition": 1,
    "url": window.location.href
  };

  const specs = [
    { label: t('productDetails', 'dimensionsLabel'), value: data.dimensions },
    { label: t('productDetails', 'mediumLabel'), value: data.material },
    ...(isSold ? [{ label: t('productDetails', 'statusLabel'), value: t('productDetails', 'sold') }] : []),
  ].filter((s) => s.value);

  // Purchase enquiries for payment plans and international buyers go to this address
  const purchaseEmail = 'crnoktay@gmail.com';
  const purchaseMailto = `mailto:${purchaseEmail}?subject=${encodeURIComponent(
    (t('productDetails', 'paymentMailSubject') || '').replace('{name}', data.name)
  )}`;
  const [planBefore, planAfter] = (t('productDetails', 'paymentNotePlan') || '').split('{email}');

  return (
    <main className="bg-background min-h-screen relative font-sans pt-28 lg:pt-32 pb-32">
      <SEO
        title={data.name}
        description={data.description || `${data.name} — Beliz Keskin.`}
        ogImage={data.img}
        schema={artworkSchema}
      />

      <article className="max-w-7xl mx-auto px-6">
        <FadeUp>
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 text-xs tracking-[0.18em] uppercase font-semibold text-white/60 hover:text-white transition-colors duration-300 mb-10"
          >
            <ArrowLeft size={16} className="transition-transform duration-500 group-hover:-translate-x-1" />
            {t('productDetails', 'backToProducts')}
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* ── The work ── */}
          <div className="lg:col-span-7 w-full">
            <Unveil delay={0.1} duration={1.4} className="relative w-full h-[62vh] sm:h-[70vh] lg:h-[78vh] max-h-[860px]">
              {/* A faint wash of light on the wall so the black frame reads against the dark page */}
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,rgba(255,255,255,0.06),transparent_72%)]" />

              <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
                {/* Thin matte black frame that hugs the work at its own proportions */}
                <button
                  type="button"
                  onClick={() => setIsViewerOpen(true)}
                  aria-label={t('productDetails', 'viewLarge')}
                  className="group relative inline-flex p-[9px] sm:p-[12px] rounded-[1px] cursor-zoom-in bg-[linear-gradient(150deg,#2a2827_0%,#121110_38%,#070707_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_2px_0_rgba(255,255,255,0.04)_inset,0_40px_70px_-25px_rgba(0,0,0,0.95),0_12px_24px_-12px_rgba(0,0,0,0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  <motion.img
                    key={shown}
                    src={shown}
                    alt={data.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                    className="block w-auto h-auto max-w-full max-h-[calc(62vh-50px)] sm:max-h-[calc(70vh-60px)] lg:max-h-[min(calc(78vh-60px),800px)] object-contain"
                  />
                  {/* Inner lip where the canvas meets the moulding */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-[9px] sm:inset-[12px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.85),inset_0_3px_8px_rgba(0,0,0,0.45)]" />
                  <span aria-hidden="true" className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500">
                    <Maximize2 size={15} strokeWidth={1.5} />
                  </span>
                </button>
              </div>
            </Unveil>

            {images.length > 1 && (
              <FadeUp delay={0.8} className="flex gap-3 mt-5">
                {images.map((imgUrl, idx) => {
                  const active = shown === imgUrl;
                  return (
                    <button
                      key={imgUrl}
                      type="button"
                      onClick={() => setActiveImage(imgUrl)}
                      aria-label={`${data.name} ${idx + 1}`}
                      aria-pressed={active}
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden rounded-[2px] transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-45 hover:opacity-85'}`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-px transition-colors duration-500 ${active ? 'bg-primary-light' : 'bg-transparent'}`} />
                    </button>
                  );
                })}
              </FadeUp>
            )}
          </div>

          {/* ── Wall label ── */}
          <div className="lg:col-span-5 w-full lg:sticky lg:top-32">
            {data.collections && (
              <FadeUp delay={0.3}>
                <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-white/50 mb-4">
                  {data.collections}
                </p>
              </FadeUp>
            )}

            <h1 className="font-serif font-light text-white tracking-[-0.015em] leading-[1.05] text-[2.5rem] sm:text-5xl lg:text-[3.5rem] text-balance">
              <MaskLine delay={0.35}>{data.name}</MaskLine>
            </h1>

            <FadeUp delay={0.55}>
              <p className="mt-3 font-serif italic text-lg text-white/60">Beliz Keskin</p>

              <dl className="mt-10 border-t border-white/10">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-6 py-4 border-b border-white/10">
                    <dt className="text-[11px] tracking-[0.18em] uppercase text-white/50">{s.label}</dt>
                    <dd className="font-serif text-lg text-white text-right lining-nums">{s.value}</dd>
                  </div>
                ))}
              </dl>

              {data.description && (
                <p className="mt-8 text-base text-white/65 font-light leading-relaxed max-w-prose">
                  {data.description}
                </p>
              )}

              {/* Purchase note: payment plans and international buyers */}
              <aside className="mt-8 pl-5 border-l border-primary-light/60">
                <p className="text-[11px] tracking-[0.18em] uppercase text-white/50 mb-2">{t('productDetails', 'paymentNoteTitle')}</p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {planBefore}
                  <a
                    href={purchaseMailto}
                    className="text-white underline decoration-primary-light/70 underline-offset-4 hover:decoration-primary-light transition-colors whitespace-nowrap"
                  >
                    {purchaseEmail}
                  </a>
                  {planAfter}
                </p>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{t('productDetails', 'paymentNoteShipping')}</p>
              </aside>

              <div className="mt-10">
                <ConciergeModal artwork={data} t={t}>
                  <button
                    type="button"
                    className="group relative w-full sm:w-auto sm:min-w-[300px] whitespace-nowrap inline-flex items-center justify-between gap-4 pl-7 pr-5 py-4 rounded-full bg-white text-black overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span aria-hidden="true" className="absolute inset-0 bg-primary origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <span className="relative z-10 text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-500 group-hover:text-white">
                      {t('productDetails', 'inquireButton')}
                    </span>
                    <ArrowRight size={16} className="relative z-10 transition-all duration-500 group-hover:text-white group-hover:translate-x-1" />
                  </button>
                </ConciergeModal>
              </div>
            </FadeUp>
          </div>
        </div>
      </article>

      {/* Full-size viewer */}
      <Dialog.Root open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/95 z-[130]" />
          <Dialog.Content className="fixed inset-0 z-[131] flex items-center justify-center p-4 sm:p-10 outline-none" onClick={() => setIsViewerOpen(false)}>
            <Dialog.Title className="sr-only">{data.name}</Dialog.Title>
            <Dialog.Description className="sr-only">{t('productDetails', 'viewLarge')}</Dialog.Description>
            <motion.img
              src={shown}
              alt={data.name}
              initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
              className="max-w-full max-h-full object-contain"
            />
            <Dialog.Close
              aria-label={t('productDetails', 'close')}
              className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/25 flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 transition-colors"
            >
              <X size={18} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
};

export default Details;
