import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from "../hooks/useProduct";
import '../assets/styles/details.css';
import { useLanguage } from '../context/LanguageContext';
import { useInquiry } from '../context/InquiryContext';
import SEO from '../components/SEO';
import { Ruler, Palette, Tag, ArrowLeft, ArrowRight, Loader2, Sparkles, X, Maximize2, Plus, Check } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import ConciergeModal from '../components/landing/ConciergeModal';

const Details = () => {
  const { id, productName } = useParams();
  const { t } = useLanguage();
  const { addToInquiry, removeFromInquiry, isInInquiry } = useInquiry();
  const { product: data, loading: isLoading, error } = useProduct(id);
  const [activeImage, setActiveImage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isLoaded = !isLoading;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync active image when product data loads
  useEffect(() => {
    if (data?.img && !activeImage) {
      setActiveImage(data.img);
    }
  }, [data, activeImage]);



  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  if (!data && isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-24 text-center">
      <SEO title="Not Found" description="The artwork you are looking for does not exist." />
      <div className="bg-surface backdrop-blur-md border border-white/10 rounded-[2rem] p-12 shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl font-serif text-white mb-4">{t('productDetails', 'notFoundTitle') || 'Not Found'}</h1>
        <p className="text-gray-400 mb-8 font-light">{t('productDetails', 'notFoundDesc') || 'This piece may have been removed or placed in a private collection.'}</p>
        <Link to="/products" className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors">
          <ArrowLeft size={16} />
          {t('productDetails', 'backToProducts') || 'Collections'}
        </Link>
      </div>
    </div>
  );

  const productSchema = data ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": data.name,
    "image": data.img,
    "description": data.description || `Buy ${data.name} masterpiece by Carmen.`,
    "brand": { "@type": "Brand", "name": "Carmen Arts" },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "TRY",
      "price": data.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": data.status === true ? "https://schema.org/SoldOut" : "https://schema.org/InStock"
    }
  } : null;

  return (
    <main className="bg-background min-h-screen relative font-sans overflow-hidden py-16">
      <SEO
        title={data?.name || "Artwork Details"}
        description={data?.description || "Discover this unique masterpiece by Carmen."}
        ogImage={data?.img}
        schema={productSchema}
      />

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <article className="max-w-6xl mx-auto px-6 pt-10 lg:pt-10 relative z-10">

        {/* Breadcrumbs */}
        <nav className="mb-4">
          <Link to="/products" className="inline-flex items-center gap-3 text-xs tracking-widest uppercase font-bold text-gray-400 hover:text-white transition-colors duration-300 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t('productDetails', 'backToProducts') || 'Collections'}
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── LEFT: Cinematic Gallery (Bento Layout) ── */}
          <div className="lg:col-span-6 flex flex-col items-center gap-8 w-full">

            {/* Main Display Area */}
            <div className="relative group w-full flex justify-center items-center max-h-[75vh] perspective-1000">
              <div 
                className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)] group-hover:border-primary/30 transition-all duration-700 w-full cursor-pointer"
                style={{ height: "615px" }}
                onClick={() => setIsDialogOpen(true)}
              >
                <img
                  src={activeImage || data?.img}
                  alt={data?.name}
                  className="max-w-full h-auto object-contain mx-auto transition-all duration-700 scale-100 group-hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* ── Thumbnails Row ── */}
            <div className="flex justify-center gap-3 sm:gap-4 py-2 w-full overflow-x-auto scrollbar-hide animate-fade-in delay-300">
              
              {/* Product Image Thumbnails */}
              {[data?.img, data?.img2, data?.img3].filter(Boolean).map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-500 group ${(activeImage || data?.img) === imgUrl
                    ? 'border-primary shadow-[0_0_20px_rgba(168,50,41,0.3)] opacity-100 scale-105'
                    : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
                    }`}
                >
                  <img src={imgUrl} alt={`${data?.name} thumb ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Artwork Information ── */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:sticky lg:top-28 w-full">

            {/* Header / Title Area */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {data.collections && (
                  <span className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/40 text-primary px-3 py-1.5 rounded-lg text-xs font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(168,50,41,0.2)]">
                    <Sparkles className="w-3 h-3" />
                    {data?.collections}
                  </span>
                )}
                {data.status === true && (
                  <span className="inline-flex items-center bg-red-500/20 border border-red-500/40 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold tracking-[0.2em] uppercase">
                    Sold
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight leading-[1.05] drop-shadow-lg">
                {data?.name}
              </h1>

              <div className="w-16 h-[1px] bg-white/20"></div>

              <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-lg">
                {data?.description}
              </p>
            </div>

            {/* Premium Details Panel */}
            <div className="bg-surface backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative group hover:border-primary/20 transition-colors duration-500">
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

              <h2 className="text-gray-400 text-xs uppercase font-bold tracking-[0.3em] mb-5">
                {t('productDetails', 'productDetailsTitle') || 'Masterwork Specs'}
              </h2>

              <dl className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <dt className="flex items-center gap-3 text-gray-400 text-xs uppercase tracking-widest font-bold">
                    <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors duration-500"><Ruler className="w-3 h-3 text-white/80" /></span>
                    {t('productDetails', 'dimensionsLabel') || 'Dimensions'}
                  </dt>
                  <dd className="font-serif text-white text-base sm:text-lg drop-shadow-md text-right">{data?.dimensions}</dd>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <dt className="flex items-center gap-3 text-gray-400 text-xs uppercase tracking-widest font-bold">
                    <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors duration-500"><Palette className="w-3 h-3 text-white/80" /></span>
                    {t('productDetails', 'mediumLabel') || 'Medium'}
                  </dt>
                  <dd className="font-serif text-white text-base sm:text-lg drop-shadow-md text-right max-w-[50%] leading-tight truncate">{data?.material}</dd>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <dt className="flex items-center gap-3 text-primary text-xs uppercase tracking-widest font-bold">
                    <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(168,50,41,0.3)]"><Tag className="w-3 h-3 text-primary" /></span>
                    {t('productDetails', 'priceLabel') || 'Price'}
                  </dt>
                  <dd className="font-sans font-black tracking-tight text-white text-2xl sm:text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {data?.price} <span className="text-primary text-lg font-bold ml-1">TL</span>
                  </dd>
                </div>
              </dl>

              {/* Action Buttons: Concierge Modal & Multi-Inquiry */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <ConciergeModal artwork={data} t={t}>
                  <button
                    className="flex-1 flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-primary hover:border-primary transition-all duration-500 group shadow-lg hover:shadow-[0_15px_30px_rgba(168,50,41,0.4)]"
                  >
                    <span className="uppercase tracking-[0.2em] text-[10px] font-bold pl-2">{t('productDetails', 'inquireButton')}</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-all duration-500">
                      <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                  </button>
                </ConciergeModal>

                <button
                  onClick={() => isInInquiry(data?.id) ? removeFromInquiry(data?.id) : addToInquiry(data)}
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-500 group ${
                    isInInquiry(data?.id) 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-white/5 border-white/10 text-white hover:border-white/30'
                  }`}
                  title={isInInquiry(data?.id) ? 'Listeden Çıkar' : 'Taleplerime Ekle'}
                >
                  {isInInquiry(data?.id) ? <Check size={18} /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
                  <span className="uppercase tracking-[0.2em] text-[10px] font-bold sm:hidden lg:block">
                    {isInInquiry(data?.id) ? (t('productDetails', 'inList') || 'LİSTEDE') : (t('productDetails', 'addToList') || 'LİSTEYE EKLE')}
                  </span>
                </button>
              </div>

            </div>

            <p className="text-xs text-gray-400 tracking-widest font-medium text-center uppercase leading-relaxed px-4">
              {t('productDetails', 'inquireNote')}
            </p>

          </div>
        </div>

      </article>
    </main>
  );
};

export default Details;
