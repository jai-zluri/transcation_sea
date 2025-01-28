import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import * as dotenv from 'dotenv';
dotenv.config;


const firebaseConfig = {
    apiKey: "AIzaSyDAx1zStV4b4q6moGxdwYuX-ea_3G5FTwI",
    authDomain: "transaction-valley.firebaseapp.com",
    projectId: "transaction-valley",
    storageBucket: "transaction-valley.firebasestorage.app",
    messagingSenderId: "921992032275",
    appId: "1:921992032275:web:9396a3799d9b1ba4480fe6",
    measurementId: "G-47HJ63TVCQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);