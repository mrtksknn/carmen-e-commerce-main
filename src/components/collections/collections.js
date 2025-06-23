import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "../../assets/styles/components/collections.css";

const Collections = () => {
  const [groupedProducts, setGroupedProducts] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const productsWithCollections = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.collections !== undefined);

        // Sort by timestamp descending
        productsWithCollections.sort((a, b) => {
          const timeA = a.timeStamp?.seconds || 0;
          const timeB = b.timeStamp?.seconds || 0;
          return timeB - timeA;
        });

        // Group by `collections` field
        const grouped = productsWithCollections.reduce((acc, product) => {
          const key = product.collections;
          if (!acc[key]) acc[key] = [];
          acc[key].push(product);
          return acc;
        }, {});

        setGroupedProducts(grouped);
      },
      (error) => {
        console.error("Firestore snapshot error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <section className="collections-container">
      <h1 className="wine-red">Collections</h1>

      <div className="collections">
        {Object.entries(groupedProducts).map(([collectionName, items]) => (
          <div key={collectionName} className="collection-item">
            <div className="images-grid">
              {items.slice(0, 4).map((item) => (
                <img
                  key={item.id}
                  src={item.img}
                  alt={item.name || "Artwork"}
                  loading="lazy"
                />
              ))}
            </div>
            <p className="collection-title">{collectionName}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Collections;
