/* ============================================================
   I Choose Me 💖 — edit the CONFIG + QUESTIONS below freely
   ============================================================ */

const CONFIG = {
  channelName: "@yourchannel",                 // shows in the footer
  channelUrl: "https://www.youtube.com/@yourchannel",
  siteUrl: "",                                  // printed at the bottom of the sheet (optional)
};

// type "ex": Yes is the forbidden button, No moves on.
// type "check": No → Lock In page for that focus, Yes moves on.
const QUESTIONS = [
  {
    type: "ex",
    emoji: "💔",
    text: "Are you getting back together with your ex?",
  },
  {
    type: "check",
    emoji: "🎯",
    text: "Have you accomplished that one thing you promised yourself recently?",
    focus: "Your promise to yourself",
    lockEmoji: "🎯",
    message: "That thing you promised yourself? That's the energy we're feeding today, not his DMs. Small steps still count.",
    tasks: [
      "Write down the ONE thing you promised yourself",
      "Break it into a tiny 25-minute first step",
      "Start a pomodoro and do just that step",
      "Tell your bestie you did it (bragging is encouraged)",
    ],
  },
  {
    type: "check",
    emoji: "🛁",
    text: "Have you done some self-care today?",
    focus: "Self-care",
    lockEmoji: "🛁",
    message: "You can't pour from an empty cup, babe. Give yourself the love you keep trying to give him.",
    tasks: [
      "Shower / skincare / hair, the full glow-up or just the basics",
      "Put on your comfiest fit or the one that makes you feel cute",
      "Play your feel-good playlist",
      "Take 5 slow, deep breaths",
    ],
  },
  {
    type: "check",
    emoji: "🥤",
    text: "Have you had water and a real meal today?",
    focus: "Fuel your body",
    lockEmoji: "🥤",
    message: "Hungry + dehydrated is how bad texts get sent. Feed the queen first, then decide anything.",
    tasks: [
      "Drink a full glass of water right now",
      "Eat something real (snacks count if they're good snacks)",
      "Step outside or stretch for 5 minutes",
      "Refill that water bottle and keep it close",
    ],
  },
  {
    type: "ex",
    emoji: "👀",
    text: "Okay, last one. Be honest: are you getting back together with him?",
  },
];

const WIN_TASKS = [
  "Say it out loud: \"I choose me!\"",
  "Mute or archive the chat (you're not deleting, you're protecting your peace)",
  "Text your bestie instead",
  "Do one thing today that's just for you",
];

/* ============================================================ */

const $ = (id) => document.getElementById(id);
let current = 0;
let lastFocus = null;

function track(name) {
  try {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: name, title: name, event: true });
    }
  } catch (_) { /* analytics is optional */ }
}

function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- quiz ---------- */
function startQuiz() {
  current = 0;
  lastFocus = null;
  track("quiz-start");
  renderQuestion();
  show("screen-question");
}

function renderQuestion() {
  const q = QUESTIONS[current];
  $("q-count").textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
  $("q-emoji").textContent = q.emoji;
  $("q-text").textContent = q.text;
  $("progress-bar").style.width = `${(current / QUESTIONS.length) * 100}%`;
  resetYes();
  setSass("");
}

function answer(isYes) {
  const q = QUESTIONS[current];
  if (q.type === "ex") {
    if (isYes) return sneaky();
    next();
  } else {
    if (isYes) return next();
    lockIn(q);
  }
}

function next() {
  current++;
  if (current >= QUESTIONS.length) return win();
  renderQuestion();
  show("screen-question");
}

function lockIn(q) {
  lastFocus = q;
  track(`lockin-${current + 1}`);
  $("lock-title").textContent = q.focus;
  $("lock-emoji").textContent = q.lockEmoji;
  $("lock-message").textContent = q.message;
  renderChecklist($("lock-list"), q.tasks);
  show("screen-lockin");
}

function win() {
  lastFocus = null;
  $("progress-bar").style.width = "100%";
  track("quiz-complete");
  show("screen-win");
  confetti();
}

function renderChecklist(ul, tasks) {
  ul.innerHTML = "";
  tasks.forEach((t) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.addEventListener("change", () => {
      if ([...ul.querySelectorAll("input")].every((i) => i.checked)) confetti(30);
    });
    const span = document.createElement("span");
    span.textContent = t;
    label.append(box, span);
    li.append(label);
    ul.append(li);
  });
}

/* ---------- the forbidden Yes ---------- */
const yesBtn = $("yes-btn");
const answersEl = $("answers");
let attempts = 0;
let busy = false;
const SASS = [
  "nice try 😌", "nope 💅", "not today, sis", "we don't do that here",
  "girl… no", "the audacity 😭", "put the phone DOWN", "absolutely not 🙅‍♀️",
];

const sassEl = document.createElement("p");
sassEl.className = "lead";
sassEl.style.margin = "10px 0 0";
sassEl.style.minHeight = "1.6em";
answersEl.after(sassEl);
function setSass(t) { sassEl.textContent = t; }

