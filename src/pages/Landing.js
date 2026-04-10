import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/landing.css';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import SubscriptionArea from '../components/SubscriptionArea';

const Landing = () => {

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

        list.sort((a, b) => {
          return b.timeStamp.seconds - a.timeStamp.seconds;
        });

        const topThreeProducts = list.slice(0, 3);
        setProducts(topThreeProducts);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsub();
    }
  }, []);

  return (
    <div className="landing-container bg-[#030303] text-white font-sans overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="ambient-glow glow-top-right"></div>
      <div className="ambient-glow glow-bottom-left"></div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-20 z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">
          
          {/* Left: Typography & Vision */}
          <div className="flex flex-col justify-center animate-fade-in z-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 font-serif leading-tight tracking-tight">
              Art that
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-primary mt-2">
                Breathes.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-xl font-light leading-relaxed border-l-4 border-primary/50 pl-6">
              Welcome to a universe of original masterworks. 
              Discover aesthetics that define emotions and elevate spaces to galleries.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                to="/collections"
                className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-hover hover:-translate-y-1 transition-all shadow-[0_0_30px_rgba(120,34,34,0.4)]"
              >
                Prowl The Gallery
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:border-primary hover:bg-primary/10 hover:-translate-y-1 transition-all backdrop-blur-md"
              >
                Meet the Artist
              </Link>
            </div>
          </div>

          {/* Right: Floating Artwork */}
          <div className="relative hidden lg:flex justify-center items-center h-full z-10">
            <div className="relative w-[300px] md:w-[350px] lg:w-[400px] aspect-[4/5] animate-float">
               {/* Decorative glow behind artwork */}
              <div className="absolute inset-0 bg-primary/40 blur-[80px] rounded-full scale-90"></div>
              
              {/* Main Artwork Frame */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm p-4 shadow-2xl">
                <div 
                  className="w-full h-full rounded-xl bg-cover bg-center shadow-inner overflow-hidden"
                >
                  <img src={require("../assets/images/newMainBg.jpg")} alt="Featured Art" className="w-full h-full object-cover" />
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-10 bg-black/80 backdrop-blur-md border border-white/10 px-6 py-4 rounded-xl shadow-2xl animate-fade-in" style={{animationDelay: '300ms'}}>
                <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">New Collection</p>
                <p className="text-xl font-serif text-white">Nocturne</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="relative py-16 px-6 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                Curated Exhibition
                <span className="text-primary text-5xl leading-none">.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md font-light">
                An exclusive glimpse into my latest and most treasured creations. 
                Move closer. Feel the strokes.
              </p>
            </div>
            <Link
              to="/products"
              className="mt-6 md:mt-0 text-white border-b border-primary hover:text-primary transition-colors pb-1 flex items-center gap-2"
            >
              Enter the Full Gallery 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {/* Asymmetric Gallery Grid */}
          <div className="featured-gallery grid gap-4 md:gap-6">
            {products && products.map((artwork, index) => (
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
                  <span className="text-primary text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2">{artwork.collections || 'Featured Artwork'}</span>
                  <h3 className="text-xl md:text-2xl font-serif text-white mb-2 group-hover:text-gray-200 transition-colors drop-shadow-lg">{artwork.name}</h3>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    <span className="text-gray-300 text-sm line-clamp-2 md:max-w-[70%] drop-shadow-md">{artwork.description}</span>
                    <span className="text-white font-bold text-lg bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm self-start md:self-end">{artwork.price}₺</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/products"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all"
            >
              View All Artworks
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
                The Mastermind
              </h2>
              <blockquote className="text-3xl md:text-4xl text-white font-serif leading-snug mb-8 relative">
                "I create pieces that bridge the gap between traditional technique and contemporary emotion."
              </blockquote>
              <p className="text-lg text-gray-400 mb-10 font-light leading-relaxed">
                With over a decade of devotion to fine arts, every canvas paints a silent narrative. 
                My calling is to capture moments that language fails, translating raw emotion into tangible beauty.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center justify-center bg-[#111] border border-white/10 text-white px-8 py-4 rounded-full font-medium hover:border-primary hover:bg-primary/10 transition-all"
              >
                Read The Full Story
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

    </div >
  );
};

export default Landing;
