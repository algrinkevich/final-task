import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4C8_w9WHGyoLYQfEhGrLQcmYy_-DOVV8",
  authDomain: "final-project-db-d1d14.firebaseapp.com",
  projectId: "final-project-db-d1d14",
  storageBucket: "final-project-db-d1d14.appspot.com",
  messagingSenderId: "738695712281",
  appId: "1:738695712281:web:400b405b039fac54192488",
};

initializeApp(firebaseConfig);

export const auth = getAuth();

export const db = getFirestore();

export const createAuthUserWithEmailAndPasswordAsync = async (
  email: string,
  password: string
) => {
  if (!email || !password) {
    return;
  }

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPasswordAsync = async (
  email: string,
  password: string
) => {
  if (!email || !password) {
    return;
  }

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUserAsync = async () => await signOut(auth);

export const onAuthStateChangedListener = (
  callback: (user: User | null) => void
) => onAuthStateChanged(auth, callback);
