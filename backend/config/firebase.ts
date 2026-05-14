import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCpmc6Epw2yiBQLXtgg2sdXVt2LK_83arg",
    authDomain: "afrissol-3c450.firebaseapp.com",
    projectId: "afrissol-3c450",
    storageBucket: "afrissol-3c450.firebasestorage.app",
    messagingSenderId: "1040025922522",
    appId: "1:1040025922522:web:ff61769c67c612a4bb2ee3",
    measurementId: "G-LPZDY4CZ03"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);