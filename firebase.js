import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
  apiKey: "AIzaSyADD7hRJUGKdkuIiLZHK96wHSmz0FDMyWI",
  authDomain: "jurnal-data-id.firebaseapp.com",
  projectId: "jurnal-data-id",
  storageBucket: "jurnal-data-id.firebasestorage.app",
  messagingSenderId: "361080177174",
  appId: "1:361080177174:web:939ef43942706bf928ab37",
  measurementId: "G-GWHXQEBN6R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

