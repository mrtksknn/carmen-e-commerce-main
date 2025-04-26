import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { ClipLoader } from 'react-spinners';
import { collection, onSnapshot } from "firebase/firestore";
import '../assets/styles/prints.css';
import { css } from '@emotion/react';
import Cards from '../components/cards/cards';

const Originals = () => {
  const [card, setCard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.category === 'baskı') {
            list.push({ id: doc.id, ...data });
          }
        });
  
        list.sort((a, b) => {
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

  const cardGridStyle = {
    gridTemplateRows: `repeat(${card.length}/4, 420px)`
  };

  const loadingOverlayStyle = {
    display: loading ? 'flex' : 'none',
    height: '50vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className="prints-container">
      <div className='page-header'>
        <h4><a href="/">Anasayfa</a></h4>
        <h4 style={{fontSize: '24px'}}>/</h4>
        <h4>Baskı</h4>
      </div>

      {!loading ?
        (
          <div className='prints-card-container' style={cardGridStyle}>
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