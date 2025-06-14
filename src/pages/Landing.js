import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/landing.css';
import ArtworkCard from '../components/ArtworkCard';
import SubscriptionArea from '../components/SubscriptionArea';

const Landing = () => {
  const artworks = [
    {
      id: '1',
      title: 'Mountain Serenity',
      description: 'A breathtaking landscape capturing the tranquil beauty of mountain peaks at sunset.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      price: '$1,200',
      category: 'Landscapes',
      dimensions: '24" x 36"',
      medium: 'Oil on Canvas',
      year: '2023'
    },
    {
      id: '2',
      title: 'Urban Dreams',
      description: 'An abstract interpretation of city life with vibrant colors and dynamic forms.',
      image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800&h=600&fit=crop',
      price: '$800',
      category: 'Abstract',
      dimensions: '18" x 24"',
      medium: 'Acrylic on Canvas',
      year: '2023'
    },
    {
      id: '3',
      title: 'Ocean Depths',
      description: 'A mesmerizing seascape that captures the power and beauty of ocean waves.',
      image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&h=600&fit=crop',
      price: '$950',
      category: 'Seascapes',
      dimensions: '20" x 30"',
      medium: 'Watercolor',
      year: '2023'
    },
    {
      id: '4',
      title: 'Forest Light',
      description: 'Sunbeams filtering through ancient trees, creating a magical woodland scene.',
      image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&h=600&fit=crop',
      price: '$1,100',
      category: 'Landscapes',
      dimensions: '22" x 28"',
      medium: 'Oil on Canvas',
      year: '2023'
    },
    {
      id: '5',
      title: 'Desert Bloom',
      description: 'A vibrant display of wildflowers blooming in an unexpected desert landscape.',
      image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&h=600&fit=crop',
      price: '$750',
      category: 'Nature',
      dimensions: '16" x 20"',
      medium: 'Acrylic on Canvas',
      year: '2023'
    },
    {
      id: '6',
      title: 'Alpine Majesty',
      description: 'Towering peaks covered in snow, representing the raw power of nature.',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=600&fit=crop',
      price: '$1,400',
      category: 'Landscapes',
      dimensions: '30" x 40"',
      medium: 'Oil on Canvas',
      year: '2023'
    }
  ]
  const featuredArtworks = artworks.slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
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
        <div className="space-x-4 animate-fade-in">
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
              {featuredArtworks &&
                featuredArtworks.map((artwork) => (
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

      {/* <Collections /> */}

    </div >
  );
};

export default Landing;
