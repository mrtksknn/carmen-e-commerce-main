import { useState, useEffect } from "react";
import { subscribeToCollections } from "../services/firebaseService";

export const useCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToCollections(
      (data) => {
        setCollections(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { collections, loading, error };
};
