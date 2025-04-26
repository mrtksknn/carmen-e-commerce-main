import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import Steps from '../components/steps/steps';
import '../assets/styles/landing.css';

import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Landing = () => {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // timeStamp

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

        const topFourProducts = list.slice(0, 4);

        setProducts(topFourProducts);
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
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div className="landing-container">

      {!loading ?
        (
          <div>
            
            <div className='landing-img'>
              <div className='landing-img-text'>
                <span>
                  A New Story with Every Stroke of the Brush
                </span>
                <button>
                  View All Products
                </button>
              </div>
            </div>

            <div className='latest-products' style={{ display: "flex", flexDirection: "column", textAlign: "center", gap: "24px" }}>
              {/* Latest Products */}
              <div className='productsCard-container' style={{ display: "flex", gap: "24px", marginTop: "24px" }}>

                {products &&
                  products.map((item) => (

                    <div className='product-card'>

                      {!loading ?
                        (
                          <div className='newest-product' style={{ backgroundImage: `url(${item.img})` }}>
                            <div className="hero-text">
                              <div className='text-container'>
                                <h1 style={{ fontSize: '36px' }}>{item.name} out now</h1>
                                <button>preview</button>
                              </div>
                            </div>
                          </div>
                        ) :
                        (
                          <div style={loadingOverlayStyle}>
                            <ClipLoader color="#dd5331" loading={loading} css={override} size={150} />
                          </div>
                        )

                      }


                    </div>
                  ))
                }
              </div>

              <a href="/tum-urunler">Tümünü Gör...</a>
            </div>


            {/* Steps to Start */}
            <div>
              <Steps />
            </div>
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

export default Landing;
