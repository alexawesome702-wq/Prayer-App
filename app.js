const STORAGE_KEY = "prayer-thread-state";
const RECOVERY_KEY = "prayer-thread-recovery";
const THEME_KEY = "prayer-thread-theme";
const ACCENT_KEY = "prayer-thread-accent";
const DEFAULT_ACCENT = "refined-gold";
const DEFAULT_REMINDER_TIME = "22:00";
const PUSH_CONFIG = {
  endpoint: window.PRAYER_PUSH_ENDPOINT || "",
  publicKey: window.PRAYER_VAPID_PUBLIC_KEY || ""
};

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

const recoveryPrayerPrompts = {
  clean: "God, thank You for helping me stay clean today. Keep building discipline and a clean heart in me.",
  urge: "God, I am tempted right now. Help me slow down, leave the situation, and choose freedom over lust.",
  slip: "God, I slipped. I am coming back instead of hiding. Show me what triggered it and help me reset with honesty."
};

const recoveryStatusCopy = {
  clean: "Clean day",
  urge: "Urge won",
  slip: "Slip recorded"
};

const noteTypeCopy = {
  trigger: "Trigger",
  victory: "Victory",
  recovery: "Recovery plan"
};

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

const accentPalettes = [
  {
    id: "celestial-blue",
    label: "Celestial blue",
    hex: "#4A7FA5",
    description: "Calm and clear",
    light: {
      "--accent": "#4A7FA5",
      "--accent-dark": "#244962",
      "--accent-bright": "#8FC1E2",
      "--accent-soft": "rgba(74, 127, 165, 0.18)",
      "--accent-highlight": "rgba(178, 220, 245, 0.38)",
      "--accent-highlight-soft": "rgba(178, 220, 245, 0.24)",
      "--accent-shadow": "rgba(28, 70, 98, 0.24)",
      "--accent-inset": "rgba(203, 234, 250, 0.5)",
      "--accent-focus": "rgba(74, 127, 165, 0.54)",
      "--accent-focus-soft": "rgba(74, 127, 165, 0.13)",
      "--accent-panel-glow": "rgba(74, 127, 165, 0.09)",
      "--accent-backdrop-glow": "rgba(130, 188, 222, 0.38)",
      "--gold": "#6CA1C5",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(178, 220, 245, 0.42), transparent 32%), linear-gradient(145deg, #6EA6CB 0%, #4A7FA5 48%, #244962 100%)",
      "--bubble-text": "#f4fbff"
    },
    dark: {
      "--accent": "#6EA6CB",
      "--accent-dark": "#315D78",
      "--accent-bright": "#A9D5EF",
      "--accent-soft": "rgba(110, 166, 203, 0.2)",
      "--accent-highlight": "rgba(178, 220, 245, 0.24)",
      "--accent-highlight-soft": "rgba(178, 220, 245, 0.16)",
      "--accent-shadow": "rgba(0, 0, 0, 0.34)",
      "--accent-inset": "rgba(203, 234, 250, 0.28)",
      "--accent-focus": "rgba(110, 166, 203, 0.54)",
      "--accent-focus-soft": "rgba(110, 166, 203, 0.16)",
      "--accent-panel-glow": "rgba(110, 166, 203, 0.12)",
      "--accent-backdrop-glow": "rgba(110, 166, 203, 0.12)",
      "--gold": "#7FB4D1",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(178, 220, 245, 0.24), transparent 32%), linear-gradient(145deg, #5F95B7 0%, #3D6F91 50%, #1D4058 100%)",
      "--bubble-text": "#f4fbff"
    }
  },
  {
    id: "sacred-purple",
    label: "Sacred purple",
    hex: "#7B5EA7",
    description: "Royal and reverent",
    light: {
      "--accent": "#7B5EA7",
      "--accent-dark": "#463363",
      "--accent-bright": "#B8A1DF",
      "--accent-soft": "rgba(123, 94, 167, 0.18)",
      "--accent-highlight": "rgba(217, 200, 246, 0.34)",
      "--accent-highlight-soft": "rgba(217, 200, 246, 0.22)",
      "--accent-shadow": "rgba(62, 44, 91, 0.24)",
      "--accent-inset": "rgba(232, 219, 255, 0.46)",
      "--accent-focus": "rgba(123, 94, 167, 0.54)",
      "--accent-focus-soft": "rgba(123, 94, 167, 0.13)",
      "--accent-panel-glow": "rgba(123, 94, 167, 0.09)",
      "--accent-backdrop-glow": "rgba(173, 150, 214, 0.34)",
      "--gold": "#947AC0",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(217, 200, 246, 0.38), transparent 32%), linear-gradient(145deg, #9A7DCA 0%, #7B5EA7 48%, #463363 100%)",
      "--bubble-text": "#fff8ff"
    },
    dark: {
      "--accent": "#9A7DCA",
      "--accent-dark": "#5E4684",
      "--accent-bright": "#CFBDF2",
      "--accent-soft": "rgba(154, 125, 202, 0.2)",
      "--accent-highlight": "rgba(217, 200, 246, 0.22)",
      "--accent-highlight-soft": "rgba(217, 200, 246, 0.15)",
      "--accent-shadow": "rgba(0, 0, 0, 0.34)",
      "--accent-inset": "rgba(232, 219, 255, 0.26)",
      "--accent-focus": "rgba(154, 125, 202, 0.54)",
      "--accent-focus-soft": "rgba(154, 125, 202, 0.16)",
      "--accent-panel-glow": "rgba(154, 125, 202, 0.12)",
      "--accent-backdrop-glow": "rgba(154, 125, 202, 0.12)",
      "--gold": "#AB91D2",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(217, 200, 246, 0.22), transparent 32%), linear-gradient(145deg, #8A6BBC 0%, #644895 50%, #35264F 100%)",
      "--bubble-text": "#fff8ff"
    }
  },
  {
    id: "refined-gold",
    label: "Refined gold",
    hex: "#C49A3C",
    description: "Richer gold",
    light: {
      "--accent": "#C49A3C",
      "--accent-dark": "#704F16",
      "--accent-bright": "#E7C56F",
      "--accent-soft": "rgba(196, 154, 60, 0.18)",
      "--accent-highlight": "rgba(255, 231, 156, 0.34)",
      "--accent-highlight-soft": "rgba(255, 231, 156, 0.24)",
      "--accent-shadow": "rgba(92, 58, 9, 0.24)",
      "--accent-inset": "rgba(255, 235, 171, 0.5)",
      "--accent-focus": "rgba(196, 154, 60, 0.54)",
      "--accent-focus-soft": "rgba(196, 154, 60, 0.13)",
      "--accent-panel-glow": "rgba(196, 154, 60, 0.08)",
      "--accent-backdrop-glow": "rgba(245, 205, 91, 0.42)",
      "--gold": "#D4AA4B",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(255, 231, 156, 0.38), transparent 32%), linear-gradient(145deg, #D3A746 0%, #A97719 50%, #704F16 100%)",
      "--bubble-text": "#fff7ec"
    },
    dark: {
      "--accent": "#D4AA4B",
      "--accent-dark": "#8E671D",
      "--accent-bright": "#F0D27E",
      "--accent-soft": "rgba(212, 170, 75, 0.2)",
      "--accent-highlight": "rgba(255, 231, 156, 0.24)",
      "--accent-highlight-soft": "rgba(255, 231, 156, 0.16)",
      "--accent-shadow": "rgba(0, 0, 0, 0.34)",
      "--accent-inset": "rgba(255, 235, 171, 0.28)",
      "--accent-focus": "rgba(212, 170, 75, 0.54)",
      "--accent-focus-soft": "rgba(212, 170, 75, 0.16)",
      "--accent-panel-glow": "rgba(212, 170, 75, 0.12)",
      "--accent-backdrop-glow": "rgba(212, 170, 75, 0.12)",
      "--gold": "#DDB451",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(255, 231, 156, 0.24), transparent 32%), linear-gradient(145deg, #C9952A 0%, #9A6612 50%, #50330B 100%)",
      "--bubble-text": "#fff7ec"
    }
  },
  {
    id: "earthy-amber",
    label: "Earthy amber",
    hex: "#A0522D",
    description: "Grounded and warm",
    light: {
      "--accent": "#A0522D",
      "--accent-dark": "#63311C",
      "--accent-bright": "#D78A5C",
      "--accent-soft": "rgba(160, 82, 45, 0.18)",
      "--accent-highlight": "rgba(232, 161, 113, 0.34)",
      "--accent-highlight-soft": "rgba(232, 161, 113, 0.22)",
      "--accent-shadow": "rgba(93, 45, 24, 0.24)",
      "--accent-inset": "rgba(255, 202, 160, 0.42)",
      "--accent-focus": "rgba(160, 82, 45, 0.54)",
      "--accent-focus-soft": "rgba(160, 82, 45, 0.13)",
      "--accent-panel-glow": "rgba(160, 82, 45, 0.09)",
      "--accent-backdrop-glow": "rgba(213, 128, 82, 0.34)",
      "--gold": "#B6673C",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(232, 161, 113, 0.38), transparent 32%), linear-gradient(145deg, #C07343 0%, #A0522D 48%, #63311C 100%)",
      "--bubble-text": "#fff7ec"
    },
    dark: {
      "--accent": "#C07343",
      "--accent-dark": "#7D3E24",
      "--accent-bright": "#E6A175",
      "--accent-soft": "rgba(192, 115, 67, 0.2)",
      "--accent-highlight": "rgba(232, 161, 113, 0.22)",
      "--accent-highlight-soft": "rgba(232, 161, 113, 0.15)",
      "--accent-shadow": "rgba(0, 0, 0, 0.34)",
      "--accent-inset": "rgba(255, 202, 160, 0.26)",
      "--accent-focus": "rgba(192, 115, 67, 0.54)",
      "--accent-focus-soft": "rgba(192, 115, 67, 0.16)",
      "--accent-panel-glow": "rgba(192, 115, 67, 0.12)",
      "--accent-backdrop-glow": "rgba(192, 115, 67, 0.12)",
      "--gold": "#C77B50",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(232, 161, 113, 0.22), transparent 32%), linear-gradient(145deg, #B56738 0%, #85401F 50%, #492313 100%)",
      "--bubble-text": "#fff7ec"
    }
  },
  {
    id: "rose-dawn",
    label: "Rose dawn",
    hex: "#C2785A",
    description: "Soft terracotta",
    light: {
      "--accent": "#C2785A",
      "--accent-dark": "#764331",
      "--accent-bright": "#E2AA92",
      "--accent-soft": "rgba(194, 120, 90, 0.18)",
      "--accent-highlight": "rgba(246, 190, 168, 0.32)",
      "--accent-highlight-soft": "rgba(246, 190, 168, 0.21)",
      "--accent-shadow": "rgba(104, 56, 39, 0.22)",
      "--accent-inset": "rgba(255, 218, 202, 0.4)",
      "--accent-focus": "rgba(194, 120, 90, 0.54)",
      "--accent-focus-soft": "rgba(194, 120, 90, 0.13)",
      "--accent-panel-glow": "rgba(194, 120, 90, 0.09)",
      "--accent-backdrop-glow": "rgba(220, 150, 122, 0.32)",
      "--gold": "#CF8B70",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(246, 190, 168, 0.34), transparent 32%), linear-gradient(145deg, #D89272 0%, #B86546 50%, #764331 100%)",
      "--bubble-text": "#fff7ec"
    },
    dark: {
      "--accent": "#D89272",
      "--accent-dark": "#8D5039",
      "--accent-bright": "#F0BFA9",
      "--accent-soft": "rgba(216, 146, 114, 0.2)",
      "--accent-highlight": "rgba(246, 190, 168, 0.22)",
      "--accent-highlight-soft": "rgba(246, 190, 168, 0.15)",
      "--accent-shadow": "rgba(0, 0, 0, 0.34)",
      "--accent-inset": "rgba(255, 218, 202, 0.25)",
      "--accent-focus": "rgba(216, 146, 114, 0.54)",
      "--accent-focus-soft": "rgba(216, 146, 114, 0.16)",
      "--accent-panel-glow": "rgba(216, 146, 114, 0.12)",
      "--accent-backdrop-glow": "rgba(216, 146, 114, 0.12)",
      "--gold": "#E09D7E",
      "--bubble": "radial-gradient(circle at 18% 12%, rgba(246, 190, 168, 0.22), transparent 32%), linear-gradient(145deg, #C77F60 0%, #975239 50%, #522C20 100%)",
      "--bubble-text": "#fff7ec"
    }
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
const accentOptions = document.querySelector("#accentOptions");
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
const recoveryTodayStatus = document.querySelector("#recoveryTodayStatus");
const recoveryStreakValue = document.querySelector("#recoveryStreakValue");
const recoveryStreakLabel = document.querySelector("#recoveryStreakLabel");
const bestRecoveryStreak = document.querySelector("#bestRecoveryStreak");
const cleanMonthCount = document.querySelector("#cleanMonthCount");
const urgesResistedCount = document.querySelector("#urgesResistedCount");
const recoveryActions = document.querySelectorAll("[data-recovery-status]");
const recoveryNoteInput = document.querySelector("#recoveryNoteInput");
const recoveryNoteButtons = document.querySelectorAll("[data-note-type]");
const sosButton = document.querySelector("#sosButton");
const sosFlow = document.querySelector("#sosFlow");
const sosTimer = document.querySelector("#sosTimer");
const sosPrayerButton = document.querySelector("#sosPrayerButton");
const sosCompleteButton = document.querySelector("#sosCompleteButton");
const sosSteps = document.querySelectorAll(".sos-step");
const reminderToggle = document.querySelector("#reminderToggle");
const reminderTimeInput = document.querySelector("#reminderTimeInput");
const reminderStatus = document.querySelector("#reminderStatus");
const requestReminderButton = document.querySelector("#requestReminderButton");
const clearRecoveryButton = document.querySelector("#clearRecoveryButton");

let deferredInstallPrompt = null;
let state = loadState();
let recoveryState = loadRecoveryState();
const today = formatDayStamp(new Date());
state.activeDay = today;
let isNavDragging = false;
let activeNavTarget = "todayPage";
let sosInterval = null;
let sosRemaining = 60;
let reminderInterval = null;

let selectedDate = today;
let calendarCursor = new Date(`${today}T12:00:00`);
calendarCursor.setDate(1);

applyTheme(loadTheme());
renderAll();
configureInstallExperience();
registerServiceWorker();
setupReminderFallback();
openInitialPageFromHash();

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

clearRecoveryButton.addEventListener("click", () => {
  recoveryState = createInitialRecoveryState();
  selectedDate = formatDayStamp(new Date());
  calendarCursor = getMonthCursor(selectedDate);
  persistRecoveryState();
  renderAll();
  setupReminderFallback();
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

reminderToggle.addEventListener("change", () => {
  recoveryState.reminder.enabled = reminderToggle.checked;
  recoveryState.reminder.time = reminderTimeInput.value || DEFAULT_REMINDER_TIME;
  recoveryState.reminder.timezone = getLocalTimezone();
  persistRecoveryState();
  renderReminderSettings();
  setupReminderFallback();
});

reminderTimeInput.addEventListener("change", () => {
  recoveryState.reminder.time = reminderTimeInput.value || DEFAULT_REMINDER_TIME;
  recoveryState.reminder.timezone = getLocalTimezone();
  persistRecoveryState();
  renderReminderSettings();
  setupReminderFallback();
});

requestReminderButton.addEventListener("click", () => {
  requestReminderPermission();
});

recoveryActions.forEach((button) => {
  button.addEventListener("click", () => {
    recordRecoveryStatus(button.dataset.recoveryStatus);
  });
});

recoveryNoteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    addRecoveryNote(button.dataset.noteType);
  });
});

