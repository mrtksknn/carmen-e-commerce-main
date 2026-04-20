import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/landing.css';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import SubscriptionArea from '../components/SubscriptionArea';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });

        // Zaman damgasına göre sırala (En yeni en üstte)
        list.sort((a, b) => {
          return (b.timeStamp?.seconds || 0) - (a.timeStamp?.seconds || 0);
        });

        // 1 Ana Hero eseri + 3 Sergi Eseri = Toplam 4 eser çekiyoruz
        const latestMasterworks = list.slice(0, 4);
        setProducts(latestMasterworks);
      },
      (error) => {
        console.error("Firebase fetch error: ", error);
      }
    );

    return () => {
      unsub();
    }
  }, []);

  const heroPiece = products.length > 0 ? products[0] : null;
  const galleryPieces = products.length > 1 ? products.slice(1, 4) : [];

  return (
    <div className="landing-container bg-[#030303] text-white font-sans overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] pt-20 pb-12 z-10 overflow-hidden flex items-center justify-center">
        
        {/* 1280px Max-Width Wrapper */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-8">
          
          {/* Left: Typography & Vision */}
          <div className="w-full lg:w-[50%] lg:pr-10 flex flex-col justify-center animate-fade-in z-30 mb-16 lg:mb-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-[1px] bg-primary"></div>
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs opacity-90">{t('landing', 'exhibitionBadge')}</span>
            </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black mb-8 font-serif leading-[0.9] tracking-tighter">
            {t('landing', 'heroTitle')}<br/>
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-[#333]">{t('landing', 'heroTitleItalic')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-lg font-light leading-relaxed">
            {t('landing', 'heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              to="/collections"
              className="group inline-flex items-center justify-center bg-white text-black px-10 py-4 np-500 rounded-full font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(120,34,34,0.6)]"
            >
              {t('landing', 'heroCtaPrimary')}
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center bg-transparent border-b border-white/30 text-white px-2 py-4 font-semibold hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-sm"
            >
              {t('landing', 'heroCtaSecondary')}
            </Link>
          </div>
          </div>

          {/* Right: Dynamic Masterpiece Frame */}
          <div className="w-full lg:w-[50%] h-[60vh] lg:h-[80vh] relative z-10 flex items-center justify-center lg:justify-end">
            {heroPiece ? (
              <Link to={`/product/${heroPiece.id}`} className="relative w-full md:w-[80%] lg:w-full h-full rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer border border-white/10 ring-1 ring-white/5">
              
              {/* Image */}
              <img 
                src={heroPiece.img} 
                alt={heroPiece.name} 
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[20s] group-hover:scale-110" 
              />
              
              {/* High-end Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-black/20 to-transparent z-10 opacity-90 transition-opacity duration-700 group-hover:opacity-60"></div>
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Informational Lower Third */}
              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <p className="text-xs text-primary uppercase tracking-[0.3em] font-bold">{heroPiece.collections || t('landing', 'latestDrop')}</p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-lg leading-tight">{heroPiece.name}</h2>
                  </div>
                  
                  {/* Subtle View Button */}
                  <div className="hidden md:flex w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:bg-primary group-hover:border-primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </div>
              
            </Link>
          ) : (
            <div className="w-full md:w-[80%] lg:w-full max-w-[600px] h-full bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center animate-pulse">
               <span className="text-gray-600 font-serif tracking-widest uppercase">{t('landing', 'curatingVault')}</span>
            </div>
            )}
          </div>
          
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="relative py-16 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {t('landing', 'featuredTitle')}
                <span className="text-primary text-5xl leading-none">.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md font-light">
                {t('landing', 'featuredSubtitle')}
              </p>
            </div>
            <Link
              to="/products"
              className="mt-6 md:mt-0 text-white border-b border-primary hover:text-primary transition-colors pb-1 flex items-center gap-2 font-medium"
            >
              {t('landing', 'viewFullGallery')}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Asymmetric Gallery Grid */}
          <div className="featured-gallery grid gap-4 md:gap-6">
            {galleryPieces.length > 0 ? galleryPieces.map((artwork, index) => (
              <Link 
                to={`/product/${artwork.id}`}
                key={artwork.id} 
                className={`gallery-item-${index} group relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-primary/20 bg-[#111] flex flex-col justify-end ${index === 0 ? 'min-h-[350px] md:min-h-[450px]' : 'min-h-[250px]'}`}
              >
                <img src={artwork.img} alt={artwork.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 z-10 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-color z-10"></div>
                
                {/* Content */}
                <div className="relative z-20 p-6 flex flex-col justify-end transform md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-primary text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2">{artwork.collections || t('landing', 'featuredSelection')}</span>
                  <h3 className="text-xl md:text-2xl font-serif text-white mb-2 group-hover:text-gray-200 transition-colors drop-shadow-lg">{artwork.name}</h3>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="text-gray-300 text-sm line-clamp-2 md:max-w-[70%] drop-shadow-md">{artwork.description}</span>
                    <span className="text-white font-bold text-lg bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm self-start md:self-end">{artwork.price}₺</span>
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-1 min-h-[300px] flex items-center justify-center text-gray-500 border border-white/10 rounded-2xl bg-white/5">
                {t('landing', 'loadingExhibitions')}
              </div>
            )}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
            >
              {t('landing', 'viewAllArtworks')}
            </Link>
          </div>
        </div>
      </section>

      <SubscriptionArea />

      {/* Artist Section */}
      <section className="py-16 relative overflow-hidden z-20">
        {/* Subtle separator */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-6">
                {t('landing', 'artistSectionLabel')}
              </h2>
              <blockquote className="text-3xl md:text-4xl text-white font-serif leading-snug mb-8 relative">
                {t('landing', 'artistQuote')}
              </blockquote>
              <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed">
                {t('landing', 'artistBio')}
              </p>
              <Link
                to="/about"
                className="inline-flex items-center justify-center bg-[#111] border border-white/10 text-white px-8 py-4 rounded-full font-medium hover:border-primary hover:bg-primary/10 transition-all"
              >
                {t('landing', 'artistCta')}
              </Link>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 artist-image-container relative rounded-2xl overflow-hidden cursor-pointer group">
              {/* Inner frame styling */}
              <div className="absolute inset-4 border border-white/10 rounded-xl z-20 pointer-events-none transition-all duration-700 group-hover:border-primary/40 group-hover:inset-2"></div>
              
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=800&fit=crop"
                alt="Artist at work"
                className="w-full h-full object-cover aspect-[4/3] rounded-2xl"
              />
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;
