import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import '../assets/styles/details.css';
import { useLanguage } from '../context/LanguageContext';

const Details = () => {
  const { id } = useParams();
  const { productName } = useParams();
  const { t } = useLanguage();
  const [data, setData] = useState('');
  const [activeImage, setActiveImage] = useState('');

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

        const foundItem = list.find(item => item.id === id);
        setData(foundItem);
        if (foundItem) {
          setActiveImage(foundItem.img);
        }
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
        <h1 className="text-4xl font-bold text-foreground mb-4">{t('productDetails', 'notFoundTitle')}</h1>
        <p className="text-muted-foreground mb-8">{t('productDetails', 'notFoundDesc')}</p>
        <Link to="/products" className="text-primary hover:underline">
          {t('productDetails', 'backToProducts')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12">
      {/* Breadcrumb */}
      <nav className="mb-4 mt-12">
        <Link to="/products" className="text-white hover:underline">
          {t('productDetails', 'backToProducts')}
        </Link>
      </nav>

      {/* Artwork Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#0a0a0a] border border-primary/20 rounded-xl p-4 shadow-2xl shadow-black/50 flex flex-col gap-4 relative">
          <div className="w-full h-[40vh] md:h-[50vh] lg:h-[55vh] flex items-center justify-center rounded-lg bg-black/20">
            <img
              src={activeImage || data?.img}
              alt={data?.name}
              className="w-full h-full object-contain transition-opacity duration-300"
            />
          </div>

          {(data?.img2 || data?.img3) && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {[data?.img, data?.img2, data?.img3].filter(Boolean).map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-24 h-24 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${(activeImage || data?.img) === imgUrl
                    ? 'border-primary shadow-lg shadow-primary/20 scale-100'
                    : 'border-transparent opacity-60 hover:opacity-100 hover:border-primary/50'
                    }`}
                >
                  <img src={imgUrl} alt={`${data?.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div>
            {data.collections && (
              <span className="inline-block bg-primary/20 border border-primary/30 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                {data?.collections}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif">{data?.name}</h1>
            <p className="text-lg text-gray-400 leading-relaxed font-sans">
              {data?.description}
            </p>
          </div>

          <div className="border-t border-primary/20 pt-6">
            <h3 className="text-xl font-semibold text-white mb-4">{t('productDetails', 'productDetailsTitle')}</h3>
            <dl className="space-y-3">
              <div className="flex justify-between items-center bg-[#0a0a0a] py-2 px-4 rounded-lg border border-primary/10">
                <dt className="text-gray-400">{t('productDetails', 'dimensionsLabel')}</dt>
                <dd className="text-white font-medium">{data?.dimensions}</dd>
              </div>
              <div className="flex justify-between items-center bg-[#0a0a0a] py-2 px-4 rounded-lg border border-primary/10">
                <dt className="text-gray-400">{t('productDetails', 'mediumLabel')}</dt>
                <dd className="text-white font-medium">{data?.material}</dd>
              </div>
              <div className="flex justify-between items-center bg-[#0a0a0a] py-3 px-4 rounded-lg border border-primary/30 mt-4">
                <dt className="text-gray-400 text-lg">{t('productDetails', 'priceLabel')}</dt>
                <dd className="text-2xl font-bold text-primary">{data?.price} TL</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-primary/20 pt-6">
            <Link
              to="/contact"
              state={{ subject: `Inquiry about ${data?.name}` }}
              className="inline-block w-full bg-primary text-white text-center px-8 py-4 rounded-lg font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 hover:-translate-y-1"
            >
              {t('productDetails', 'inquireButton')}
            </Link>
            <p className="text-sm text-gray-500 mt-3 text-center">
              {t('productDetails', 'inquireNote')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Details;
