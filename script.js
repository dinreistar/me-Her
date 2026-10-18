
// =============================================
// OUR LITTLE STORY ♡
// Simple JavaScript — no frameworks or APIs
// =============================================

// Customize your relationship start date here.
// JavaScript months start at 0, so October = 9.
const START_YEAR = 2026;
const START_MONTH = 9;
const START_DAY = 16;

// =============================================
// 1. RELATIONSHIP DAY COUNTER
// =============================================

const dayNumber = document.getElementById("dayNumber");
const startDateElement = document.getElementById("startDate");

const startDate = new Date(
  START_YEAR,
  START_MONTH,
  START_DAY,
  0, 0, 0, 0
);

// Convert a visitor's LOCAL calendar date into a UTC
// calendar-day number. This avoids daylight-saving errors.
function getLocalCalendarDay(date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    / 86400000
  );
}

function updateRelationshipDay() {
  const now = new Date();

  const todayNumber = getLocalCalendarDay(now);
  const firstDayNumber = getLocalCalendarDay(startDate);

  // Start date = Day 1. Never show a negative day.
  const relationshipDay = Math.max(
    1,
    todayNumber - firstDayNumber + 1
  );

  dayNumber.textContent = relationshipDay.toLocaleString(
    undefined,
    { useGrouping: false }
  );

  // Update the date shown on the page.
  startDateElement.dateTime =
    `${START_YEAR}-${String(START_MONTH + 1).padStart(2, "0")}-${String(START_DAY).padStart(2, "0")}`;

  startDateElement.textContent = startDate.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );
}

// Run immediately whenever the page opens.
updateRelationshipDay();

// Schedule the next update for the visitor's next local midnight.
// Recalculate the delay each time so the counter keeps in sync.
let midnightTimer;

function scheduleNextMidnightUpdate() {
  clearTimeout(midnightTimer);

  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0, 0, 0, 0
  );

  const delay = Math.max(50, nextMidnight.getTime() - now.getTime() + 100);

  midnightTimer = setTimeout(() => {
    updateRelationshipDay();
    scheduleNextMidnightUpdate();
  }, delay);
}

scheduleNextMidnightUpdate();

// Recheck if the visitor returns to the tab or unlocks their phone.
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    updateRelationshipDay();
    scheduleNextMidnightUpdate();
  }
});

// =============================================
// 2. MUSIC PLAYER
// Put music.mp3 beside index.html.
// Music starts only after the visitor presses Play.
// =============================================


// =============================================
// ROMANTIC MUSIC PLAYER ♡
// Add or remove songs in this list.
// All files must be inside the same folder.
// =============================================

const songs = [
  { title: "Love me harder ♡ by Taylor Swift", src: "music1_love me harder.mp3" },
  { title: "blue 🌸 By yung kai", src: "music2_blue.mp3" },
  { title: "Hadest to love💗 By THE Weeknd", src: "Hardest To Love .mp3" },
  { title: "STAY WITH ME ✨by Tol sophiti", src: "stay with me.mp3" }
];

const music = document.getElementById("ourSong");
music.volume = 0.7;
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const musicStatus = document.getElementById("musicStatus");
const songTitle = document.querySelector(".song-title");

let currentSong = -1;
let isPlaying = false;

function showMusicState(playing) {
  isPlaying = playing;

  musicIcon.textContent = playing ? "Ⅱ" : "▶";
  musicToggle.classList.toggle("is-playing", playing);
  musicToggle.setAttribute("aria-pressed", String(playing));
  musicToggle.setAttribute(
    "aria-label",
    playing ? "Pause music" : "Play music"
  );

  musicStatus.textContent = playing
    ? "playing a little love melody ♡"
    : "tap to play our songs ♡";
}

function showSongTitle() {
  if (currentSong >= 0) {
    songTitle.textContent = songs[currentSong].title;
  }
}

// Pick a random song different from the previous one,
// when there is more than one song.
function getRandomSong() {
  if (songs.length === 0) return -1;
  if (songs.length === 1) return 0;

  let nextSong;

  do {
    nextSong = Math.floor(Math.random() * songs.length);
  } while (nextSong === currentSong);

  return nextSong;
}

async function playRandomSong() {
  if (songs.length === 0) {
    musicStatus.textContent = "add songs to your music folder ♡";
    showMusicState(false);
    return;
  }

  currentSong = getRandomSong();
  music.src = songs[currentSong].src;
  music.load();
  showSongTitle();

  try {
    await music.play();
    showMusicState(true);
  } catch (error) {
    showMusicState(false);
    musicStatus.textContent = "could not play this song ♡";
  }
}

