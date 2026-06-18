const STORAGE_KEY = "prayer-thread-state";
const THEME_KEY = "prayer-thread-theme";

const quickPrompts = [
  "God, thank You for staying close even when life feels noisy.",
  "I need peace about what comes next.",
  "Help me forgive the person I keep replaying in my mind.",
  "Thank You for one good thing from today.",
  "Give me courage to be steady and kind today."
];

const reflections = [
  "Start with honesty. Prayer does not need polished words.",
  "If you do not know what to say, begin with one true sentence.",
  "Thank God for one specific thing from today before asking for anything else.",
  "If your mind is loud, write the prayer exactly as it feels."
];

const dailyVerses = [
  {
    text: "Be still, and know that I am God.",
    reference: "Psalm 46:10"
  },
  {
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1"
  },
  {
    text: "I will fear no evil: for thou art with me.",
    reference: "Psalm 23:4"
  },
  {
    text: "The Lord is my light and my salvation; whom shall I fear?",
    reference: "Psalm 27:1"
  },
  {
    text: "Commit thy way unto the Lord; trust also in him.",
    reference: "Psalm 37:5"
  },
  {
    text: "Create in me a clean heart, O God.",
    reference: "Psalm 51:10"
  },
  {
    text: "When I am afraid, I will trust in thee.",
    reference: "Psalm 56:3"
  },
  {
    text: "Thy word is a lamp unto my feet.",
    reference: "Psalm 119:105"
  },
  {
    text: "Trust in the Lord with all thine heart.",
    reference: "Proverbs 3:5"
  },
  {
    text: "The Lord bless thee, and keep thee.",
    reference: "Numbers 6:24"
  },
  {
    text: "With God all things are possible.",
    reference: "Matthew 19:26"
  },
  {
    text: "I can do all things through Christ which strengtheneth me.",
    reference: "Philippians 4:13"
  },
  {
    text: "Pray without ceasing.",
    reference: "1 Thessalonians 5:17"
  },
  {
    text: "Cast all your care upon him; for he careth for you.",
    reference: "1 Peter 5:7"
  }
];

const thread = document.querySelector("#thread");
const composer = document.querySelector("#composer");
const prayerInput = document.querySelector("#prayerInput");
const promptChips = document.querySelector("#promptChips");
const dayTabs = document.querySelector("#dayTabs");
const streakValue = document.querySelector("#streakValue");
const streakCopy = document.querySelector(".streak-copy");
const totalValue = document.querySelector("#totalValue");
const reflectionText = document.querySelector("#reflectionText");
const todayDateLabel = document.querySelector("#todayDateLabel");
const journalTitle = document.querySelector("#journalTitle");
const archiveDateLabel = document.querySelector("#archiveDateLabel");
const composerDateLabel = document.querySelector("#composerDateLabel");
const clearButton = document.querySelector("#clearButton");
const helperText = document.querySelector("#helperText");
const archiveEntries = document.querySelector("#archiveEntries");
const openArchiveDayButton = document.querySelector("#openArchiveDayButton");
const messageTemplate = document.querySelector("#messageTemplate");
const installButton = document.querySelector("#installButton");
const installCopy = document.querySelector("#installCopy");
const themeToggle = document.querySelector("#themeToggle");
const bottomNav = document.querySelector("#bottomNav");
const navButtons = document.querySelectorAll(".nav-button");
const pages = document.querySelectorAll(".app-page");
const calendarMonthLabel = document.querySelector("#calendarMonthLabel");
const calendarGrid = document.querySelector("#calendarGrid");
const prevMonthButton = document.querySelector("#prevMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");
const selectedDateLabel = document.querySelector("#selectedDateLabel");
const selectedDayEntries = document.querySelector("#selectedDayEntries");
const openSelectedDayButton = document.querySelector("#openSelectedDayButton");
const dailyVerseText = document.querySelector("#dailyVerseText");
const dailyVerseReference = document.querySelector("#dailyVerseReference");

let deferredInstallPrompt = null;
let state = loadState();
const today = formatDayStamp(new Date());
state.activeDay = today;
let isNavDragging = false;
let activeNavTarget = "todayPage";

