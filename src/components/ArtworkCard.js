import React from 'react';
import { Link } from 'react-router-dom';

const ArtworkCard = ({ artwork, showPrice = true }) => {
  return (
    <Link
      to={`/product/${artwork.id}`}
      className="group relative block w-full rounded-[1.25rem] overflow-hidden bg-[#0d0d0d] border border-white/5 cursor-pointer transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#782222]/35"
      style={{ 
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
      }}
    >
      {/* Outer hover shadow injector via pseudo-element simulation */}
      <div className="absolute inset-0 pointer-events-none group-hover:shadow-[0_24px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(120,34,34,0.15)] transition-shadow duration-500 rounded-[1.25rem] z-30"></div>

      {/* Image Wrapper (Semantic Article body) */}
      <article className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#111]">
        <img
          src={artwork.img}
          alt={artwork.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent z-10 transition-opacity duration-400"></div>
        
        {/* Red Tint on Hover */}
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" 
          style={{ background: 'radial-gradient(circle at 50% 80%, rgba(120, 34, 34, 0.22) 0%, transparent 70%)' }}></div>

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {artwork.status === true && (
            <div className="bg-red-500/80 backdrop-blur-md border border-white/10 text-white text-[0.65rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full shadow-lg">
              Sold
            </div>
          )}
          {(!artwork.status || artwork.status === 'new') && (
            <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[0.65rem] font-bold tracking-[0.1em] uppercase px-3 py-1 rounded-full shadow-lg">
              New
            </div>
          )}
        </div>

        {/* Content panel */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex flex-col justify-end pointer-events-none">
          {/* Collection / Subtitle */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#c0392b]"></div>
            <span className="text-[0.6rem] font-extrabold tracking-[0.3em] uppercase text-[#c0392b]">
              {artwork.collections ? artwork.collections : "Vault"}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl md:text-2xl font-serif text-white leading-tight drop-shadow-lg mb-1 group-hover:text-gray-200 transition-colors">
            {artwork.name}
          </h3>
          
          {/* Description Snippet */}
          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed line-clamp-2 max-w-[85%] opacity-0 transform translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[400ms] ease-out">
            {artwork.description}
          </p>

          {/* Price */}
          {showPrice && (
            <div className="mt-4 flex items-center relative z-30 pointer-events-auto">
              <span className="inline-flex items-center bg-[#782222]/85 backdrop-blur-[8px] border border-white/10 px-3 py-1.5 rounded-md text-sm font-bold text-white tracking-wide transition-colors duration-300 group-hover:bg-[#c0392b]/95 shadow-md">
                {artwork.price} ₺
              </span>
            </div>
          )}
        </div>

        {/* Hover Arrow Button */}
        <div className="absolute bottom-5 right-5 z-[25] w-10 h-10 rounded-full flex items-center justify-center opacity-0 -translate-x-3 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-x-0"
          style={{
            background: 'linear-gradient(135deg, #782222, #c0392b)',
            boxShadow: '0 0 20px rgba(120, 34, 34, 0.4)'
          }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </Link>
  );
};

export default ArtworkCard;
