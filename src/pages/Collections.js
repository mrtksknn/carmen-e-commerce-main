import React, { useState, useEffect } from 'react';
import '../assets/styles/collections.css';
import { db } from "../firebase";
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import { collection, onSnapshot } from "firebase/firestore";
import Cards from '../components/cards/cards';

const Collections = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "products"),
          (snapshot) => {
            let list = [];
            snapshot.docs.forEach((doc) => {
              const data = doc.data();
              if (data.collections !== undefined) { // collections alanı mevcutsa
                list.push({ id: doc.id, ...data });
              }
            });
      
            // Zaman damgasına göre sıralama
            list.sort((a, b) => {
              return b.timeStamp.seconds - a.timeStamp.seconds;
            });
      
            // collections değerine göre gruplandırma
            const groupedByCollections = list.reduce((acc, item) => {
              const key = item.collections;
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(item);
              return acc;
            }, {});
      
            setProducts(groupedByCollections);
            setLoading(false)
          },
          (error) => {
            console.error(error);
          }
        );
      
        return () => {
          unsub();
        };
    }, []);

    const cardGridStyle = {
        display: 'flex',
        overflowX: 'auto',
        gap: '70px',
        whiteSpace: 'nowrap',
        maxWidth: '1560px',
        paddingBottom: '20px'
    };

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

  return (
    <div className="collections-container">
        <div className='page-header'>
            <h4><a href="/">Anasayfa</a></h4>
            <h4 style={{fontSize: '24px'}}>/</h4>
            <h4>Koleksiyonlar</h4>
        </div>

        {!loading ?
          (
            <div className='collections-list-container'>
              {Object.keys(products).map((collectionKey) => (
                <div className='collection' key={collectionKey}>
                    <h2 style={{ margin: '12px 0', padding: '12px', background: '#00000047', borderRadius: '6px' }}>{collectionKey} Serisi</h2>
                    <div style={cardGridStyle}>
                        {products[collectionKey].map((card, index) => (
                            <Cards
                                key={index}
                                price={card.price}
                                sold={card.status}
                                name={card.name}
                                image={card.img}
                            />
                        ))}
                    </div>
                </div>
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
  
export default Collections;