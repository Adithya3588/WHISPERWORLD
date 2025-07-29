import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD9YrxAc0SQgvv8V1_QAYfpxRI3Lb325C8",
  authDomain: "whisperwall-fc19c.firebaseapp.com",
  projectId: "whisperwall-fc19c",
  storageBucket: "whisperwall-fc19c.firebasestorage.app",
  messagingSenderId: "312386864977",
  appId: "1:312386864977:web:3776156fc2a65224e3b570",
  measurementId: "G-Z994XWK0EK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);