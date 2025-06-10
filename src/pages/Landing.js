import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { ClipLoader } from 'react-spinners';
import Steps from '../components/steps/steps';
import '../assets/styles/landing.css';

import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Collections from '../components/collections/collections';

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

            <section>
              <div className='landing-img'>
                <div className='landing-img-text'>
                  <span>
                    A New Story with Every Stroke of the Brush
                  </span>
                  <a href="/products">
                    <button>
                      View All Products
                    </button>
                  </a>
                </div>
              </div>
            </section>

            <section>
              <div className='latest-products'>

                <h1 className='wine-red'>Latest Products</h1>

                {/* Latest Products */}
                <div className='productsCard-container'>

                  {products &&
                    products.map((item) => (

                      <div className='product-card'>

                        {!loading ?
                          (
                            <div className='newest-product' style={{ backgroundImage: `url(${item.img})` }}>
                              <div className="hero-text">
                                <div className='text-container'>
                                  <h1 style={{ fontSize: '36px' }}>{item.name}</h1>
                                  <a href={`/details/${item.name?.toLowerCase()}`}>
                                    <button>Preview</button>
                                  </a>
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
              </div>
            </section>

            <Collections />

            {/* <Steps /> */}

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
