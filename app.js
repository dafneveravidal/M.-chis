let seconds = 0;
let interval = null;

const screens = {
  home,
  timer,
  tasks,
  missions,
  ranking,
  done
};

window.showScreen = (name) => {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
};

startBtn.onclick = () => showScreen("timer");

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2,"0");
  const s = String(sec % 60).padStart(2,"0");
  return `${m}:${s}`;
}

play.onclick = () => {
  if (interval) return;
  interval = setInterval(() => {
    seconds++;
    time.textContent = formatTime(seconds);
    localStorage.setItem("myTime", seconds);
    updateRanking();
  }, 1000);
};

pause.onclick = () => {
  clearInterval(interval);
  interval = null;
};

stop.onclick = () => {
  clearInterval(interval);
  interval = null;
  seconds = 0;
  time.textContent = "00:00";
};

addTask.onclick = () => {
  const name = taskName.value;
  const timeVal = Number(taskTime.value);
  if (!name) return;

  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push({ name, time: timeVal, done:false });
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskName.value = "";
  renderTasks();
  renderMissions();
};

function renderTasks() {
  taskList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `📚 ${t.name} (${formatTime(t.time)})`;
    taskList.appendChild(li);
  });
}

function renderMissions() {
  missionsList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(t => {
    const div = document.createElement("div");
    div.className = "rank-card";
    div.textContent = `🎯 ${t.name} por ${formatTime(t.time)}`;
    missionsList.appendChild(div);
  });
}

function updateRanking() {
  myTotal.textContent = formatTime(Number(localStorage.getItem("myTime") || 0));
}

renderTasks();
renderMissions();
updateRanking();