sosButton.addEventListener("click", () => {
  startSosFlow();
});

sosPrayerButton.addEventListener("click", () => {
  prayerInput.value = recoveryPrayerPrompts.urge;
  switchPage("todayPage");
  prayerInput.focus();
});

sosCompleteButton.addEventListener("click", () => {
  completeSosFlow();
});

sosSteps.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-active");
  });
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
  renderAccentOptions();
  renderPromptChips();
  renderDayTabs();
  renderJournal(justSent);
  renderStats();
  renderRecovery();
  renderTodayLabel();
  renderDailyVerse();
  renderCalendar();
  renderReminderSettings();
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

function createInitialRecoveryState() {
  return {
    days: {},
    sosSessions: [],
    reminder: {
      enabled: false,
      time: DEFAULT_REMINDER_TIME,
      timezone: getLocalTimezone(),
      lastNotifiedDay: ""
    }
  };
}

function loadRecoveryState() {
  const fallback = createInitialRecoveryState();

  try {
    const saved = localStorage.getItem(RECOVERY_KEY);
    if (!saved) {
      return fallback;
    }

    return migrateRecoveryState(JSON.parse(saved));
  } catch {
    return fallback;
  }
}

function migrateRecoveryState(saved) {
  const nextState = createInitialRecoveryState();

  if (!saved || typeof saved !== "object") {
    return nextState;
  }

  if (saved.days && typeof saved.days === "object") {
    Object.entries(saved.days).forEach(([day, entry]) => {
      const normalized = normalizeRecoveryDay(entry);
      if (normalized) {
        nextState.days[day] = normalized;
      }
    });
  }

  if (Array.isArray(saved.sosSessions)) {
    nextState.sosSessions = saved.sosSessions
      .filter((session) => session && session.createdAt)
      .map((session) => ({
        createdAt: session.createdAt,
        completed: Boolean(session.completed),
        outcome: session.outcome === "resisted" ? "resisted" : "left_open"
      }));
  }

  if (saved.reminder && typeof saved.reminder === "object") {
    nextState.reminder = {
      enabled: Boolean(saved.reminder.enabled),
      time: typeof saved.reminder.time === "string" ? saved.reminder.time : DEFAULT_REMINDER_TIME,
      timezone: typeof saved.reminder.timezone === "string" ? saved.reminder.timezone : getLocalTimezone(),
      lastNotifiedDay: typeof saved.reminder.lastNotifiedDay === "string" ? saved.reminder.lastNotifiedDay : ""
    };
  }

  return nextState;
}