function isExQuestion() { return QUESTIONS[current] && QUESTIONS[current].type === "ex"; }

function resetYes() {
  attempts = 0;
  busy = false;
  yesBtn.className = "btn btn-yes";
  yesBtn.style.left = yesBtn.style.top = "";
  yesBtn.disabled = false;
  yesBtn.textContent = "Yes";
}

function randomSpot() {
  const card = $("app").getBoundingClientRect();
  const box = answersEl.getBoundingClientRect();
  const no = $("no-btn").getBoundingClientRect();
  const w = yesBtn.offsetWidth, h = yesBtn.offsetHeight, pad = 12;
  for (let i = 0; i < 30; i++) {
    const x = card.left + pad + Math.random() * (card.width - w - pad * 2);
    const y = card.top + pad + Math.random() * (card.height - h - pad * 2);
    const hitsNo = x < no.right + 10 && x + w > no.left - 10 && y < no.bottom + 10 && y + h > no.top - 10;
    const cur = yesBtn.getBoundingClientRect();
    const tooClose = Math.abs(x - cur.left) < 80 && Math.abs(y - cur.top) < 50;
    if (!hitsNo && !tooClose) return { left: x - box.left, top: y - box.top };
  }
  return { left: -box.left + card.left + pad, top: -box.top + card.top + pad };
}

function moveYes() {
  const p = randomSpot();
  yesBtn.style.left = `${p.left}px`;
  yesBtn.style.top = `${p.top}px`;
}

// Returns true if the button dodged, false if it "gave up" this time.
function evade() {
  if (!isExQuestion() || busy) return true;
  attempts++;
  // every 7th try it gets tired and lets you catch it… for the sneaky message
  if (attempts % 7 === 0) { setSass("ok fine, I'm tired 😮‍💨 go ahead…"); return false; }

  setSass(SASS[Math.floor(Math.random() * SASS.length)]);
  if (!yesBtn.classList.contains("evasive")) {
    // freeze the No button in place before Yes leaves the flow
    const no = $("no-btn");
    no.style.marginLeft = `${yesBtn.offsetWidth + 18}px`;
    const start = yesBtn.getBoundingClientRect(), box = answersEl.getBoundingClientRect();
    yesBtn.classList.add("evasive");
    yesBtn.style.left = `${start.left - box.left}px`;
    yesBtn.style.top = `${start.top - box.top}px`;
    void yesBtn.offsetWidth;
  }
  yesBtn.classList.remove("shrink", "nope");

  const roll = Math.random();
  if (roll < 0.5) {
    moveYes();
  } else if (roll < 0.7) {
    busy = true;
    yesBtn.classList.add("vanish");
    setTimeout(() => { moveYes(); yesBtn.classList.remove("vanish"); busy = false; }, 700);
  } else if (roll < 0.85) {
    busy = true;
    yesBtn.disabled = true;
    yesBtn.classList.add("nope");
    yesBtn.textContent = "🔒";
    setTimeout(() => {
      yesBtn.disabled = false;
      yesBtn.classList.remove("nope");
      yesBtn.textContent = "Yes";
      moveYes();
      busy = false;
    }, 900);
  } else {
    yesBtn.classList.add("shrink");
    moveYes();
  }
  return true;
}

yesBtn.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") evade(); });
yesBtn.addEventListener("touchstart", (e) => { if (isExQuestion() && evade()) e.preventDefault(); }, { passive: false });
yesBtn.addEventListener("click", () => answer(true));
$("no-btn").addEventListener("click", () => {
  $("no-btn").style.marginLeft = "";
  answer(false);
});

function sneaky() {
  track("sneaky-yes");
  $("toast").hidden = false;
  $("toast-close").focus();
}
$("toast-close").addEventListener("click", () => {
  $("toast").hidden = true;
  resetYes();
  $("no-btn").style.marginLeft = "";
  setSass("the only right answer is right there 👉");
});

/* ---------- pomodoro ---------- */
const timer = {
  mode: "focus",
  mins: { focus: 25, short: 5, long: 15 },
  remaining: 25 * 60,
  endAt: null,
  tick: null,
};
const SUBS = {
  focus: "Phone face down. You're locked in. 🔒",
  short: "Stretch, sip water, NO scrolling his IG 👀",
  long: "Big break, you earned it queen 👑",
};
const ring = $("ring-fg");
const CIRC = 2 * Math.PI * 52;
ring.style.strokeDasharray = CIRC;

function todayKey() { return "icm-tally-" + new Date().toISOString().slice(0, 10); }
function getTally() { try { return +localStorage.getItem(todayKey()) || 0; } catch (_) { return 0; } }
function setTally(n) { try { localStorage.setItem(todayKey(), n); } catch (_) {} renderTally(); }
function renderTally() {
  const n = getTally();
  $("tally").textContent = n;
  $("tally-hearts").textContent = "🍅".repeat(Math.min(n, 8));
}

