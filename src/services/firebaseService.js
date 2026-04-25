import { db } from "../firebase";
import { 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";

/**
 * Generic subscription to a collection
 */
export const subscribeToCollection = (collectionName, callback, errorCallback) => {
  const colRef = collection(db, collectionName);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(`Firebase Connection Success: ${collectionName} items:`, data.length);
      callback(data);
    },
    (error) => {
      console.error(`Error subscribing to ${collectionName}:`, error);
      if (errorCallback) errorCallback(error);
    }
  );
};

/**
 * Products Services
 */
export const subscribeToProducts = (callback, errorCallback) => {
  return subscribeToCollection("products", callback, errorCallback);
};

export const addProduct = async (productData) => {
  return await addDoc(collection(db, "products"), {
    ...productData,
    timeStamp: serverTimestamp(),
  });
};

export const updateProduct = async (id, productData) => {
  const productRef = doc(db, "products", id);
  return await updateDoc(productRef, productData);
};

export const deleteProduct = async (id) => {
  return await deleteDoc(doc(db, "products", id));
};

/**
 * Collections Services
 */
export const subscribeToCollections = (callback, errorCallback) => {
  return subscribeToCollection("collections", callback, errorCallback);
};

export const addCollection = async (collectionData) => {
  return await addDoc(collection(db, "collections"), {
    ...collectionData,
    timeStamp: serverTimestamp(),
  });
};

export const updateCollection = async (id, collectionData) => {
  const collectionRef = doc(db, "collections", id);
  return await updateDoc(collectionRef, collectionData);
};

export const deleteCollection = async (id) => {
  return await deleteDoc(doc(db, "collections", id));
};
