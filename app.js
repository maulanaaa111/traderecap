import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const title = document.getElementById("title");
const calendar = document.getElementById("calendar");
const summary = document.getElementById("summary");
const detail = document.getElementById("detail");

let current = new Date();

onAuthStateChanged(auth, async user => {
  if (!user) return location.href = "index.html";
  loadCalendar(user);
});

async function loadCalendar(user){
  const y = current.getFullYear();
  const m = current.getMonth();

  title.innerText = current.toLocaleString("id-ID",{month:"long",year:"numeric"});

  const snap = await getDocs(collection(db,"users",user.uid,"pnl"));
  let daily = {};

  snap.forEach(doc=>{
    const d = doc.data();
    if(d.date.startsWith(`${y}-${String(m+1).padStart(2,'0')}`)){
      daily[d.date] = (daily[d.date]||0) + d.pnl;
    }
  });

  renderCalendar(y,m,daily);
}

function renderCalendar(y,m,daily){
  calendar.innerHTML = "";
  const firstDay = new Date(y,m,1).getDay();
  const days = new Date(y,m+1,0).getDate();

  let total = Object.values(daily).reduce((a,b)=>a+b,0);
  summary.innerText = `Total PnL Bulan Ini: ${total>0?"+":""}${total}`;

  for(let i=0;i<firstDay;i++) calendar.innerHTML += `<div></div>`;

  for(let d=1;d<=days;d++){
    const date = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const pnl = daily[date]||0;
    const cls = pnl>0?"green":pnl<0?"red":"gray";

    const div = document.createElement("div");
    div.className = `day ${cls}`;
    div.innerHTML = `<b>${d}</b><br>${pnl>0?"+":""}${pnl}`;
    calendar.appendChild(div);
  }
}

document.getElementById("prev").onclick = ()=>{
  current.setMonth(current.getMonth()-1);
  loadCalendar(auth.currentUser);
};

document.getElementById("next").onclick = ()=>{
  current.setMonth(current.getMonth()+1);
  loadCalendar(auth.currentUser);
};

