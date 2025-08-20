// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "focus-46561.firebaseapp.com",
  projectId: "focus-46561",
  storageBucket: "focus-46561.appspot.com",
  messagingSenderId: "186252425831",
  appId: "1:186252425831:web:19af0c833502538dc372c2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with multi-tab IndexedDB persistence
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db, auth, provider };
