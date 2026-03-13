import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCoUbFjoRzZBxf5dTnPoKl6AhCN6nQ6cw8",
    authDomain: "pnl-kalender-recap.firebaseapp.com",
    databaseURL: "https://pnl-kalender-recap-default-rtdb.firebaseio.com",
    projectId: "pnl-kalender-recap",
    storageBucket: "pnl-kalender-recap.firebasestorage.app",
    messagingSenderId: "9133249341",
    appId: "1:9133249341:web:a4a214523f986ba23aeb54",
    measurementId: "G-23CG4KD059"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