function fmt(s) {
  const m = Math.floor(s / 60), r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function drawTimer() {
  $("timer-display").textContent = fmt(timer.remaining);
  const total = timer.mins[timer.mode] * 60;
  ring.style.strokeDashoffset = CIRC * (1 - timer.remaining / total);
  document.title = timer.endAt ? `${fmt(timer.remaining)} · I Choose Me` : "I Choose Me 💖";
}

function setMode(mode) {
  stopTimer();
  timer.mode = mode;
  timer.remaining = timer.mins[mode] * 60;
  document.querySelectorAll(".mode").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  $("timer-sub").textContent = SUBS[mode];
  drawTimer();
}

function startTimer() {
  timer.endAt = Date.now() + timer.remaining * 1000;
  $("timer-toggle").textContent = "Pause";
  if (timer.mode === "focus") track("pomodoro-start");
  timer.tick = setInterval(() => {
    timer.remaining = Math.max(0, Math.round((timer.endAt - Date.now()) / 1000));
    drawTimer();
    if (timer.remaining <= 0) finishTimer();
  }, 250);
  drawTimer();
}

function stopTimer() {
  clearInterval(timer.tick);
  timer.tick = null;
  timer.endAt = null;
  $("timer-toggle").textContent = "Start";
  drawTimer();
}

function finishTimer() {
  stopTimer();
  chime();
  if (timer.mode === "focus") {
    setTally(getTally() + 1);
    track("pomodoro-complete");
    confetti(40);
    setMode(getTally() % 4 === 0 ? "long" : "short");
    $("timer-sub").textContent = "Session done!! So proud of you 💖 Break time.";
  } else {
    setMode("focus");
    $("timer-sub").textContent = "Break's over, girliepop. Lock back in 🔒";
  }
}

function chime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [659, 784, 988, 1319].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + 0.55);
    });
  } catch (_) {}
}

function openTimer() {
  $("timer-panel").hidden = false;
  renderTally();
  drawTimer();
  track("pomodoro-open");
}

$("timer-toggle").addEventListener("click", () => (timer.endAt ? stopTimer() : startTimer()));
$("timer-reset").addEventListener("click", () => setMode(timer.mode));
$("timer-close").addEventListener("click", () => { $("timer-panel").hidden = true; });
$("timer-panel").addEventListener("click", (e) => { if (e.target.id === "timer-panel") $("timer-panel").hidden = true; });
document.querySelectorAll(".mode").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
[["set-focus", "focus"], ["set-short", "short"], ["set-long", "long"]].forEach(([id, mode]) => {
  $(id).addEventListener("change", (e) => {
    const v = Math.min(120, Math.max(1, parseInt(e.target.value, 10) || timer.mins[mode]));
    e.target.value = v;
    timer.mins[mode] = v;
    if (timer.mode === mode && !timer.endAt) setMode(mode);
  });
});

/* ---------- printable sheet ---------- */
function printSheet() {
  const q = lastFocus;
  $("print-focus").textContent = q ? `${q.focus} ${q.lockEmoji}` : "Choosing me 👑";
  const ul = $("print-list");
  ul.innerHTML = "";
  (q ? q.tasks : WIN_TASKS).forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.append(li);
  });
  const site = CONFIG.siteUrl || location.href.split("#")[0];
  $("print-foot").textContent = `I Choose Me 💖 by ${CONFIG.channelName} · ${site}`;
  track("print");
  window.print();
}

/* ---------- fun stuff ---------- */
function confetti(n = 60) {
  const bits = ["💖", "✨", "🎀", "💅", "🌸", "💕", "👑"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "confetti";
    s.textContent = bits[Math.floor(Math.random() * bits.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    s.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.append(s);
    setTimeout(() => s.remove(), 5500);
  }
}

(function sparkles() {
  const wrap = document.querySelector(".sparkles");
  const bits = ["💖", "✨", "🌸", "💕", "🎀"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.textContent = bits[i % bits.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDuration = 10 + Math.random() * 12 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    wrap.append(s);
  }
})();

/* ---------- wire up ---------- */
$("start-btn").addEventListener("click", startQuiz);
$("open-timer-btn").addEventListener("click", openTimer);
$("win-timer-btn").addEventListener("click", openTimer);
$("print-btn").addEventListener("click", printSheet);
$("win-print-btn").addEventListener("click", printSheet);
$("restart-from-lock").addEventListener("click", startQuiz);
$("restart-from-win").addEventListener("click", startQuiz);
$("said-it-btn").addEventListener("click", () => {
  track("said-i-choose-me");
  confetti(80);
  $("said-it-btn").textContent = "Proud of you 🥹💖";
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { $("timer-panel").hidden = true; $("toast").hidden = true; }
});

const link = $("channel-link");
link.textContent = CONFIG.channelName;
link.href = CONFIG.channelUrl;
setMode("focus");
