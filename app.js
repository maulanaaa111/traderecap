const calendarEl = document.getElementById("calendar");
const titleEl = document.getElementById("title");
const summaryEl = document.getElementById("summary");

const modal = document.getElementById("modal");
const modalDate = document.getElementById("modalDate");
const modalPnl = document.getElementById("modalPnl");
const saveBtn = document.getElementById("savePnl");
const closeBtn = document.getElementById("closeModal");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let current = new Date();
let selectedDate = "";

let data = JSON.parse(localStorage.getItem("pnlCalendar")) || {};

function saveData() {
  localStorage.setItem("pnlCalendar", JSON.stringify(data));
}

function renderCalendar() {
  calendarEl.innerHTML = "";
  const year = current.getFullYear();
  const month = current.getMonth();

  titleEl.textContent = current.toLocaleString("id-ID", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let total = 0;
  let win = 0;
  let loss = 0;

  // Offset kosong
  for (let i = 0; i < firstDay; i++) {
    const div = document.createElement("div");
    calendarEl.appendChild(div);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${month + 1}-${day}`;
    const pnl = data[dateKey] || 0;

    const div = document.createElement("div");
    div.className = "day";

    if (pnl > 0) {
      div.classList.add("green");
      win++;
    } else if (pnl < 0) {
      div.classList.add("red");
      loss++;
    } else {
      div.classList.add("gray");
    }

    total += pnl;

    div.innerHTML = `<b>${day}</b>${pnl !== 0 ? pnl : ""}`;

    div.onclick = () => {
      selectedDate = dateKey;
      modalDate.textContent = `📅 ${day} ${titleEl.textContent}`;
      modalPnl.value = pnl || "";
      modal.classList.remove("hidden");
    };

    calendarEl.appendChild(div);
  }

  summaryEl.textContent = `Total: ${total} | Win: ${win} | Loss: ${loss}`;
}

saveBtn.onclick = () => {
  const val = Number(modalPnl.value);
  if (!isNaN(val)) {
    data[selectedDate] = val;
    saveData();
    renderCalendar();
  }
  modal.classList.add("hidden");
};

closeBtn.onclick = () => {
  modal.classList.add("hidden");
};

prevBtn.onclick = () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
};

nextBtn.onclick = () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
};

renderCalendar();
