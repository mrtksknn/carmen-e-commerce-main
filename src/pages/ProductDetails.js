import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import '../assets/styles/details.css';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { Ruler, Palette, Tag, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const Details = () => {
  const { id, productName } = useParams();
  const { t } = useLanguage();
  const [data, setData] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        list.sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds);

        const foundItem = list.find(item => item.id === id);
        setData(foundItem);
        if (foundItem) {
          setActiveImage(foundItem.img);
        }
        setIsLoaded(true);
      },
      (error) => {
        console.error(error);
        setIsLoaded(true);
      }
    );

    return () => unsub();
  }, [id, productName]);

  if (!isLoaded) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!data && isLoaded) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <SEO title="Not Found" description="The artwork you are looking for does not exist." />
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-12 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">{t('productDetails', 'notFoundTitle')}</h1>
          <p className="text-gray-400 mb-8">{t('productDetails', 'notFoundDesc')}</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-6 py-3 rounded-full transition-all">
            <ArrowLeft className="w-4 h-4" />
            {t('productDetails', 'backToProducts')}
          </Link>
        </div>
      </div>
    );
  }

  // Schema generation
  const productSchema = data ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": data.name,
    "image": data.img,
    "description": data.description || `Buy ${data.name} masterpiece by Carmen.`,
    "brand": {
      "@type": "Brand",
      "name": "Carmen Arts"
    },
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
    <article className="max-w-7xl mx-auto px-4 pt-24 pb-16 font-sans relative">
      <SEO
        title={data?.name || "Artwork Details"}
        description={data?.description || "Discover this unique masterpiece by Carmen."}
        ogImage={data?.img}
        schema={productSchema}
      />

      {/* Breadcrumb / Nav */}
      <nav className="mb-8 pl-2">
        <Link to="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
          {t('productDetails', 'backToProducts')}
        </Link>
      </nav>

      {/* Artwork Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-6 relative group">
          {/* Main Image */}
          <div className="relative overflow-hidden transition-all duration-500 hover:border-primary/30">
            <div className="absolute inset-0 from-white/5 to-transparent pointer-events-none"></div>
            <div className="w-full h-[50vh] md:h-[60vh] flex items-center justify-center rounded-2xl overflow-hidden relative">
              <img
                src={activeImage || data?.img}
                alt={data?.name}
                fetchpriority="high"
                loading="eager"
                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Thumbnails */}
          {(data?.img2 || data?.img3) && (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
              {[data?.img, data?.img2, data?.img3].filter(Boolean).map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 snap-center ${(activeImage || data?.img) === imgUrl
                    ? 'border-primary shadow-lg shadow-primary/30 scale-100 ring-2 ring-primary/20 ring-offset-2 ring-offset-black'
                    : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30 hover:scale-105'
                    }`}
                >
                  <img src={imgUrl} alt={`${data?.name} thumbnail ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  {(activeImage || data?.img) !== imgUrl && (
                    <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:sticky lg:top-24">

          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {data.collections && (
                <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                  <Sparkles className="w-3 h-3" />
                  {data?.collections}
                </span>
              )}
              {data.status === true && (
                <span className="inline-flex items-center bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                  Sold Out
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-300">
              {data?.name}
            </h1>

            <p className="text-base md:text-lg text-gray-400 leading-relaxed font-light">
              {data?.description}
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl w-full hover:border-white/20 transition-colors duration-500">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              {t('productDetails', 'productDetailsTitle')}
            </h3>

            <dl className="space-y-3">
              <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <dt className="text-gray-400 flex items-center gap-3 text-sm">
                  <Ruler className="w-4 h-4 text-primary/70" />
                  {t('productDetails', 'dimensionsLabel')}
                </dt>
                <dd className="text-white font-medium text-sm sm:text-base">{data?.dimensions}</dd>
              </div>

              <div className="flex justify-between items-center py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <dt className="text-gray-400 flex items-center gap-3 text-sm">
                  <Palette className="w-4 h-4 text-primary/70" />
                  {t('productDetails', 'mediumLabel')}
                </dt>
                <dd className="text-white font-medium text-sm sm:text-base">{data?.material}</dd>
              </div>

              <div className="flex justify-between items-center py-4 px-4 rounded-xl bg-primary/5 border border-primary/20 mt-5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <dt className="text-gray-300 flex items-center gap-3 font-medium text-sm sm:text-base relative z-10">
                  <Tag className="w-5 h-5 text-primary" />
                  {t('productDetails', 'priceLabel')}
                </dt>
                <dd className="text-2xl sm:text-3xl font-bold text-white relative z-10">
                  {data?.price} <span className="text-primary text-lg sm:text-xl font-medium">TL</span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Action Area */}
          <div className="pt-2">
            <Link
              to="/contact"
              state={{ subject: `Inquiry about ${data?.name}` }}
              className="relative flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white px-8 py-5 rounded-2xl font-semibold text-lg overflow-hidden group shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
              <span className="relative z-10">{t('productDetails', 'inquireButton')}</span>
            </Link>
            <p className="text-sm text-gray-500 mt-4 text-center font-medium">
              {t('productDetails', 'inquireNote')}
            </p>
          </div>

        </div>
      </div>

    </article>
  );
};

export default Details;
