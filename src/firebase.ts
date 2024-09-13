// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "focus-46561.firebaseapp.com",
  projectId: "focus-46561",
  storageBucket: "focus-46561.appspot.com",
  messagingSenderId: "186252425831",
  appId: "1:186252425831:web:19af0c833502538dc372c2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
