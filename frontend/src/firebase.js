import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCvYbTkYWXhVRDGzYuJOIHsCyRVdnjGGiA",
  authDomain: "nst-swc.firebaseapp.com",
  databaseURL: "https://nst-swc-default-rtdb.firebaseio.com",
  projectId: "nst-swc",
  storageBucket: "nst-swc.firebasestorage.app",
  messagingSenderId: "809245889801",
  appId: "1:809245889801:web:14a7236d0b741b79d12fd8",
  measurementId: "G-1SPKR3T38T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;