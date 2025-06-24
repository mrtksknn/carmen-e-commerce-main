import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import ArtworkCard from '../components/ArtworkCard';
import { collection, onSnapshot } from "firebase/firestore";

const AllProducts = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const [products, setProducts] = useState([]);

  const filteredArtworks = products
    .filter(artwork =>
      artwork.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.collections.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(a.price.replace(/[$,]/g, '')) - parseInt(b.price.replace(/[$,]/g, ''));
        case 'year':
          return b.year.localeCompare(a.year);
        default:
          return a.name.localeCompare(b.name);
      }
    });

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

        setProducts(list);
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
    <div className="allProducts flex flex-col items-center px-4" style={{ marginTop: '65px' }}>

      <div className='max-w-7xl w-full'>
        {/* Header */}
        <div className="text-center pt-1">
          <h1 className="text-4xl font-bold text-white mb-4 mt-12">All Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
            Browse through my complete collection of artworks. Each piece is available
            for purchase and comes with a certificate of authenticity.
          </p>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 my-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchTerm}
              style={{ borderColor: '#93939340' }}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={sortBy}
            style={{ borderColor: '#93939340' }}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-input rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-white">
            Showing {filteredArtworks.length} of {products.length} artworks
          </p>
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No artworks found matching your search.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AllProducts;