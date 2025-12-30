// ================= PANTALLAS =================
const homeScreen = document.getElementById("homeScreen");
const timerScreen = document.getElementById("timerScreen");
const missionsScreen = document.getElementById("missionsScreen");
const rankingScreen = document.getElementById("rankingScreen");
const doneScreen = document.getElementById("doneScreen");

// ================= BOTONES =================
const startBtn = document.getElementById("startBtn");
const missionsBtn = document.getElementById("missionsBtn");
const rankingBtn = document.getElementById("rankingBtn");
const doneBtn = document.getElementById("doneBtn");

// ================= CRONÓMETRO =================
const timeDisplay = document.getElementById("time");
const playBtn = document.getElementById("play");
const pauseBtn = document.getElementById("pause");
const stopBtn = document.getElementById("stop");

let seconds = 0;
let interval = null;

// ================= NAVEGACIÓN =================
function showScreen(screen) {
  homeScreen.classList.add("hidden");
  timerScreen.classList.add("hidden");
  missionsScreen.classList.add("hidden");
  rankingScreen.classList.add("hidden");
  doneScreen.classList.add("hidden");

  if (screen === "home") homeScreen.classList.remove("hidden");
  if (screen === "timer") timerScreen.classList.remove("hidden");
  if (screen === "missions") missionsScreen.classList.remove("hidden");
  if (screen === "ranking") rankingScreen.classList.remove("hidden");
  if (screen === "done") doneScreen.classList.remove("hidden");
}

// ================= EVENTOS NAVEGACIÓN =================
startBtn.addEventListener("click", () => showScreen("timer"));
missionsBtn.addEventListener("click", () => showScreen("missions"));
rankingBtn.addEventListener("click", () => {
  showScreen("ranking");
  updateRanking();
});
doneBtn.addEventListener("click", () => {
  showScreen("done");
  loadDoneMissions();
});

// ================= FORMATO TIEMPO =================
function formatTime(sec) {
  const hrs = String(Math.floor(sec / 3600)).padStart(2, "0");
  const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const secs = String(sec % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}

// ================= CONTROLES =================
playBtn.addEventListener("click", () => {
  if (interval) return;
  interval = setInterval(() => {
    seconds++;
    timeDisplay.textContent = formatTime(seconds);
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;
});

stopBtn.addEventListener("click", () => {
  clearInterval(interval);
  interval = null;

  checkMissions();
  saveStudyTime(seconds);
  checkTasks(seconds);

  seconds = 0;
  timeDisplay.textContent = "00:00:00";
});


// ================= MISIONES =================
function checkMissions() {
  if (seconds >= 900) completeMission("m15");
  if (seconds >= 1800) completeMission("m30");
  if (seconds >= 3600) completeMission("m60");
}

function completeMission(id) {
  if (localStorage.getItem(id) === "done") return;
  localStorage.setItem(id, "done");
}

// ================= RANKING =================
function saveStudyTime(time) {
  let myTime = Number(localStorage.getItem("myTime")) || 0;
  myTime += time;
  localStorage.setItem("myTime", myTime);
}

function updateRanking() {
  const myTime = Number(localStorage.getItem("myTime")) || 0;
  const friendTime = Number(localStorage.getItem("friendTime")) || 0;

  document.getElementById("myTotal").textContent = formatTime(myTime);
  document.getElementById("friendTotal").textContent = formatTime(friendTime);
}

// ================= CUMPLIDAS =================
function loadDoneMissions() {
  doneList.innerHTML = "";

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const doneTasks = tasks.filter(task => task.done);

  if (doneTasks.length === 0) {
    doneList.innerHTML = "<li>❌ Aún no hay tareas cumplidas</li>";
    return;
  }

  doneTasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = "✅ " + task.name;
    doneList.appendChild(li);
  });
}


const tasksScreen = document.getElementById("tasksScreen");
const taskNameInput = document.getElementById("taskName");
const taskTimeSelect = document.getElementById("taskTime");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

addTaskBtn.addEventListener("click", () => {
  const name = taskNameInput.value.trim();
  const time = Number(taskTimeSelect.value);

  if (!name) return;

  const tasks = getTasks();
  tasks.push({ name, target: time, done: false });
  saveTasks(tasks);

  taskNameInput.value = "";
  renderTasks();
});

function renderTasks() {
  taskList.innerHTML = "";
  const tasks = getTasks();

  tasks.forEach((task, index) => {
    if (!task.done) {
      const li = document.createElement("li");
      li.textContent = `📚 ${task.name} (${formatTime(task.target)})`;
      taskList.appendChild(li);
    }
  });

  if (!taskList.innerHTML) {
    taskList.innerHTML = "<li>🎉 No hay tareas pendientes</li>";
  }
}


// ================= INICIO =================
showScreen("home");


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then(() => console.log("Service Worker registrado"))
    .catch(err => console.log("Error SW:", err));
}

