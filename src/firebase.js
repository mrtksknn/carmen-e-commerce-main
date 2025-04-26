import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT3sTZWYrkNY1HP4YzDgnqO3GYDlowDv4",
  authDomain: "carmen-art-store.firebaseapp.com",
  projectId: "carmen-art-store",
  storageBucket: "carmen-art-store.appspot.com",
  messagingSenderId: "651932928340",
  appId: "1:651932928340:web:e884d6f460ddbd2b2320c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);