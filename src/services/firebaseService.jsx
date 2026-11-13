import { db, auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  collection, 
  onSnapshot, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy,
  getDocs,
  getDoc,
  setDoc
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

export const getProducts = async () => {
  const colRef = collection(db, "products");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getProduct = async (id) => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
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

/**
 * Inquiries Services
 */
export const subscribeToInquiries = (callback, errorCallback) => {
  const colRef = collection(db, "inquiries");
  const q = query(colRef, orderBy("timeStamp", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(data);
    },
    (error) => {
      console.error(`Error subscribing to inquiries:`, error);
      if (errorCallback) errorCallback(error);
    }
  );
};

export const addInquiry = async (inquiryData) => {
  return await addDoc(collection(db, "inquiries"), {
    ...inquiryData,
    status: 'pending',
    timeStamp: serverTimestamp(),
  });
};

export const deleteInquiry = async (id) => {
  return await deleteDoc(doc(db, "inquiries", id));
};

/**
 * Certificate Services
 */
export const generateCertificate = async (certData) => {
  const docRef = await addDoc(collection(db, "certificates"), {
    ...certData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const verifyCertificate = async (certId) => {
  const docRef = doc(db, "certificates", certId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const updateInquiryStatus = async (id, status) => {
  const inquiryRef = doc(db, "inquiries", id);
  return await updateDoc(inquiryRef, { status });
};

/**
 * Site settings (single document: settings/site)
 * notifyEmail: the address new enquiries are emailed to.
 */
const settingsRef = () => doc(db, "settings", "site");

export const getSiteSettings = async () => {
  const snap = await getDoc(settingsRef());
  return snap.exists() ? snap.data() : {};
};

export const subscribeToSiteSettings = (callback, errorCallback) => {
  return onSnapshot(
    settingsRef(),
    (snap) => callback(snap.exists() ? snap.data() : {}),
    (error) => {
      console.error("Error subscribing to settings:", error);
      if (errorCallback) errorCallback(error);
    }
  );
};

export const saveSiteSettings = async (data) => {
  return await setDoc(settingsRef(), { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

/**
 * Auth Services
 */
export const loginAdmin = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = async () => {
  return await signOut(auth);
};

export const subscribeToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};
