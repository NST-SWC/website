import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBu9_example_key",
  authDomain: "nst-swc.firebaseapp.com",
  projectId: "nst-swc",
  storageBucket: "nst-swc.appspot.com",
  messagingSenderId: "108242498832887073121",
  appId: "1:108242498832887073121:web:example"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;