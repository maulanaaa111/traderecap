import { auth, db } from './firebase.js';
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs, addDoc, deleteDoc, doc } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const title = document.getElementById("title");
const calendar = document.getElementById("calendar");
const summary = document.getElementById("summary");

const modal = document.getElementById("modal");
const modalDate = document.getElementById("modalDate");
const modalPnl = document.getElementById("modalPnl");
const saveBtn = document.getElementById("savePnl");
const deleteBtn = document.getElementById("deletePnl");
const closeBtn = document.getElementById("closeModal");

let current = new Date();
let currentUser = null;
let selectedDate = null;
let selectedDocId = null;

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";
  currentUser = user;
  loadCalendar();
});

async function loadCalendar(){
  const y = current.getFullYear();
  const m = current.getMonth();

  title.innerText = current.toLocaleString("id-ID",{month:"long",year:"numeric"});

  const snap = await getDocs(collection(db,"users",currentUser.uid,"pnl"));
  let daily = {};
  let docs = {};

  snap.forEach(d=>{
    const data = d.data();
    if(data.date.startsWith(`${y}-${String(m+1).padStart(2,'0')}`)){
      daily[data.date] = (daily[data.date]||0) + data.pnl;
      docs[data.date] = d.id;
    }
  });

  renderCalendar(y,m,daily,docs);
}

function renderCalendar(y,m,daily,docs){
  calendar.innerHTML = "";
  const firstDay = new Date(y,m,1).getDay();
  const days = new Date(y,m+1,0).getDate();

  let total = Object.values(daily).reduce((a,b)=>a+b,0);
  summary.innerText = `Total PnL Bulan Ini: ${total>0?"$":""}${total}`;

  for(let i=0;i<firstDay;i++) calendar.innerHTML += `<div></div>`;

  for(let d=1;d<=days;d++){
    const date = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const pnl = daily[date]||0;
    const cls = pnl>0?"green":pnl<0?"red":"gray";

    const div = document.createElement("div");
    div.className = `day ${cls}`;
    div.innerHTML = `<b>${d}</b><br>${pnl>0?"$":""}${pnl<0? "$"}`;

    div.onclick = ()=>{
      selectedDate = date;
      selectedDocId = docs[date] || null;
      modalDate.innerText = date;
      modalPnl.value = pnl || "";
      modal.classList.remove("hidden");
      deleteBtn.style.display = selectedDocId ? "block" : "none";
    };

    calendar.appendChild(div);
  }
}

// SAVE / UPDATE
saveBtn.onclick = async ()=>{
  const val = Number(modalPnl.value);
  if(isNaN(val)) return alert("Isi angka dulu 😅");

  await addDoc(collection(db,"users",currentUser.uid,"pnl"),{
    date: selectedDate,
    pnl: val,
    createdAt: Date.now()
  });

  modal.classList.add("hidden");
  loadCalendar();
};

// DELETE
deleteBtn.onclick = async ()=>{
  if(!selectedDocId) return;
  if(!confirm("Yakin mau hapus PnL tanggal ini?")) return;

  await deleteDoc(doc(db,"users",currentUser.uid,"pnl",selectedDocId));
  modal.classList.add("hidden");
  loadCalendar();
};

closeBtn.onclick = ()=> modal.classList.add("hidden");

// NAV
document.getElementById("prev").onclick = ()=>{
  current.setMonth(current.getMonth()-1);
  loadCalendar();
};
document.getElementById("next").onclick = ()=>{
  current.setMonth(current.getMonth()+1);
  loadCalendar();
};