function normalizeRecoveryDay(entry) {
  if (!entry || typeof entry !== "object") {
    return null;
  }

  const status = ["clean", "urge", "slip"].includes(entry.status) ? entry.status : "";
  const notes = Array.isArray(entry.notes)
    ? entry.notes
        .filter((note) => note && note.text && note.createdAt)
        .map((note) => ({
          type: noteTypeCopy[note.type] ? note.type : "recovery",
          text: String(note.text),
          createdAt: note.createdAt
        }))
    : [];

  if (!status && !notes.length) {
    return null;
  }

  return {
    status,
    urgeCount: Math.max(Number(entry.urgeCount) || 0, status === "urge" ? 1 : 0),
    notes,
    checkedInAt: entry.checkedInAt || ""
  };
}

function persistRecoveryState() {
  localStorage.setItem(RECOVERY_KEY, JSON.stringify(recoveryState));
}

function ensureDay(day) {
  if (!state.days[day]) {
    state.days[day] = [];
  }
}

function ensureRecoveryDay(day) {
  if (!recoveryState.days[day]) {
    recoveryState.days[day] = {
      status: "",
      urgeCount: 0,
      notes: [],
      checkedInAt: ""
    };
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

function renderRecovery() {
  renderRecoveryStats();
  renderRecoveryActions();
  renderRecoveryNoteInput();
}

function renderRecoveryStats() {
  const stats = getRecoveryStats();
  const todayEntry = recoveryState.days[formatDayStamp(new Date())];
  const status = todayEntry?.status || "";

  recoveryTodayStatus.textContent = status ? recoveryStatusCopy[status] : "Not checked in";
  recoveryTodayStatus.dataset.status = status || "none";
  recoveryStreakValue.textContent = String(stats.currentStreak);
  recoveryStreakLabel.textContent = stats.currentStreak === 1 ? "day" : "days";
  bestRecoveryStreak.textContent = String(stats.bestStreak);
  cleanMonthCount.textContent = String(stats.cleanMonthCount);
  urgesResistedCount.textContent = String(stats.urgesResisted);
}

function renderRecoveryActions() {
  const todayEntry = recoveryState.days[formatDayStamp(new Date())];
  const status = todayEntry?.status || "";

  recoveryActions.forEach((button) => {
    const isActive = button.dataset.recoveryStatus === status;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderRecoveryNoteInput() {
  if (!recoveryNoteInput) {
    return;
  }

  const selectedEntry = recoveryState.days[selectedDate];
  const status = selectedEntry?.status;
  if (status === "slip" && !recoveryNoteInput.value) {
    recoveryNoteInput.placeholder = "What triggered the slip? What boundary changes before tonight?";
    return;
  }

  recoveryNoteInput.placeholder = "What happened? What helped? What boundary needs to change?";
}

function recordRecoveryStatus(status) {
  if (!recoveryStatusCopy[status]) {
    return;
  }

  const currentDay = formatDayStamp(new Date());
  ensureRecoveryDay(currentDay);
  const entry = recoveryState.days[currentDay];
  entry.status = status;
  entry.checkedInAt = new Date().toISOString();

  if (status === "urge") {
    entry.urgeCount = Math.max(entry.urgeCount || 0, 1);
  }

  if (status === "slip") {
    prayerInput.value = recoveryPrayerPrompts.slip;
    recoveryNoteInput.value = "";
    recoveryNoteInput.focus();
  }

  selectedDate = currentDay;
  calendarCursor = getMonthCursor(currentDay);
  persistRecoveryState();
  renderAll();
}

function addRecoveryNote(type) {
  const text = recoveryNoteInput.value.trim();
  if (!text) {
    recoveryNoteInput.focus();
    return;
  }

  const day = selectedDate || formatDayStamp(new Date());
  ensureRecoveryDay(day);
  recoveryState.days[day].notes.push({
    type: noteTypeCopy[type] ? type : "recovery",
    text,
    createdAt: new Date().toISOString()
  });

  recoveryNoteInput.value = "";
  persistRecoveryState();
  renderCalendar();
}

function startSosFlow() {
  sosFlow.classList.remove("is-hidden");
  sosRemaining = 60;
  sosTimer.textContent = String(sosRemaining);
  clearInterval(sosInterval);
  sosInterval = setInterval(() => {
    sosRemaining = Math.max(sosRemaining - 1, 0);
    sosTimer.textContent = String(sosRemaining);
    if (sosRemaining === 0) {
      clearInterval(sosInterval);
    }
  }, 1000);
}

function completeSosFlow() {
  clearInterval(sosInterval);
  sosFlow.classList.add("is-hidden");
  const currentDay = formatDayStamp(new Date());
  ensureRecoveryDay(currentDay);
  const entry = recoveryState.days[currentDay];
  if (entry.status !== "slip") {
    entry.status = "urge";
    entry.checkedInAt = new Date().toISOString();
  }
  entry.urgeCount = (entry.urgeCount || 0) + 1;
  recoveryState.sosSessions.push({
    createdAt: new Date().toISOString(),
    completed: true,
    outcome: "resisted"
  });
  selectedDate = currentDay;
  persistRecoveryState();
  renderAll();
}

function getRecoveryStats() {
  const days = Object.keys(recoveryState.days).sort((left, right) => new Date(left) - new Date(right));
  const currentDay = formatDayStamp(new Date());
  const yesterday = shiftDay(currentDay, -1);
  const trackedWins = days.filter((day) => isRecoveryWin(recoveryState.days[day]));
  const mostRecentWin = trackedWins[trackedWins.length - 1];
  let currentStreak = 0;

  if (mostRecentWin === currentDay || mostRecentWin === yesterday) {
    currentStreak = 1;
    for (let index = trackedWins.length - 1; index > 0; index -= 1) {
      if (shiftDay(trackedWins[index], -1) === trackedWins[index - 1]) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  let running = 0;
  let bestStreak = 0;
  days.forEach((day, index) => {
    const previousDay = days[index - 1];
    if (!isRecoveryWin(recoveryState.days[day])) {
      running = 0;
      return;
    }

    running = previousDay && shiftDay(day, -1) === previousDay ? running + 1 : 1;
    bestStreak = Math.max(bestStreak, running);
  });

  const monthCursor = getMonthCursor(currentDay);
  const month = monthCursor.getMonth();
  const year = monthCursor.getFullYear();
  const cleanMonthCount = days.filter((day) => {
    const date = new Date(`${day}T12:00:00`);
    return date.getMonth() === month && date.getFullYear() === year && isRecoveryWin(recoveryState.days[day]);
  }).length;

  const urgesResisted = Object.values(recoveryState.days).reduce(
    (count, entry) => count + Math.max(Number(entry.urgeCount) || 0, 0),
    0
  );

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    cleanMonthCount,
    urgesResisted
  };
}

function isRecoveryWin(entry) {
  return entry?.status === "clean" || entry?.status === "urge";
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
    const recoveryEntry = recoveryState.days[stamp];
    const recoveryStatus = recoveryEntry?.status || "";
    const messages = state.days[stamp] || [];
    const button = document.createElement("button");
    button.className = [
      "calendar-day",
      recoveryStatus ? `recovery-${recoveryStatus}` : "",
      messages.length ? "has-prayer" : "",
      stamp === formatDayStamp(new Date()) ? "is-today" : "",
      stamp === selectedDate ? "is-selected" : ""
    ]
      .filter(Boolean)
      .join(" ");
    const labelStatus = recoveryStatus ? recoveryStatusCopy[recoveryStatus] : "No recovery check-in";
    const prayerStatus = `${messages.length} ${messages.length === 1 ? "prayer" : "prayers"}`;
    button.type = "button";
    button.setAttribute("aria-label", `${formatLongDay(stamp)}, ${labelStatus}, ${prayerStatus}`);
    button.innerHTML = `
      <span class="calendar-day-number">${dayNumber}</span>
      <span class="calendar-day-markers" aria-hidden="true">
        ${recoveryStatus ? `<i class="calendar-status-dot ${recoveryStatus}"></i>` : ""}
        ${messages.length ? `<span class="calendar-prayer-count">${messages.length}</span>` : ""}
      </span>
    `;
    button.addEventListener("click", () => {
      selectedDate = stamp;
      renderCalendar();
      renderRecoveryNoteInput();
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
  const recoveryEntry = recoveryState.days[selectedDate];
  const messages = state.days[selectedDate] || [];

  if (!recoveryEntry && !messages.length) {
    const empty = document.createElement("div");
    empty.className = "entry-preview";
    empty.innerHTML = `<p>No recovery check-in or prayer entry for ${formatDayTitle(selectedDate)} yet.</p>`;
    selectedDayEntries.appendChild(empty);
    return;
  }

  if (recoveryEntry) {
    const summary = document.createElement("article");
    summary.className = `entry-preview recovery-preview recovery-${recoveryEntry.status || "none"}`;
    const status = recoveryEntry.status ? recoveryStatusCopy[recoveryEntry.status] : "Notes only";
    summary.innerHTML = `
      <p><strong>${status}</strong>${recoveryEntry.urgeCount ? ` · ${recoveryEntry.urgeCount} urge${recoveryEntry.urgeCount === 1 ? "" : "s"} resisted` : ""}</p>
      ${recoveryEntry.checkedInAt ? `<time>${formatTimestamp(recoveryEntry.checkedInAt)}</time>` : ""}
    `;
    selectedDayEntries.appendChild(summary);

    recoveryEntry.notes.forEach((note) => {
      const preview = document.createElement("article");
      preview.className = "entry-preview";
      const text = document.createElement("p");
      const time = document.createElement("time");
      text.textContent = `${noteTypeCopy[note.type]}: ${truncateText(note.text, 120)}`;
      time.textContent = formatTimestamp(note.createdAt);
      preview.append(text, time);
      selectedDayEntries.appendChild(preview);
    });
  }

  messages.forEach((message) => {
    const preview = document.createElement("article");
    preview.className = "entry-preview";
    const text = document.createElement("p");
    const time = document.createElement("time");
    text.textContent = `Prayer: ${truncateText(message.text, 105)}`;
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

function renderReminderSettings() {
  if (!reminderToggle || !reminderTimeInput || !reminderStatus) {
    return;
  }

  reminderToggle.checked = Boolean(recoveryState.reminder.enabled);
  reminderTimeInput.value = recoveryState.reminder.time || DEFAULT_REMINDER_TIME;
  reminderStatus.textContent = getReminderStatusText();
}

function getReminderStatusText() {
  if (!recoveryState.reminder.enabled) {
    return `Reminders are off. Default check-in time is ${formatReminderTime(
      recoveryState.reminder.time || DEFAULT_REMINDER_TIME
    )}.`;
  }

  if (!("Notification" in window)) {
    return "This browser does not support notifications. The reminder can only appear while the app is open.";
  }

  if (Notification.permission === "denied") {
    return "Notifications are blocked. Turn them back on in browser settings to receive check-in reminders.";
  }

  if (Notification.permission !== "granted") {
    return `Reminder set for ${formatReminderTime(recoveryState.reminder.time)}. Tap Allow to enable notifications.`;
  }

  if (!PUSH_CONFIG.endpoint || !PUSH_CONFIG.publicKey) {
    return `Reminder set for ${formatReminderTime(
      recoveryState.reminder.time
    )}. App-side notifications are allowed; reliable closed-app push needs backend config.`;
  }

  return `Reliable bedtime push is enabled for ${formatReminderTime(recoveryState.reminder.time)}.`;
}

async function requestReminderPermission() {
  recoveryState.reminder.enabled = true;
  recoveryState.reminder.time = reminderTimeInput.value || DEFAULT_REMINDER_TIME;
  recoveryState.reminder.timezone = getLocalTimezone();

  if (!("Notification" in window)) {
    persistRecoveryState();
    renderReminderSettings();
    setupReminderFallback();
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    await registerPushSubscription();
  }

  persistRecoveryState();
  renderReminderSettings();
  setupReminderFallback();
}

async function registerPushSubscription() {
  if (!PUSH_CONFIG.endpoint || !PUSH_CONFIG.publicKey || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription =
      (await registration.pushManager.getSubscription()) ||
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUSH_CONFIG.publicKey)
      }));

    await fetch(PUSH_CONFIG.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        subscription,
        reminderTime: recoveryState.reminder.time,
        timezone: recoveryState.reminder.timezone
      })
    });
  } catch {
    reminderStatus.textContent =
      "Notification permission is allowed, but push registration failed. The app will still remind you while open.";
  }
}

function setupReminderFallback() {
  clearInterval(reminderInterval);
  if (!recoveryState.reminder.enabled) {
    return;
  }

  maybeSendInAppReminder();
  reminderInterval = setInterval(maybeSendInAppReminder, 60000);
}

async function maybeSendInAppReminder() {
  if (!recoveryState.reminder.enabled) {
    return;
  }

  const currentDay = formatDayStamp(new Date());
  if (recoveryState.reminder.lastNotifiedDay === currentDay || recoveryState.days[currentDay]?.status) {
    return;
  }

  if (!isPastReminderTime(recoveryState.reminder.time || DEFAULT_REMINDER_TIME)) {
    return;
  }

  recoveryState.reminder.lastNotifiedDay = currentDay;
  persistRecoveryState();

  if (!("Notification" in window) || Notification.permission !== "granted") {
    renderReminderSettings();
    return;
  }

  const title = "Time to check in";
  const options = {
    body: "Be honest, reset if needed, and finish the day with God.",
    tag: "bedtime-check-in",
    data: {
      url: "./index.html#recovery"
    }
  };

  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, options);
      return;
    }

    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
      switchPage("recoveryPage");
    };
  } catch {
    renderReminderSettings();
  }
}

function isPastReminderTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const reminder = new Date();
  reminder.setHours(Number.isFinite(hours) ? hours : 22, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return now >= reminder;
}

function formatReminderTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(Number.isFinite(hours) ? hours : 22, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function getLocalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "local";
}

function urlBase64ToUint8Array(value) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = `${value}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((character) => character.charCodeAt(0)));
}

function renderAccentOptions() {
  if (!accentOptions) {
    return;
  }

  const activeAccent = loadAccent();
  accentOptions.innerHTML = "";

  accentPalettes.forEach((palette) => {
    const button = document.createElement("button");
    const isActive = palette.id === activeAccent;
    button.className = `accent-choice${isActive ? " is-active" : ""}`;
    button.type = "button";
    button.role = "radio";
    button.dataset.accent = palette.id;
    button.setAttribute("aria-checked", String(isActive));
    button.setAttribute("aria-label", `${palette.label}, ${palette.description}`);
    button.style.setProperty("--swatch", palette.hex);
    button.innerHTML = `
      <span class="accent-swatch" aria-hidden="true"></span>
      <span class="accent-copy">
        <strong>${palette.label}</strong>
        <small>${palette.description}</small>
      </span>
    `;
    button.addEventListener("click", () => {
      setAccent(palette.id);
    });
    accentOptions.appendChild(button);
  });
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
  applyAccent(loadAccent());
}

function loadAccent() {
  const savedAccent = localStorage.getItem(ACCENT_KEY);
  return getAccentPalette(savedAccent).id;
}

function setAccent(accentId) {
  const palette = getAccentPalette(accentId);
  localStorage.setItem(ACCENT_KEY, palette.id);
  applyAccent(palette.id);
}

function applyAccent(accentId) {
  const palette = getAccentPalette(accentId);
  const theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const variables = palette[theme];

  Object.entries(variables).forEach(([property, value]) => {
    document.documentElement.style.setProperty(property, value);
  });

  document.documentElement.setAttribute("data-accent", palette.id);

  if (accentOptions?.children.length) {
    Array.from(accentOptions.children).forEach((button) => {
      const isActive = button.dataset.accent === palette.id;
      button.classList.toggle("is-active", Boolean(isActive));
      button.setAttribute("aria-checked", String(Boolean(isActive)));
    });
  }
}

function getAccentPalette(accentId) {
  return accentPalettes.find((palette) => palette.id === accentId) || accentPalettes.find((palette) => palette.id === DEFAULT_ACCENT);
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

function openInitialPageFromHash() {
  if (window.location.hash === "#recovery") {
    switchPage("recoveryPage");
    return;
  }

  if (window.location.hash === "#calendar") {
    switchPage("calendarPage");
  }
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
