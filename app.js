import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const dateInput = document.getElementById("dateInput");
const pnlInput = document.getElementById("pnlInput");
const pnlList = document.getElementById("pnlList");

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";

  saveBtn.onclick = async () => {
    await addDoc(collection(db, "users", user.uid, "pnl"), {
      date: dateInput.value,
      pnl: Number(pnlInput.value)
    });
    loadData(user);
  };

  logoutBtn.onclick = () => signOut(auth);

  loadData(user);
});

async function loadData(user) {
  pnlList.innerHTML = "";
  const snap = await getDocs(collection(db, "users", user.uid, "pnl"));
  snap.forEach(doc => {
    const d = doc.data();
    pnlList.innerHTML += `<li>${d.date} → ${d.pnl}</li>`;
  });
}

