import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import '../assets/styles/details.css';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { Ruler, Palette, Tag, ArrowLeft, ArrowRight, Loader2, Sparkles } from 'lucide-react';

const Details = () => {
  const { id, productName } = useParams();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: 'block',
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)',
    });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
    setIsZoomed(false);
  };

  useEffect(() => {
    // scroll to top on mount
    window.scrollTo(0, 0);
    const docRef = doc(db, "products", id);
    const unsub = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const foundItem = { id: docSnap.id, ...docSnap.data() };
          setData(foundItem);
          if (foundItem.img) setActiveImage(foundItem.img);
        } else {
          setData(null);
        }
        setIsLoaded(true);
      },
      (error) => {
        console.error("Fetch error:", error);
        setIsLoaded(true);
      }
    );
    return () => unsub();
  }, [id, productName]);

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#a83229] animate-spin" />
    </div>
  );

  if (!data && isLoaded) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 py-24 text-center">
      <SEO title="Not Found" description="The artwork you are looking for does not exist." />
      <div className="bg-[#0a0a0a] backdrop-blur-md border border-white/10 rounded-[2rem] p-12 shadow-2xl max-w-lg w-full">
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
    <main className="bg-[#030303] min-h-screen relative font-sans overflow-hidden py-16">
      <SEO
        title={data?.name || "Artwork Details"}
        description={data?.description || "Discover this unique masterpiece by Carmen."}
        ogImage={data?.img}
        schema={productSchema}
      />

      {/* Ambient Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#a83229]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-[#a83229]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <article className="max-w-6xl mx-auto px-6 pt-10 lg:pt-10 relative z-10">

        {/* Breadcrumbs */}
        <nav className="mb-4">
          <Link to="/products" className="inline-flex items-center gap-3 text-[10px] tracking-widest uppercase font-bold text-white/50 hover:text-white transition-colors duration-300 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t('productDetails', 'backToProducts') || 'Collections'}
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

          {/* ── LEFT: Cinematic Gallery (Bento Layout) ── */}
          <div className="lg:col-span-6 flex flex-col items-center gap-8 w-full">

            {/* Main Image Frame - Dynamic Size Hugging Border */}
            <div className="relative group w-full flex justify-center items-center max-h-[75vh] perspective-1000">
              {/* Tight wrapper that hugs the image */}
              <figure 
                className={`relative inline-flex rounded-[2rem] lg:rounded-[2.5rem] bg-[#030303] border shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 m-0 ${isZoomed ? 'border-[#a83229]/60 cursor-crosshair' : 'border-white/10 group-hover:border-[#a83229]/40'}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                role="region"
                aria-label={`${data?.name} detaylı inceleme alanı`}
                tabIndex={0}
                onFocus={() => setIsZoomed(true)}
                onBlur={() => setIsZoomed(false)}
              >
                {/* Base Image */}
                <img
                  src={activeImage || data?.img}
                  alt={data?.name}
                  fetchpriority="high"
                  loading="eager"
                  className={`max-h-[75vh] max-w-full w-auto object-contain transition-all duration-500 z-0 ${isZoomed ? 'opacity-0 scale-[1.03]' : 'opacity-100 group-hover:scale-[1.03] duration-[15s] ease-out'}`}
                />
                
                {/* Zoom Magniyfing Overlay (Absolute so it doesn't break aspect ratio) */}
                <img
                  aria-hidden="true"
                  src={activeImage || data?.img}
                  alt={`${data?.name} zoomed`}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-transform duration-[50ms]"
                  style={zoomStyle}
                />
                
                {/* Overlays */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#030303]/60 via-transparent to-transparent z-10 pointer-events-none transition-opacity duration-500 ${isZoomed ? 'opacity-0' : 'opacity-50'}`}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#a83229]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay pointer-events-none"></div>
                <figcaption className="sr-only">Resmin üzerine gelerek veya odaklanarak detaylara yakından bakabilirsiniz.</figcaption>
              </figure>
            </div>

            {/* Thumbnails Row */}
            {(data?.img2 || data?.img3) && (
              <div className="flex justify-center gap-4 py-2 w-full overflow-x-auto scrollbar-hide">
                {[data?.img, data?.img2, data?.img3].filter(Boolean).map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 group ${(activeImage || data?.img) === imgUrl
                      ? 'border-[#a83229] shadow-[0_0_25px_rgba(168,50,41,0.4)] opacity-100 scale-105'
                      : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30 hover:scale-100'
                      }`}
                  >
                    <img src={imgUrl} alt={`${data?.name} thumbnail ${idx + 1}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Artwork Information ── */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:sticky lg:top-28 w-full">

            {/* Header / Title Area */}
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {data.collections && (
                  <span className="inline-flex items-center gap-1.5 bg-[#a83229]/20 border border-[#a83229]/40 text-[#a83229] px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(168,50,41,0.2)]">
                    <Sparkles className="w-3 h-3" />
                    {data?.collections}
                  </span>
                )}
                {data.status === true && (
                  <span className="inline-flex items-center bg-red-500/20 border border-red-500/40 text-red-500 px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-[0.2em] uppercase">
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
            <div className="bg-[#0a0a0a] backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative group hover:border-[#a83229]/20 transition-colors duration-500">
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-[#a83229]/40 to-transparent"></div>

              <h3 className="text-white/40 text-[9px] uppercase font-bold tracking-[0.3em] mb-5">
                {t('productDetails', 'productDetailsTitle') || 'Masterwork Specs'}
              </h3>

              <dl className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <dt className="flex items-center gap-3 text-white/50 text-[10px] uppercase tracking-widest font-bold">
                    <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#a83229]/30 transition-colors duration-500"><Ruler className="w-3 h-3 text-white/80" /></span>
                    {t('productDetails', 'dimensionsLabel') || 'Dimensions'}
                  </dt>
                  <dd className="font-serif text-white text-base sm:text-lg drop-shadow-md text-right">{data?.dimensions}</dd>
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <dt className="flex items-center gap-3 text-white/50 text-[10px] uppercase tracking-widest font-bold">
                    <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#a83229]/30 transition-colors duration-500"><Palette className="w-3 h-3 text-white/80" /></span>
                    {t('productDetails', 'mediumLabel') || 'Medium'}
                  </dt>
                  <dd className="font-serif text-white text-base sm:text-lg drop-shadow-md text-right max-w-[50%] leading-tight truncate">{data?.material}</dd>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <dt className="flex items-center gap-3 text-[#a83229] text-[10px] uppercase tracking-widest font-bold">
                    <span className="w-7 h-7 rounded-full bg-[#a83229]/10 flex items-center justify-center border border-[#a83229]/30 shadow-[0_0_15px_rgba(168,50,41,0.3)]"><Tag className="w-3 h-3 text-[#a83229]" /></span>
                    {t('productDetails', 'priceLabel') || 'Price'}
                  </dt>
                  <dd className="font-sans font-black tracking-tight text-white text-2xl sm:text-3xl drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {data?.price} <span className="text-[#a83229] text-lg font-bold ml-1">TL</span>
                  </dd>
                </div>
              </dl>

              {/* Action Button Inside Panel */}
              <Link
                to="/contact"
                state={{ subject: `Inquiry about ${data?.name}` }}
                className="w-full flex items-center justify-between mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[#a83229] hover:border-[#a83229] transition-all duration-500 group shadow-lg hover:shadow-[0_15px_30px_rgba(168,50,41,0.4)]"
              >
                <span className="uppercase tracking-[0.2em] text-[11px] font-bold pl-2">{t('productDetails', 'inquireButton') || 'Acquire Work'}</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#a83229] transition-all duration-500">
                  <ArrowRight size={14} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                </div>
              </Link>

            </div>

            <p className="text-[10px] text-gray-500 tracking-widest font-medium text-center uppercase">
              {t('productDetails', 'inquireNote') || 'Secure global shipping & certification included.'}
            </p>

          </div>
        </div>

      </article>
    </main>
  );
};

export default Details;
