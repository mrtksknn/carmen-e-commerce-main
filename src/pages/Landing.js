import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
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
                  <div className='landing-img-content'>
                    <h1>
                      Welcome to My
                      Art Universe
                    </h1>
                    <p>
                      Discover a collection of original artworks that capture the beauty of nature, the complexity of emotions, and the magic of imagination.
                    </p>

                    <div className='link-container'>
                      <Link
                        to="/collections"
                        className="link active-link"
                      >
                        Explore Collections
                      </Link>
                      <Link
                        to="/about"
                        className="link"
                      >
                        About the Artist
                      </Link>
                    </div>
                  </div>
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
