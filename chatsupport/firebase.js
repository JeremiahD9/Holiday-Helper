// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfd1w0iQ_ffdOcWN-4UEokk9iKVzf9XB8",
  authDomain: "holidayhelper-de182.firebaseapp.com",
  projectId: "holidayhelper-de182",
  storageBucket: "holidayhelper-de182.appspot.com",
  messagingSenderId: "509160225069",
  appId: "1:509160225069:web:5d2970e9e4bc36c0587ba4",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };
