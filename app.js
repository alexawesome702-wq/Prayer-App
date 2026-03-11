const STORAGE_KEY = "prayer-thread-state";
const THEME_KEY = "prayer-thread-theme";

const quickPrompts = [
  "God, thank You for staying close even when life feels noisy.",
  "I need peace about what comes next.",
  "Help me forgive the person I keep replaying in my mind.",
  "Thank You for one good thing from today.",
  "Give me courage to be kind when it is hard."
];

const reflections = [
  "Start with honesty. Prayer does not need polished words.",
  "If you do not know what to say, begin with one true sentence.",
  "Thank God for one specific thing from today before asking for anything else.",
  "If your mind is loud, write the prayer exactly as it feels."
];

const initialState = {
  messages: [],
  lastPrayerDate: "",
  streak: 0
};

const thread = document.querySelector("#thread");
const composer = document.querySelector("#composer");
const prayerInput = document.querySelector("#prayerInput");
const promptChips = document.querySelector("#promptChips");
const streakValue = document.querySelector("#streakValue");
const totalValue = document.querySelector("#totalValue");
const reflectionText = document.querySelector("#reflectionText");
const clearButton = document.querySelector("#clearButton");
const messageTemplate = document.querySelector("#messageTemplate");
const installButton = document.querySelector("#installButton");
const installCopy = document.querySelector("#installCopy");
const themeToggle = document.querySelector("#themeToggle");

let deferredInstallPrompt = null;

let state = loadState();
refreshStreakStatus();
applyTheme(loadTheme());

renderPromptChips();
renderThread();
renderStats();
renderReflection();
configureInstallExperience();
registerServiceWorker();

prayerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    composer.requestSubmit();
  }
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const prayer = prayerInput.value.trim();

  if (!prayer) {
    prayerInput.focus();
    return;
  }

  state.messages.push({
    text: prayer,
    createdAt: new Date().toISOString()
  });
  updatePrayerStreak();
  persistState();
  renderThread();
  renderStats();
  renderReflection(true);
  composer.reset();
  prayerInput.focus();
});

clearButton.addEventListener("click", () => {
  state = { ...initialState };
  persistState();
  renderThread();
  renderStats();
  renderReflection();
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) {
    return;
  }

  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.classList.add("is-hidden");
});

themeToggle.addEventListener("change", () => {
  const nextTheme = themeToggle.checked ? "dark" : "light";
  applyTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
});

function renderPromptChips() {
  promptChips.innerHTML = "";

  quickPrompts.forEach((prompt) => {
    const button = document.createElement("button");
    button.className = "chip";
    button.type = "button";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      prayerInput.value = prompt;
      prayerInput.focus();
    });
    promptChips.appendChild(button);
  });
}

function configureInstallExperience() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isIos = /iphone|ipad|ipod/.test(userAgent);
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  if (isStandalone) {
    installCopy.textContent = "Installed. You can launch Prayer Thread like any other app.";
    installButton.classList.add("is-hidden");
    return;
  }

  if (isIos) {
    installCopy.textContent =
      "On iPhone: open in Safari, tap Share, then choose Add to Home Screen.";
    installButton.classList.add("is-hidden");
    return;
  }

  installCopy.textContent =
    "On Mac: open this in Chrome or Edge and use Install app when it appears.";
}

function renderThread() {
  thread.innerHTML = "";

  if (!state.messages.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML =
      "<p>Your prayer thread is empty.</p><p>Send a short prayer, a thank you, or one honest sentence.</p>";
    thread.appendChild(empty);
    return;
  }

  state.messages.forEach((message) => {
    const node = messageTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".message-text").textContent = message.text;
    node.querySelector(".message-time").textContent = formatTimestamp(message.createdAt);
    thread.appendChild(node);
  });

  thread.scrollTop = thread.scrollHeight;
}

function renderStats() {
  streakValue.textContent = `${state.streak} ${state.streak === 1 ? "day" : "days"}`;
  totalValue.textContent = String(state.messages.length);
}

function renderReflection(justSent = false) {
  const index = justSent ? state.messages.length % reflections.length : 0;
  reflectionText.textContent = reflections[index];
}

function updatePrayerStreak() {
  const today = formatDayStamp(new Date());

  if (!state.lastPrayerDate) {
    state.streak = 1;
    state.lastPrayerDate = today;
    return;
  }

  if (state.lastPrayerDate === today) {
    return;
  }

  const previous = new Date(`${state.lastPrayerDate}T00:00:00`);
  const current = new Date(`${today}T00:00:00`);
  const differenceInDays = Math.round((current - previous) / 86400000);

  state.streak = differenceInDays === 1 ? state.streak + 1 : 1;
  state.lastPrayerDate = today;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { ...initialState };
    }

    return { ...initialState, ...JSON.parse(saved) };
  } catch {
    return { ...initialState };
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.checked = theme === "dark";
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", theme === "dark" ? "#18202c" : "#c96f4a");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      installCopy.textContent =
        "Install is available, but offline support could not be enabled in this browser.";
    });
  });
}

function refreshStreakStatus() {
  if (!state.lastPrayerDate) {
    return;
  }

  const previous = new Date(`${state.lastPrayerDate}T00:00:00`);
  const current = new Date(`${formatDayStamp(new Date())}T00:00:00`);
  const differenceInDays = Math.round((current - previous) / 86400000);

  if (differenceInDays > 1) {
    state.streak = 0;
    persistState();
  }
}

function formatTimestamp(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDayStamp(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installCopy.textContent =
    "This browser supports install. Use the button below to add Prayer Thread as an app.";
  installButton.classList.remove("is-hidden");
});
