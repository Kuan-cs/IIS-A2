const $ = id => document.getElementById(id);

const defaultPreferences = Object.fromEntries(
    categories.map(c => [c, 50])
);

const defaultLocks = Object.fromEntries(
    categories.map(c => [c, false])
);

const categoryIcons = {
    Travel: "🌍",
    Pets: "🐾",
    Music: "🎵",
    Food: "🍴",
    Sports: "⚽",
    Technology: "💻",
    Gaming: "🎮",
    Fashion: "👕"
};

const storageKey = "social-feed-profile-v5";
const previousStorageKey = "social-feed-profile-v4";
const oldStorageKey = "social-feed-profile-v3";

const batchSize = 5;
const readingDuration = 15000;
const cooldownDuration = 60000;

const openingReward = 10;
const readingReward = 5;
const returnOpeningReward = 3;
const returnReadingReward = 2;
const feedbackAmount = 20;

let preferences = { ...defaultPreferences };
let locks = { ...defaultLocks };
let history = [];
let displayedPosts = [];
let visits = {};

let autoInference = true;
let currentVisit = null;
let readingTimer = null;
let messageTimer = null;
let loading = false;
let instanceId = 0;
let activeBreakdown = null;

const feed = $("feed");
const detail = $("post-detail");
const preferenceDetail = $("preference-detail");

function clamp(value) {
    return Math.max(0, Math.min(100, Math.round(value)));
}

function activeCategories() {
    return categories.filter(c => preferences[c] > 0);
}

function latestChange(category) {
    for (let i = history.length - 1; i >= 0; i--) {
        if (
            history[i].category === category &&
            !history[i].undone
        ) {
            return history[i];
        }
    }

    return undefined;
}

function latestDelta(category) {
    const entry = latestChange(category);

    return entry ? entry.after - entry.before : 0;
}