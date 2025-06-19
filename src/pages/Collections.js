import React, { useState, useEffect } from 'react';
import '../assets/styles/collections.css';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ArtworkCard from '../components/ArtworkCard';

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredArtworks = selectedCategory === 'All'
    ? products
    : products.filter(artwork => artwork.category === selectedCategory);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        let list = [];
        let categorySet = new Set();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          list.push({ id: doc.id, ...data });

          if (data.category) {
            categorySet.add(data.category);
          }
        });

        // Zaman damgasına göre sıralama
        list.sort((a, b) => {
          return (b.timeStamp?.seconds || 0) - (a.timeStamp?.seconds || 0);
        });

        setProducts(list);

        const categories = ["All", ...Array.from(categorySet)]; // "All" başta
        setCategoryList(categories);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);


  return (
    <div className="collections-container">
      {/* Header */}
      <div className="text-center mb-12 px-4">
        <h1 className="text-4xl font-bold text-white mb-4 mt-12">Art Collections</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
          Explore my artworks organized by themes and styles. Each collection represents
          a unique journey through different artistic expressions.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 px-1">
        {categoryList.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 text-white rounded-full font-medium transition-colors ${selectedCategory === category
              ? 'bg-red-500/50'
              : 'bg-red-500/25 hover:bg-accent/80'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mb-12 px-3">
        {filteredArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
};

export default Collections;