import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

// Css
import '../../assets/styles/components/collections.css';

const Collections = () => {
    const [products, setProducts] = useState([]);
    const [, setLoading] = useState(true);

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
                console.log(products)
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

    return (
        <section className="collections-container">
            <h1 className="wine-red">Koleksiyonlar</h1>
            <div className="collections">
                {Object.entries(products).map(([collectionName, items]) => (
                    <div key={collectionName} className="collection-item">
                        <div className="images-grid">
                            {items.slice(0, 4).map((item) => (
                                <img key={item.id} src={item.img} alt={item.name} />
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
