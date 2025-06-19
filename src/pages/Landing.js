import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/landing.css';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import ArtworkCard from '../components/ArtworkCard';
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
    <div className="landing-container">

      <section className="landing-img relative h-screen flex items-center justify-center">
        <div className="relative text-center px-4 flex flex-col w-full h-full text-white"
          style={{ backdropFilter: 'blur(5px)', background: '#00000088', alignItems: 'center', justifyContent: 'center' }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in">
            Welcome to My
            <span className="text-primary block">Art Universe</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Discover a collection of original artworks that capture the beauty of nature,
            the complexity of emotions, and the magic of imagination.
          </p>
          <div className="animate-fade-in sm:items-center flex-col md:flex-row space-x-0 md:space-x-4 gap-3 md:gap-0 flex">
            <Link
              to="/collections"
              className="text-black bg-white inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore Collections
            </Link>
            <Link
              to="/about"
              className="inline-block border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              About the Artist
            </Link>
          </div>
        </div>
      </section >

      <section>
        <div className='latest-products'>

          <div className='section-header'>
            <h2>Featured Artworks</h2>
            <p>
              A selection of my latest and most cherished pieces
            </p>
          </div>

          {/* Latest Products */}
          <div className='productsCard-container'>

            <div className='grid-layout'>
              {products &&
                products.map((artwork) => (
                  <ArtworkCard key={artwork.id} artwork={artwork} />
                ))
              }
            </div>

          </div>

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="text-white inline-block bg-red-500/50 text-accent-foreground px-8 py-3 rounded-lg font-semibold hover:bg-red-500/75"
            >
              View All Artworks
            </Link>
          </div>
        </div>
      </section>

      <SubscriptionArea />

      <section className="py-20 bg-accent/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl text-white font-bold text-foreground mb-6">The Artist Behind the Vision</h2>
              <p className="text-lg text-muted-foreground mb-6" style={{ color: '#94a3b8' }}>
                With over a decade of experience in fine arts, I create pieces that bridge the gap
                between traditional techniques and contemporary expression. Each artwork tells a story,
                captures a moment, or expresses an emotion that words cannot convey.
              </p>
              <Link
                to="/about"
                className="inline-block text-white font-semibold hover:underline"
              >
                Learn more about my journey →
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=600&fit=crop"
                alt="Artist at work"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

    </div >
  );
};

export default Landing;
