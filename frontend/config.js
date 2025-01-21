// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAx1zStV4b4q6moGxdwYuX-ea_3G5FTwI",
  authDomain: "transaction-valley.firebaseapp.com",
  projectId: "transaction-valley",
  storageBucket: "transaction-valley.firebasestorage.app",
  messagingSenderId: "921992032275",
  appId: "1:921992032275:web:9396a3799d9b1ba4480fe6",
  measurementId: "G-47HJ63TVCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);