// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-19041.firebaseapp.com",
  projectId: "mern-blog-19041",
  storageBucket: "mern-blog-19041.appspot.com",
  messagingSenderId: "463463806371",
  appId: "1:463463806371:web:a154322244045492891616"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);