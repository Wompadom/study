let timer, galleons = 0, stationIndex = 0;
let totalTime = 25 * 60;
let remainingTime = totalTime;
let isRunning = false;
let audioEnabled = false;

const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");

function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
  const seconds = (remainingTime % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;

  const progress = ((totalTime - remainingTime) / totalTime) * 100;
  progressBar.style.width = `${progress}%`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;
      galleons += 1;
      stationIndex++;
      document.getElementById("galleons").textContent = `🪙 ${galleons}`;
      drawTrainMap();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  remainingTime = totalTime;
  updateDisplay();
}

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetTimer);

document.getElementById("font-select").addEventListener("change", (e) => {
  document.getElementById("timer").style.fontFamily = e.target.value;
});

document.getElementById("toggle-settings").addEventListener("click", () => {
  document.getElementById("controls").classList.toggle("hidden");
});

document.getElementById("toggle-map").addEventListener("click", () => {
  document.getElementById("map").classList.toggle("hidden");
});

document.getElementById("toggle-shop").addEventListener("click", () => {
  document.getElementById("shop").classList.toggle("hidden");
});

document.getElementById("toggle-audio").addEventListener("change", (e) => {
  audioEnabled = e.target.checked;
});

document.getElementById("set-video").addEventListener("click", () => {
  const videoLink = document.getElementById("video-link").value.trim();
  const videoId = videoLink.split("v=")[1]?.split("&")[0];

  if (videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${audioEnabled ? 0 : 1}&controls=0&loop=1&playlist=${videoId}`;
    const iframe = document.getElementById("bg-video");
    iframe.src = embedUrl;
    iframe.style.display = "block";
    document.getElementById("bg-image").style.display = "none";
  }
});

document.getElementById("image-upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    document.getElementById("bg-video").src = "";
    document.getElementById("bg-video").style.display = "none";
    const image = document.getElementById("bg-image");
    image.src = imageUrl;
    image.style.display = "block";
  }
});

document.querySelectorAll('.buy').forEach(btn => {
  btn.addEventListener('click', () => {
    const cost = parseInt(btn.dataset.cost);
    if (galleons >= cost) {
      galleons -= cost;
      document.getElementById("galleons").textContent = `🪙 ${galleons}`;
      alert(`Purchased ${btn.textContent.trim()}`);
    } else {
      alert("Not enough galleons!");
    }
  });
});

// Simple winding map logic
function drawTrainMap() {
  const canvas = document.getElementById("train-map");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const path = [
    [20, 20], [280, 20], [280, 80], [20, 80],
    [20, 140], [280, 140], [280, 200], [20, 200],
    [20, 260], [280, 260]
  ];

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  path.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.stroke();

  // Station icons
  path.forEach(([x, y], i) => {
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText("🚉", x - 6, y - 12);
  });

  // Train position
  if (stationIndex >= path.length) stationIndex = path.length - 1;
  const [trainX, trainY] = path[stationIndex];
  ctx.fillText("🚂", trainX - 10, trainY - 20);
}

drawTrainMap();
updateDisplay();

