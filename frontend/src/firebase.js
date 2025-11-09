import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase web config from Firebase Console
// Go to: Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_WEB_API_KEY", // Get this from Firebase Console
  authDomain: "nst-swc.firebaseapp.com",
  projectId: "nst-swc",
  storageBucket: "nst-swc.appspot.com",
  messagingSenderId: "108242498832887073121",
  appId: "YOUR_FIREBASE_APP_ID" // Get this from Firebase Console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;