// Tap once to play a random song.
// Tap again to pause it.
musicToggle.addEventListener("click", async () => {
  if (!music.paused) {
    music.pause();
    showMusicState(false);
    return;
  }

  // Resume the current song if it is paused.
  if (currentSong >= 0 && music.currentTime > 0 && !music.ended) {
    try {
      await music.play();
      showMusicState(true);
    } catch (error) {
      showMusicState(false);
      musicStatus.textContent = "tap to try again ♡";
    }
  } else {
    await playRandomSong();
  }
});

// When a song finishes, automatically play another random song.
music.addEventListener("ended", () => {
  playRandomSong();
});

music.addEventListener("play", () => showMusicState(true));
music.addEventListener("pause", () => showMusicState(false));

music.addEventListener("error", () => {
  showMusicState(false);
  musicStatus.textContent = "check the music file ♡";
});

showMusicState(false);


// =============================================
// 3. FLOATING HEARTS & SAKURA
// A small fixed number of particles helps performance.
// =============================================

const particleContainer = document.getElementById("particles");

const decorations = ["♡", "✦", "🌸", "♥"];
const PARTICLE_COUNT = 12;

function createFloatingParticles() {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent =
      decorations[Math.floor(Math.random() * decorations.length)];

    particle.style.left = `${Math.random() * 96 + 2}%`;
    particle.style.setProperty(
      "--size",
      `${10 + Math.random() * 9}px`
    );
    particle.style.setProperty(
      "--duration",
      `${14 + Math.random() * 12}s`
    );
    particle.style.setProperty(
      "--delay",
      `${-Math.random() * 25}s`
    );
    particle.style.setProperty(
      "--drift",
      `${Math.round(Math.random() * 60 - 30)}px`
    );

    fragment.appendChild(particle);
  }

  particleContainer.appendChild(fragment);
}

createFloatingParticles();

// =============================================
// 4. HEART CLICK EFFECT
// Tapping the large heart creates a few sparkles.
// =============================================

const loveHeart = document.getElementById("loveHeart");

const burstSymbols = ["♡", "♥", "✦", "✧"];

function createHeartBurst() {
  const rect = loveHeart.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 7; i++) {
    const sparkle = document.createElement("span");
    sparkle.className = "burst-particle";
    sparkle.textContent =
      burstSymbols[Math.floor(Math.random() * burstSymbols.length)];

    const angle = (Math.PI * 2 * i) / 7;
    const distance = 35 + Math.random() * 35;

    sparkle.style.left = `${centerX}px`;
    sparkle.style.top = `${centerY}px`;
    sparkle.style.setProperty(
      "--x",
      `${Math.cos(angle) * distance}px`
    );
    sparkle.style.setProperty(
      "--y",
      `${Math.sin(angle) * distance}px`
    );
    sparkle.style.setProperty(
      "--rotation",
      `${Math.round(Math.random() * 50 - 25)}deg`
    );
    sparkle.style.setProperty(
      "--size",
      `${12 + Math.random() * 8}px`
    );

    fragment.appendChild(sparkle);

    // Automatically remove each sparkle after its animation.
    sparkle.addEventListener("animationend", () => sparkle.remove(), {
      once: true
    });
  }

  particleContainer.appendChild(fragment);
}

loveHeart.addEventListener("click", createHeartBurst);

// =============================================
// 5. INITIAL STATE
// =============================================

showMusicState(false);

// ♡ ROMANTIC MUSIC VISUALIZER ♡

const audio = document.getElementById("ourSong");
const canvas = document.getElementById("musicVisualizer");
const ctx = canvas.getContext("2d");
const status = document.getElementById("visualizerStatus");

let audioContext;
let analyser;
let source;
let data;
let connected = false;
let animationId;

