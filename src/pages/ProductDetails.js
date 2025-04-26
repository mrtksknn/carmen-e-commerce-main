import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import '../assets/styles/details.css';

const Details = () => {
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

        setData(list.find(item => item.name?.toLowerCase() === productName.toLowerCase()))
      },
      (error) => {
        console.error(error);
      }
    );
  
    return () => {
      unsub();
    }
  }, [productName]);

  const { price, img, productType, status, height, width, material, description, collections } = data;

  const productTypeName = productType === 'print' ? '(Poster Baskı)' : productType === 'original' ? '' : '(Orijinal)';

  const cardStyle = {
    backgroundImage: `url(${img})`,
    backgroundSize: 'contain',
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div className='details-container'>
      <div className='page-header'>
        <h4><a href="/">Anasayfa</a></h4>
        <h4 style={{ fontSize: '24px' }}>/</h4>
        <h4>{productName}</h4>
      </div>

      <div className='card-container'>

        <div className='card-mins'>
          <div style={cardStyle}></div>
          <div style={cardStyle}></div>
          <div style={cardStyle}></div>
        </div>

        <div style={cardStyle} className='details-card'>
        </div>
        
        <div className='details'>
          <h2>{productName} {productTypeName} </h2>
          {productType === 'original' ? '' : <p style={{fontSize: '24px'}}>{`${price} TL`}</p>}
          <div>
            <p>Koleksiyonu: {collections} Serisi </p>
            <p>Boyut: {width}cm x {height}cm</p>
            <p>Material: {material}</p>
            <p>Detay: {description}</p>
          </div>

          <hr />
          <button>
            {status ? 'Satıldı' : 'Satın Al'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Details;
