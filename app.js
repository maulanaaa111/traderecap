import { auth, db } from './firebase.js';
import { onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
  collection, getDocs, setDoc, doc, deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const title = document.getElementById("title");
const calendar = document.getElementById("calendar");
const summary = document.getElementById("summary");

// Modal
const modal = document.getElementById("modal");
const modalDate = document.getElementById("modalDate");
const modalPnl = document.getElementById("modalPnl");
const savePnl = document.getElementById("savePnl");
const closeModal = document.getElementById("closeModal");

let current = new Date();
let currentUser = null;
let selectedDate = null;

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

  snap.forEach(d=>{
    const data = d.data();
    if(data.date.startsWith(`${y}-${String(m+1).padStart(2,'0')}`)){
      daily[data.date] = data.pnl;
    }
  });

  renderCalendar(y,m,daily);
}

function renderCalendar(y,m,daily){
  calendar.innerHTML = "";
  const firstDay = new Date(y,m,1).getDay();
  const days = new Date(y,m+1,0).getDate();

  let total = Object.values(daily).reduce((a,b)=>a+b,0);
  summary.innerText = `Total PnL Bulan Ini: ${total>0?"+":""}${total.toFixed(2)}`;

  for(let i=0;i<firstDay;i++) calendar.innerHTML += `<div></div>`;

  for(let d=1;d<=days;d++){
    const date = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const pnl = daily[date]||0;
    const cls = pnl>0?"green":pnl<0?"red":"gray";

    const div = document.createElement("div");
    div.className = `day ${cls}`;
    div.innerHTML = `<b>${d}</b><br>${pnl>0?"+":""}${pnl}`;

    // 👉 Klik = Input PnL
    div.addEventListener("click",()=>{
      selectedDate = date;
      modalDate.innerText = date;
      modalPnl.value = pnl || "";
      modal.classList.remove("hidden");
    });

    // 👉 Klik kanan = Hapus
    div.addEventListener("contextmenu",e=>{
      e.preventDefault();
      if(confirm(`Hapus PnL tanggal ${date}?`)){
        deletePnl(date);
      }
    });

    calendar.appendChild(div);
  }
}

// SAVE
savePnl.onclick = async ()=>{
  const val = Number(modalPnl.value);
  if(isNaN(val)) return alert("PnL harus angka!");

  await setDoc(doc(db,"users",currentUser.uid,"pnl",selectedDate),{
    date: selectedDate,
    pnl: val
  });

  modal.classList.add("hidden");
  loadCalendar();
};

// CLOSE MODAL
closeModal.onclick = ()=> modal.classList.add("hidden");

// DELETE
async function deletePnl(date){
  await deleteDoc(doc(db,"users",currentUser.uid,"pnl",date));
  loadCalendar();
}

// NAV
document.getElementById("prev").onclick = ()=>{
  current.setMonth(current.getMonth()-1);
  loadCalendar();
}
document.getElementById("next").onclick = ()=>{
  current.setMonth(current.getMonth()+1);
  loadCalendar();
}