let selectedDate = today;
let calendarCursor = new Date(`${today}T12:00:00`);
calendarCursor.setDate(1);

applyTheme(loadTheme());
renderAll();
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

  const currentDay = formatDayStamp(new Date());
  ensureDay(currentDay);
  state.activeDay = currentDay;
  selectedDate = currentDay;
  calendarCursor = getMonthCursor(currentDay);
  state.days[currentDay].push({
    text: prayer,
    createdAt: new Date().toISOString()
  });

  persistState();
  renderAll(true);
  composer.reset();
  prayerInput.focus();
});

clearButton.addEventListener("click", () => {
  state = createInitialState();
  selectedDate = formatDayStamp(new Date());
  calendarCursor = getMonthCursor(selectedDate);
  persistState();
  renderAll();
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
  setTheme(themeToggle.checked ? "dark" : "light");
});

openSelectedDayButton.addEventListener("click", () => {
  state.activeDay = selectedDate;
  persistState();
  renderJournal();
  switchPage("todayPage");
});

openArchiveDayButton.addEventListener("click", () => {
  switchPage("todayPage");
  prayerInput.focus();
});

prevMonthButton.addEventListener("click", () => {
  calendarCursor.setMonth(calendarCursor.getMonth() - 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  calendarCursor.setMonth(calendarCursor.getMonth() + 1);
  renderCalendar();
});

navButtons.forEach((button) => {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    isNavDragging = true;
    switchToNavButton(button);
  });

  button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    isNavDragging = true;
    switchToNavButton(button);
  }, { passive: false });

  button.addEventListener("click", () => {
    switchToNavButton(button);
  });
});

bottomNav.addEventListener("pointerdown", handleNavPointerDown);
bottomNav.addEventListener("pointermove", handleNavPointerMove);
bottomNav.addEventListener("pointerup", handleNavPointerUp);
bottomNav.addEventListener("pointercancel", handleNavPointerUp);
bottomNav.addEventListener("touchstart", handleNavTouchMove, { passive: false });
bottomNav.addEventListener("touchmove", handleNavTouchMove, { passive: false });
bottomNav.addEventListener("touchend", handleNavPointerUp, { passive: true });
bottomNav.addEventListener("touchcancel", handleNavPointerUp, { passive: true });

function renderAll(justSent = false) {
  renderPromptChips();
  renderDayTabs();
  renderJournal(justSent);
  renderStats();
  renderTodayLabel();
  renderDailyVerse();
  renderCalendar();
}

function createInitialState() {
  return {
    days: {},
    activeDay: formatDayStamp(new Date())
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
    nextState.activeDay = nextState.days[saved.activeDay] ? saved.activeDay : nextState.activeDay;
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
      .map((message) => ({
        text: message.text,
        createdAt: message.createdAt
      }))
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

function getSortedDays(days = state.days) {
  return Object.keys(days).sort((left, right) => new Date(right) - new Date(left));
}

function getJournalDays() {
  return Array.from(new Set([formatDayStamp(new Date()), state.activeDay, ...getSortedDays()]));
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
      switchPage("todayPage");
      prayerInput.focus();
    });
    promptChips.appendChild(button);
  });
}

function renderDayTabs() {
  dayTabs.innerHTML = "";

  getJournalDays().forEach((day) => {
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
    selectedDate = day;
    calendarCursor = getMonthCursor(day);
    persistState();
    renderDayTabs();
    renderJournal();
    renderCalendar();
    renderArchiveEntries();
  });
  return button;
}

function renderJournal(justSent = false) {
  journalTitle.textContent = formatDayTitle(state.activeDay);
  archiveDateLabel.textContent = formatLongDay(state.activeDay);
  composerDateLabel.textContent = state.activeDay === formatDayStamp(new Date()) ? "Today" : formatLongDay(state.activeDay);
  renderThread();
  renderReflection(justSent);
  renderHelperText();
  renderArchiveEntries();
}

