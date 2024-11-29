import { initializeApp } from "firebase/app";
import { collection, doc, Firestore, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };

let db: Firestore;
try {
  initializeApp(firebaseConfig);
  db = getFirestore();
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

export async function saveEmail(email: string) {
  try {
      const userRef = doc(collection(db, 'users'), email);
      await setDoc(userRef, { email });
      console.log('Email saved successfully');
    } catch (error) {
      console.error('Error saving email:', error);
    }
  }