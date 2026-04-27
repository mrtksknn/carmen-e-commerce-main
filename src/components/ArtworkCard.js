import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ArtworkCard = ({ artwork, showPrice = true }) => {
  return (
    <Link
      to={`/product/${artwork.id}`}
      className="group relative block w-full rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-pointer shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(168,50,41,0.2)] transition-shadow transition-transform duration-700 will-change-[box-shadow,transform] hover:-translate-y-1"
    >
      {/* Image Wrapper */}
      <figure className="relative w-full aspect-[4/5] overflow-hidden m-0">
        <img
          src={artwork.img}
          alt={`Sanat eseri: ${artwork.name}`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[15s] ease-out group-hover:scale-110 will-change-transform"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent z-10 transition-opacity duration-700 opacity-90 group-hover:opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#a83229]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 mix-blend-overlay"></div>

        {/* Floating Top Badges & Price */}
        <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {artwork.status === true && (
              <div className="bg-red-500/80 backdrop-blur-md border border-white/10 text-white text-[0.6rem] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-md shadow-lg">
                Sold
              </div>
            )}
            {(!artwork.status || artwork.status === 'new') && (
              <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[0.6rem] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-md shadow-lg">
                New
              </div>
            )}
          </div>

          {/* Elegant Price Tag */}
          {showPrice && artwork.price && (
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-end shadow-lg transition-transform duration-500 group-hover:-translate-y-1">
              <span className="text-[7px] sm:text-[8px] tracking-widest uppercase text-white/60 mb-0.5">
                Price
              </span>
              <span className="text-xs sm:text-sm font-bold text-white tabular-nums tracking-wide">
                {artwork.price}₺
              </span>
            </div>
          )}
        </div>

        {/* Bottom Info Panel (Bento Style) */}
        <figcaption className="absolute bottom-0 left-0 w-full p-4 sm:p-5 z-20">
          <div className="rounded-[1.25rem] bg-black/40 backdrop-blur-xl border border-white/10 flex flex-row items-center justify-between overflow-hidden relative group-hover:bg-[#a83229]/10 transition-colors duration-700 p-4 sm:p-5 gap-4 shadow-xl">
            
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40"></div>

            <div className="flex-1 min-w-0 z-10">
              <p className="text-[#a83229] text-[9px] font-bold tracking-[0.3em] uppercase mb-1 drop-shadow-md">
                {artwork.collections || "Curated"}
              </p>
              <h2 className="font-serif text-white text-lg sm:text-xl leading-tight font-light truncate drop-shadow-md group-hover:text-gray-100 transition-colors">
                {artwork.name}
              </h2>
            </div>

            {/* Hover Arrow Button */}
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/5 text-white transition-all duration-500 z-10 group-hover:bg-[#a83229] group-hover:border-[#a83229] group-hover:shadow-[0_0_15px_rgba(168,50,41,0.5)] group-hover:scale-110">
              <ArrowRight className="-rotate-45 group-hover:rotate-0 transition-transform duration-500 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>

          </div>
        </figcaption>
        
      </figure>
    </Link>
  );
};

export default ArtworkCard;
