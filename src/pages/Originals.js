import React, { useState, useEffect } from 'react';
import '../assets/styles/originals.css';
import Cards from '../components/cards/cards';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';

import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Originals = () => {
  const [card, setCard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.category === 'koleksiyon' || data.category === 'orijinal') {
            list.push({ id: doc.id, ...data });
          }
        });
  
        list.sort((a, b) => {
          // Önce kategoriye göre sıralayın, 'orijinal' olanlar başa gelsin
          if (a.category === 'orijinal' && b.category !== 'orijinal') {
            return -1;
          }
          if (a.category !== 'orijinal' && b.category === 'orijinal') {
            return 1;
          }
          // Kategorileri aynıysa tarihe göre sıralayın
          return b.timeStamp.seconds - a.timeStamp.seconds;
        });
  
        setCard(list);
        setLoading(false);
      },
      (error) => {
        console.error(error);
      }
    );
  
    return () => {
      unsub();
    }
  }, []);

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  const loadingOverlayStyle = {
    display: loading ? 'flex' : 'none',
    height: '50vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const cardGridStyle = {
    gridTemplateRows: `repeat(${card.length}/4, 420px)`
  };

  return (
    <div className="originals-container">
      <div className='page-header'>
        <h4><a href="/">Anasayfa</a></h4>
        <h4 style={{fontSize: '24px'}}>/</h4>
        <h4>Orijinal</h4>
      </div>

      {!loading ?
        (
          <div className='originals-card-container' style={cardGridStyle}>
            {card.map((card, index) => (
              <Cards
                key={index}
                price={card.price}
                sold={card.status}
                name={card.name}
                image={card.img}
              />
            ))}
          </div>
        ) :
        (
          <div style={loadingOverlayStyle}>
            <ClipLoader color="#dd5331" loading={loading} css={override} size={150} />
          </div>
        )
      }

      
    </div>
  );
};
  
export default Originals;
