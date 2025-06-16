import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import '../assets/styles/details.css';

const Details = () => {
  const { id } = useParams();
  const { productName } = useParams();
  const [data, setData] = useState('');

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

        setData(list.find(item => item.id === id))
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsub();
    }
  }, [productName, id]);

  if (!id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Artwork Not Found</h1>
        <p className="text-muted-foreground mb-8">The artwork you're looking for doesn't exist.</p>
        <Link to="/products" className="text-primary hover:underline">
          ← Back to All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12">
      {/* Breadcrumb */}
      <nav className="mb-8 mt-12">
        <Link to="/products" className="text-white hover:underline">
          ← Back to All Products
        </Link>
      </nav>

      {/* Artwork Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <img
            src={data?.img}
            alt={data?.name}
            style={{ minHeight: '450px', maxHeight: '750px' }}
            className="w-full h-auto max-h-3/4 rounded-md shadow-xl"
          />
        </div>

        <div className="space-y-6">
          <div>
            <span className="inline-block bg-red-500/50 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
              {data?.category}
            </span>
            <h1 className="text-4xl font-bold text-white mb-4">{data?.name}</h1>
            <p className="text-lg text-white leading-relaxed" style={{ color: '#94a3b8' }}>
              {data?.description}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">Product Details</h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-white" style={{ color: '#94a3b8' }}>Dimensions:</dt>
                <dd className="text-white font-medium">{data?.height} x {data?.width}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white" style={{ color: '#94a3b8' }}>Medium:</dt>
                <dd className="text-white font-medium">{data?.material}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white" style={{ color: '#94a3b8' }}>Price:</dt>
                <dd className="text-2xl font-bold text-white">{data?.price}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-border pt-6">
            <Link
              to="/contact"
              className="inline-block w-full bg-white text-black text-center px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Inquire About This Piece
            </Link>
            <p className="text-sm text-muted-foreground mt-2 text-center" style={{ color: '#94a3b8' }}>
              Contact me for availability and shipping information
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Details;
