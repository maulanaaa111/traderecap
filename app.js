import { auth, db } from './firebase.js';
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  collection, getDocs, doc, setDoc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const title = document.getElementById("title");
const calendar = document.getElementById("calendar");
const summary = document.getElementById("summary");

const modal = document.getElementById("modal");
const modalDate = document.getElementById("modalDate");
const modalPnl = document.getElementById("modalPnl");
const saveBtn = document.getElementById("savePnl");
const closeBtn = document.getElementById("closeModal");

let current = new Date();
let selectedDate = "";
let currentUser = null;

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

  snap.forEach(docu=>{
    const d = docu.data();
    if(d.date.startsWith(`${y}-${String(m+1).padStart(2,'0')}`)){
      daily[d.date] = d.pnl;
    }
  });

  renderCalendar(y,m,daily);
}

function renderCalendar(y,m,daily){
  calendar.innerHTML = "";
  const firstDay = new Date(y,m,1).getDay();
  const days = new Date(y,m+1,0).getDate();

  let total = Object.values(daily).reduce((a,b)=>a+b,0);
  let fixedTotal = Number(total.toFixed(2));

  summary.innerText = `Total PnL Bulan Ini: ${fixedTotal>0?"+":""}$${fixedTotal}`;

  for(let i=0;i<firstDay;i++) calendar.innerHTML += `<div></div>`;

  for(let d=1;d<=days;d++){
    const date = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const pnl = daily[date] || 0;
    const cls = pnl>0?"green":pnl<0?"red":"gray";

    const div = document.createElement("div");
    div.className = `day ${cls}`;
    div.innerHTML = `<b>${d}</b><br>${pnl>0?"+":""}${pnl}`;
    div.onclick = ()=> openModal(date, pnl);
    calendar.appendChild(div);
  }
}

// ===== MODAL =====
function openModal(date, pnl){
  selectedDate = date;
  modalDate.innerText = date;
  modalPnl.value = pnl !== 0 ? pnl : "";
  modal.classList.remove("hidden");
}

closeBtn.onclick = ()=> modal.classList.add("hidden");

saveBtn.onclick = async ()=>{
  const val = parseFloat(modalPnl.value);
  const ref = doc(db,"users",currentUser.uid,"pnl",selectedDate);

  if(isNaN(val)){
    // Kalau dikosongin → hapus data
    await deleteDoc(ref);
  }else{
    await setDoc(ref,{ date:selectedDate, pnl:val });
  }

  modal.classList.add("hidden");
  loadCalendar();
};

// ===== NAV =====
document.getElementById("prev").onclick = ()=>{
  current.setMonth(current.getMonth()-1);
  loadCalendar();
}
document.getElementById("next").onclick = ()=>{
  current.setMonth(current.getMonth()+1);
  loadCalendar();
}