function setupAudio() {
  if (connected) return;

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    status.textContent = "Your browser does not support this effect.";
    return;
  }

  audioContext = new AudioContextClass();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.8;

  source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  data = new Uint8Array(analyser.frequencyBinCount);
  connected = true;
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawVisualizer() {
  animationId = requestAnimationFrame(drawVisualizer);

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  ctx.clearRect(0, 0, width, height);

  if (!analyser || audio.paused) {
    drawIdleWave(width, height);
    return;
  }

  analyser.getByteFrequencyData(data);

  // Detect low-frequency bass
  const bassCount = Math.max(1, Math.floor(data.length * 0.15));
  let bass = 0;

  for (let i = 0; i < bassCount; i++) {
    bass += data[i];
  }

  bass /= bassCount * 255;

  // Bass makes the center glow stronger
  const glow = 8 + bass * 30;

  ctx.shadowBlur = glow;
  ctx.shadowColor = "#d946ef";

  // Draw frequency bars
  const bars = 42;
  const gap = 3;
  const barWidth = Math.max(1, (width - gap * (bars - 1)) / bars);
  const step = Math.max(1, Math.floor(data.length / bars));

  for (let i = 0; i < bars; i++) {
    const value = data[i * step] / 255;
    const barHeight = Math.max(3, value * height * 0.85);
    const x = i * (barWidth + gap);
    const y = (height - barHeight) / 2;

    const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
    gradient.addColorStop(0, "#f0abfc");
    gradient.addColorStop(1, "#8b5cf6");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, 3);
    ctx.fill();
  }

  // Bass-responsive heart pulse
  const pulse = 1 + bass * 0.25;
  ctx.shadowBlur = glow;
  ctx.font = `${22 * pulse}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f9a8d4";
  ctx.fillText("♥", width / 2, height / 2);

  ctx.shadowBlur = 0;

  status.textContent = "♪ Playing · Feel the bass ♡";
}

function drawIdleWave(width, height) {
  const time = performance.now() / 700;

  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#c084fc";

  for (let x = 0; x < width; x++) {
    const y =
      height / 2 +
      Math.sin(x * 0.035 + time) * 8 +
      Math.sin(x * 0.015 - time) * 5;

    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

if (audio && canvas && ctx) {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  audio.addEventListener("play", async () => {
    setupAudio();

    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume();
    }

    status.textContent = "♪ Music is playing ♡";
  });

  audio.addEventListener("pause", () => {
    status.textContent = "Music paused ♡";
  });

  drawVisualizer();
}

/* ===== MENU, GAME & MINI MUSIC TAB ===== */

const menuToggle = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");
const miniMusic = document.getElementById("miniMusic");
const gamePanel = document.getElementById("gamePanel");
const songSearch = document.getElementById("songSearch");
const songList = document.getElementById("songList");

function closePanels() {
  sideMenu.hidden = true;
  miniMusic.hidden = true;
  gamePanel.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

menuToggle.addEventListener("click", () => {
  const opening = sideMenu.hidden;
  closePanels();

  if (opening) {
    sideMenu.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
  }
});

document.querySelectorAll(".menu-link").forEach(button => {
  button.addEventListener("click", () => {
    const page = button.dataset.page;
    closePanels();

    if (page === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (page === "music") {
      miniMusic.hidden = false;
      renderSongList(songSearch.value);
    }

    if (page === "game") {
      gamePanel.hidden = false;
    }
  });
});

document.getElementById("closeMiniMusic").addEventListener("click", () => {
  miniMusic.hidden = true;
});

document.getElementById("closeGame").addEventListener("click", () => {
  gamePanel.hidden = true;
});

function renderSongList(query = "") {
  const search = query.trim().toLowerCase();
  songList.replaceChildren();

  const matchingSongs = songs
    .map((song, index) => ({ song, index }))
    .filter(item => item.song.title.toLowerCase().includes(search));

  if (matchingSongs.length === 0) {
    const empty = document.createElement("p");
    empty.className = "mini-hint";
    empty.textContent = "No songs found ♡";
    songList.appendChild(empty);
    return;
  }

  matchingSongs.forEach(({ song, index }) => {
    const row = document.createElement("div");
    row.className = "song-item";

    const name = document.createElement("span");
    name.className = "song-name";
    name.textContent = song.title;

    const playButton = document.createElement("button");
    playButton.className = "song-play";
    playButton.type = "button";
    playButton.textContent =
      currentSong === index && !music.paused ? "Ⅱ" : "▶";
    playButton.setAttribute("aria-label", "Play " + song.title);

    playButton.addEventListener("click", async () => {
      if (currentSong === index && !music.paused) {
        music.pause();
        renderSongList(songSearch.value);
        return;
      }

      currentSong = index;
      music.src = song.src;
      music.load();
      showSongTitle();

      try {
        await music.play();
        showMusicState(true);
      } catch (error) {
        showMusicState(false);
        musicStatus.textContent = "Could not play this song ♡";
      }

      renderSongList(songSearch.value);
    });

    row.append(name, playButton);
    songList.appendChild(row);
  });
}

songSearch.addEventListener("input", () => {
  renderSongList(songSearch.value);
});

music.addEventListener("play", () => {
  if (!miniMusic.hidden) renderSongList(songSearch.value);
});

music.addEventListener("pause", () => {
  if (!miniMusic.hidden) renderSongList(songSearch.value);
});

music.addEventListener("ended", () => {
  if (!miniMusic.hidden) renderSongList(songSearch.value);
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePanels();
});

closePanels();

/* ===== CATCH MY HEART GAME ===== */

const heartArena = document.getElementById("heartArena");
const startGameButton = document.getElementById("startGame");
const gameScoreDisplay = document.getElementById("gameScore");
const gameTimeDisplay = document.getElementById("gameTime");
const gameResult = document.getElementById("gameResult");
const arenaMessage = document.getElementById("arenaMessage");

let loveGameScore = 0;
let loveGameTime = 20;
let loveGameRunning = false;
let loveGameTimer = null;


function spawnLoveHeart() {
  heartArena.querySelectorAll(".floating-game-heart").forEach(
    heart => heart.remove()
  );

  if (!loveGameRunning) return;

  const heart = document.createElement("button");
  heart.type = "button";
  heart.className = "floating-game-heart";
  heart.textContent = "♥";
  heart.setAttribute("aria-label", "Catch this heart");

  const maxX = Math.max(0, heartArena.clientWidth - 48);
  const maxY = Math.max(0, heartArena.clientHeight - 48);

  heart.style.left = Math.random() * maxX + "px";
  heart.style.top = Math.random() * maxY + "px";

  heart.addEventListener("click", () => {
    if (!loveGameRunning) return;

    loveGameScore++;
    gameScoreDisplay.textContent = loveGameScore;

    // Small pop effect when the heart is caught
    heart.animate(
      [
        { transform: "scale(1)", opacity: 1 },
        { transform: "scale(1.7)", opacity: 0 }
      ],
      { duration: 180, easing: "ease-out" }
    );

    spawnLoveHeart();
  });

  heartArena.appendChild(heart);
}


function finishLoveGame() {
  loveGameRunning = false;
  clearInterval(loveGameTimer);
  loveGameTimer = null;

  heartArena.querySelectorAll(".floating-game-heart").forEach(
    heart => heart.remove()
  );

  arenaMessage.hidden = false;
  arenaMessage.textContent = "You collected " + loveGameScore + " hearts! ♡";

  if (loveGameScore >= 15) {
    gameResult.textContent = "Amazing! You caught so much love! 💗";
  } else if (loveGameScore >= 7) {
    gameResult.textContent = "Aww, sending you extra kisses! 😘";
  } else {
    gameResult.textContent = "Every heart counts. Sending you love! 🌸";
  }

  startGameButton.textContent = "♡ Play Again ♡";
}

startGameButton.addEventListener("click", () => {
  if (loveGameRunning) return;

  clearInterval(loveGameTimer);

  loveGameScore = 0;
  loveGameTime = 20;
  loveGameRunning = true;

  gameScoreDisplay.textContent = "0";
  gameTimeDisplay.textContent = "20";
  gameResult.textContent = "Catch as many hearts as you can! ♡";
  arenaMessage.hidden = true;
  startGameButton.textContent = "♡ Game Running ♡";

  spawnLoveHeart();

  loveGameTimer = setInterval(() => {
    loveGameTime--;
    gameTimeDisplay.textContent = loveGameTime;

    if (loveGameTime <= 0) {
      gameTimeDisplay.textContent = "0";
      finishLoveGame();
    }
  }, 1000);
});

/* Stop the timer if the game panel is closed. */
document.getElementById("closeGame").addEventListener("click", () => {
  if (loveGameRunning) {
    clearInterval(loveGameTimer);
    loveGameTimer = null;
    loveGameRunning = false;

    heartArena.querySelectorAll(".floating-game-heart").forEach(
      heart => heart.remove()
    );

    arenaMessage.hidden = false;
    arenaMessage.textContent = "Ready for a little love? ♡";
    gameResult.textContent = "Game paused. Play again anytime! 💗";
    startGameButton.textContent = "♡ Start Game ♡";
  }
});