function renderThread() {
  thread.innerHTML = "";
  const messages = getActiveMessages();

  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const isToday = state.activeDay === formatDayStamp(new Date());
    empty.innerHTML = isToday
      ? `<div>
          <svg class="empty-spark" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 3.5c1.8 6.4 4.1 8.7 12.5 12.5C20.1 19.8 17.8 22.1 16 28.5 14.2 22.1 11.9 19.8 3.5 16 11.9 12.2 14.2 9.9 16 3.5Z" />
          </svg>
        </div>`
      : `<div><p>No entry for ${formatDayTitle(state.activeDay)}.</p></div>`;
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
  if (!streakValue && !totalValue) {
    return;
  }

  const streak = calculateStreak();
  if (streakValue) {
    streakValue.textContent = String(streak);
  }

  if (streakCopy) {
    streakCopy.textContent = `${streak === 1 ? "day" : "days"} streak`;
  }

  if (totalValue) {
    totalValue.textContent = String(getTotalPrayerCount());
  }
}

function renderReflection(justSent = false) {
  const currentCount = getActiveMessages().length;
  const index = justSent ? currentCount % reflections.length : 0;
  reflectionText.textContent = reflections[index];
}

function renderTodayLabel() {
  todayDateLabel.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(new Date());
}

function renderDailyVerse() {
  if (!dailyVerseText || !dailyVerseReference) {
    return;
  }

  const dayNumber = Math.floor(new Date(`${formatDayStamp(new Date())}T12:00:00`).getTime() / 86400000);
  const verse = dailyVerses[dayNumber % dailyVerses.length];
  dailyVerseText.textContent = verse.text;
  dailyVerseReference.textContent = verse.reference;
}

function renderHelperText() {
  const currentDay = formatDayStamp(new Date());
  helperText.textContent =
    state.activeDay === currentDay
      ? "Today writes to a fresh page."
      : `Viewing ${formatLongDay(state.activeDay)}. New prayers save to today.`;
}

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarMonthLabel.textContent = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric"
  }).format(firstDay);

  calendarGrid.innerHTML = "";

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    const spacer = document.createElement("div");
    spacer.className = "calendar-empty";
    calendarGrid.appendChild(spacer);
  }

  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber += 1) {
    const date = new Date(year, month, dayNumber);
    const stamp = formatDayStamp(date);
    const messages = state.days[stamp] || [];
    const button = document.createElement("button");
    button.className = [
      "calendar-day",
      messages.length ? "has-entry" : "",
      stamp === formatDayStamp(new Date()) ? "is-today" : "",
      stamp === selectedDate ? "is-selected" : ""
    ]
      .filter(Boolean)
      .join(" ");
    button.type = "button";
    button.setAttribute("aria-label", `${formatLongDay(stamp)}, ${formatDaySubtitle(stamp)}`);
    button.innerHTML = `
      <span class="calendar-day-number">${dayNumber}</span>
      ${messages.length ? `<span class="calendar-entry-count">${messages.length}</span>` : ""}
    `;
    button.addEventListener("click", () => {
      selectedDate = stamp;
      state.activeDay = stamp;
      persistState();
      renderDayTabs();
      renderJournal();
      renderCalendar();
    });
    calendarGrid.appendChild(button);
  }

  renderSelectedDayEntries();
}

function renderArchiveEntries() {
  archiveEntries.innerHTML = "";
  const messages = getActiveMessages();

  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "entry-preview";
    empty.innerHTML = `<p>No entry for ${formatDayTitle(state.activeDay)} yet.</p>`;
    archiveEntries.appendChild(empty);
    return;
  }

  messages.forEach((message) => {
    const preview = document.createElement("article");
    preview.className = "entry-preview";
    const text = document.createElement("p");
    const time = document.createElement("time");
    text.textContent = truncateText(message.text, 120);
    time.textContent = formatTimestamp(message.createdAt);
    preview.append(text, time);
    archiveEntries.appendChild(preview);
  });
}

