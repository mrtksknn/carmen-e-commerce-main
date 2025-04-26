import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import { collection, onSnapshot } from "firebase/firestore";

import Cards from '../components/cards/cards';

const AllProducts = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
          setLoading(false)
        },
        (error) => {
          console.error(error);
        }
      );
    
      return () => {
        unsub();
      }
    }, []);

    const cardGridStyle = {
        display: 'grid',
        gap: '70px',
        maxWidth: '100%',
        justifyContent: 'center',
        gridTemplateColumns: 'repeat(4, 320px)',
        gridTemplateRows: `repeat(${products.length}/3, 420px)` // card.length olarak düzeltildi
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
        <div className="allProducts">
            <div className='page-header'>
                <h4><a href="/">Anasayfa</a></h4>
                <h4 style={{fontSize: '24px'}}>/</h4>
                <h4>Tüm Ürünler</h4>
            </div>

            {!loading ?
              (
                <div style={cardGridStyle}>
                  {products.map((card, index) => (
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
  
export default AllProducts;