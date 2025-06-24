import React from 'react';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';

const ArtworkCard = ({ artwork, showPrice = true }) => {
  return (
    <Link
      to={`/product/${artwork.id}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={artwork.img}
          alt={artwork.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {artwork.status === true && (
          <Badge variant="destructive" className="absolute top-2 left-2 z-10">
            Sold
          </Badge>
        )}
        {(!artwork.status || artwork.status === 'new') && (
          <Badge variant="secondary" className="absolute top-2 left-2 z-10">
            New
          </Badge>
        )}
      </div>
      <div className="p-4 text-white flex flex-col text-left">
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {artwork.name}
        </h3>

        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
          {artwork.description}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground bg-red-500/50 px-2 py-1 rounded">
            {artwork.collections ? <span>{artwork.collections}</span> : <span>No collection</span>}
          </span>
          {showPrice && (
            <span className="font-bold text-primary flex items-center">
              <span className='text-md'>{artwork.price}</span>
              <span className='text-lg'>₺</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ArtworkCard;