function renderSelectedDayEntries() {
  selectedDateLabel.textContent = formatDayTitle(selectedDate);
  selectedDayEntries.innerHTML = "";
  const messages = state.days[selectedDate] || [];

  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "entry-preview";
    empty.innerHTML = `<p>No entry for ${formatDayTitle(selectedDate)} yet.</p>`;
    selectedDayEntries.appendChild(empty);
    return;
  }

  messages.forEach((message) => {
    const preview = document.createElement("article");
    preview.className = "entry-preview";
    const text = document.createElement("p");
    const time = document.createElement("time");
    text.textContent = truncateText(message.text, 110);
    time.textContent = formatTimestamp(message.createdAt);
    preview.append(text, time);
    selectedDayEntries.appendChild(preview);
  });
}

function getTotalPrayerCount() {
  return Object.values(state.days).reduce((count, messages) => count + messages.length, 0);
}

function calculateStreak() {
  const days = getSortedDays().sort((left, right) => new Date(left) - new Date(right));
  if (!days.length) {
    return 0;
  }

  const currentDay = formatDayStamp(new Date());
  const yesterday = shiftDay(currentDay, -1);
  const mostRecent = days[days.length - 1];

  if (mostRecent !== currentDay && mostRecent !== yesterday) {
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
    installCopy.textContent = "Installed. Launch Prayer Thread from your home screen.";
    installButton.classList.add("is-hidden");
    return;
  }

  if (isIos) {
    installCopy.textContent = "Open in Safari, tap Share, then Add to Home Screen.";
    installButton.classList.add("is-hidden");
    return;
  }

  installCopy.textContent = "Open this in Chrome or Edge and use Install app when it appears.";
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme) {
  applyTheme(theme);
  localStorage.setItem(THEME_KEY, theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.checked = theme === "dark";
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", theme === "dark" ? "#24170e" : "#f6e2c9");
}

function setActiveNav(pageId) {
  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.target === pageId);
  });
  const index = Array.from(navButtons).findIndex((button) => button.dataset.target === pageId);
  bottomNav.style.setProperty("--active-index", String(Math.max(index, 0)));
}

function handleNavPointerDown(event) {
  event.preventDefault();
  isNavDragging = true;
  bottomNav.classList.add("is-dragging");
  switchToNavButtonAtPoint(event.clientX);
}

function handleNavPointerMove(event) {
  if (!isNavDragging) {
    return;
  }

  event.preventDefault();
  switchToNavButtonAtPoint(event.clientX);
}

function handleNavPointerUp(event) {
  if (!isNavDragging) {
    return;
  }

  isNavDragging = false;
  bottomNav.classList.remove("is-dragging");
}

function handleNavTouchMove(event) {
  const touch = event.touches[0];
  if (!touch) {
    return;
  }

  event.preventDefault();
  isNavDragging = true;
  bottomNav.classList.add("is-dragging");
  switchToNavButtonAtPoint(touch.clientX);
}

function switchToNavButtonAtPoint(x) {
  const rect = bottomNav.getBoundingClientRect();
  const progress = (x - rect.left) / rect.width;
  const index = clamp(Math.floor(progress * navButtons.length), 0, navButtons.length - 1);
  const button = navButtons[index];
  if (!button) {
    return;
  }

  switchToNavButton(button);
}

function switchToNavButton(button) {
  if (!button?.dataset.target) {
    return;
  }

  switchPage(button.dataset.target);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function switchPage(pageId) {
  if (activeNavTarget === pageId) {
    return;
  }

  activeNavTarget = pageId;
  pages.forEach((page) => {
    page.classList.toggle("is-active", page.id === pageId);
  });
  document.querySelector(`#${pageId}`).scrollTop = 0;
  setActiveNav(pageId);
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
  const currentDay = formatDayStamp(new Date());
  const yesterday = shiftDay(currentDay, -1);

  if (day === currentDay) {
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
  return `${messages.length} ${messages.length === 1 ? "entry" : "entries"}`;
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

function getMonthCursor(day) {
  const date = new Date(`${day}T12:00:00`);
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftDay(day, amount) {
  const date = new Date(`${day}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return formatDayStamp(date);
}

function truncateText(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installCopy.textContent = "This browser supports install. Use the button to add Prayer Thread.";
  installButton.classList.remove("is-hidden");
});
