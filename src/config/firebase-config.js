// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLD4DYvUkD_qknKSYBSsl027xaebDu_gg",
  authDomain: "joke-site-6d13e.firebaseapp.com",
  projectId: "joke-site-6d13e",
  storageBucket: "joke-site-6d13e.appspot.com",
  messagingSenderId: "588339998967",
  appId: "1:588339998967:web:cef26510c521d7db9ae3f2",
  measurementId: "G-SHJVNRY5ZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider;