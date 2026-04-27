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

const nudges = [
  "God, help me tell the truth about what I am carrying today.",
  "Thank You for staying with me in the middle of ordinary life.",
  "Give me peace about the thing I keep replaying in my head.",
  "Show me one person I can love well today.",
  "I do not have perfect words, but I am here."
];

const thread = document.querySelector("#thread");
const composer = document.querySelector("#composer");
const prayerInput = document.querySelector("#prayerInput");
const promptChips = document.querySelector("#promptChips");
const dayTabs = document.querySelector("#dayTabs");
const streakValue = document.querySelector("#streakValue");
const totalValue = document.querySelector("#totalValue");
const reflectionText = document.querySelector("#reflectionText");
const nudgeText = document.querySelector("#nudgeText");
const clearButton = document.querySelector("#clearButton");
const helperText = document.querySelector("#helperText");
const useNudgeButton = document.querySelector("#useNudgeButton");
const messageTemplate = document.querySelector("#messageTemplate");
const installButton = document.querySelector("#installButton");
const installCopy = document.querySelector("#installCopy");
const themeToggle = document.querySelector("#themeToggle");

let deferredInstallPrompt = null;
let state = loadState();

applyTheme(loadTheme());
renderPromptChips();
renderDayTabs();
renderThread();
renderStats();
renderReflection();
renderDailyNudge();
renderHelperText();
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

  const today = formatDayStamp(new Date());
  ensureDay(today);
  state.activeDay = today;
  state.days[today].push({
    text: prayer,
    createdAt: new Date().toISOString()
  });

  persistState();
  renderDayTabs();
  renderThread();
  renderStats();
  renderReflection(true);
  renderDailyNudge();
  renderHelperText();
  composer.reset();
  prayerInput.focus();
});

clearButton.addEventListener("click", () => {
  state = createInitialState();
  persistState();
  renderDayTabs();
  renderThread();
  renderStats();
  renderReflection();
  renderDailyNudge();
  renderHelperText();
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

useNudgeButton.addEventListener("click", () => {
  prayerInput.value = getDailyNudge();
  prayerInput.focus();
});

function createInitialState() {
  const today = formatDayStamp(new Date());
  return {
    days: {},
    activeDay: today
  };
}

function loadState() {
  const fallback = createInitialState();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);
    return migrateState(parsed);
  } catch {
    return fallback;
  }
}

function migrateState(saved) {
  const nextState = createInitialState();

  if (saved && typeof saved === "object" && saved.days && typeof saved.days === "object") {
    nextState.days = normalizeDays(saved.days);
    nextState.activeDay = nextState.days[saved.activeDay] ? saved.activeDay : chooseDefaultDay(nextState.days);
    return nextState;
  }

  if (saved && Array.isArray(saved.messages)) {
    saved.messages.forEach((message) => {
      if (!message || !message.createdAt || !message.text) {
        return;
      }

      const day = formatDayStamp(new Date(message.createdAt));
      if (!nextState.days[day]) {
        nextState.days[day] = [];
      }

      nextState.days[day].push({
        text: message.text,
        createdAt: message.createdAt
      });
    });

    nextState.activeDay = chooseDefaultDay(nextState.days);
  }

  return nextState;
}

function normalizeDays(days) {
  const normalized = {};

  Object.entries(days).forEach(([day, messages]) => {
    if (!Array.isArray(messages) || !messages.length) {
      return;
    }

    normalized[day] = messages
      .filter((message) => message && message.text && message.createdAt)
      .sort((left, right) => new Date(left.createdAt) - new Date(right.createdAt));
  });

  return normalized;
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureDay(day) {
  if (!state.days[day]) {
    state.days[day] = [];
  }
}

function chooseDefaultDay(days) {
  const sorted = getSortedDays(days);
  return sorted[0] || formatDayStamp(new Date());
}

function getSortedDays(days = state.days) {
  return Object.keys(days).sort((left, right) => new Date(right) - new Date(left));
}

function getActiveMessages() {
  return state.days[state.activeDay] || [];
}

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

function renderDayTabs() {
  const days = getSortedDays();
  dayTabs.innerHTML = "";

  if (!days.length) {
    const button = createDayTab(formatDayStamp(new Date()), true);
    dayTabs.appendChild(button);
    return;
  }

  days.forEach((day) => {
    dayTabs.appendChild(createDayTab(day, day === state.activeDay));
  });
}

function createDayTab(day, isActive) {
  const button = document.createElement("button");
  button.className = `day-tab${isActive ? " is-active" : ""}`;
  button.type = "button";
  button.innerHTML = `
    <span class="day-tab-title">${formatDayTitle(day)}</span>
    <span class="day-tab-subtitle">${formatDaySubtitle(day)}</span>
  `;
  button.addEventListener("click", () => {
    state.activeDay = day;
    persistState();
    renderDayTabs();
    renderThread();
    renderReflection();
    renderHelperText();
  });
  return button;
}

function renderThread() {
  thread.innerHTML = "";
  const messages = getActiveMessages();

  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <p>No prayers saved for ${formatDayTitle(state.activeDay)}.</p>
      <p>Write something now and it will be added to today's journal tab.</p>
    `;
    thread.appendChild(empty);
    return;
  }

  messages.forEach((message) => {
    const node = messageTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".message-text").textContent = message.text;
    node.querySelector(".message-time").textContent = formatTimestamp(message.createdAt);
    thread.appendChild(node);
  });

  thread.scrollTop = thread.scrollHeight;
}

function renderStats() {
  const streak = calculateStreak();
  streakValue.textContent = `${streak} ${streak === 1 ? "day" : "days"}`;
  totalValue.textContent = String(getTotalPrayerCount());
}

function renderReflection(justSent = false) {
  const currentCount = getActiveMessages().length;
  const index = justSent ? currentCount % reflections.length : 0;
  reflectionText.textContent = reflections[index];
}

function renderDailyNudge() {
  nudgeText.textContent = getDailyNudge();
}

function renderHelperText() {
  const today = formatDayStamp(new Date());
  helperText.textContent =
    state.activeDay === today
      ? "Saved only on this device."
      : `Viewing ${formatLongDay(state.activeDay)}. New prayers save to today.`;
}

function getTotalPrayerCount() {
  return Object.values(state.days).reduce((count, messages) => count + messages.length, 0);
}

function getDailyNudge() {
  const today = formatDayStamp(new Date());
  const todaysCount = (state.days[today] || []).length;

  if (todaysCount > 0) {
    return "You already checked in today. Add one more honest sentence before you leave.";
  }

  const dayNumber = Number(today.replaceAll("-", ""));
  return nudges[dayNumber % nudges.length];
}

function calculateStreak() {
  const days = getSortedDays().sort((left, right) => new Date(left) - new Date(right));
  if (!days.length) {
    return 0;
  }

  const today = formatDayStamp(new Date());
  const yesterday = shiftDay(today, -1);
  const mostRecent = days[days.length - 1];

  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0;
  }

  let streak = 1;
  for (let index = days.length - 1; index > 0; index -= 1) {
    if (shiftDay(days[index], -1) === days[index - 1]) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
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

function formatTimestamp(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function formatDayTitle(day) {
  const today = formatDayStamp(new Date());
  const yesterday = shiftDay(today, -1);

  if (day === today) {
    return "Today";
  }

  if (day === yesterday) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric"
  }).format(new Date(`${day}T12:00:00`));
}

function formatDaySubtitle(day) {
  const messages = state.days[day] || [];
  return `${messages.length} ${messages.length === 1 ? "prayer" : "prayers"}`;
}

function formatLongDay(day) {
  return new Intl.DateTimeFormat(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${day}T12:00:00`));
}

function formatDayStamp(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function shiftDay(day, amount) {
  const date = new Date(`${day}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return formatDayStamp(date);
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installCopy.textContent =
    "This browser supports install. Use the button below to add Prayer Thread as an app.";
  installButton.classList.remove("is-hidden");
});
