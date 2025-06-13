import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBcKBFN0x02Fop1JeIlhEaL-ElvPCac9is",
  authDomain: "aplicativo-getninjas.firebaseapp.com",
  databaseURL: "https://aplicativo-getninjas-default-rtdb.firebaseio.com",
  projectId: "aplicativo-getninjas",
  storageBucket: "aplicativo-getninjas.firebasestorage.app",
  messagingSenderId: "731573591876",
  appId: "1:731573591876:web:a91c6b8f3ea18d2d710111"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;


