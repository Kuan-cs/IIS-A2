
const posts = [
    { id: 1, category: "Travel", title: "Beautiful Places Around the World", description: "Discover interesting destinations and travel experiences.", image: "🌍" },
    { id: 2, category: "Pets", title: "Funny Cat Moments", description: "A collection of funny and adorable cat videos.", image: "🐱" },
    { id: 3, category: "Music", title: "New Music Discoveries", description: "Explore popular songs and new artists.", image: "🎵" },
    { id: 4, category: "Food", title: "Easy Cooking Ideas", description: "Simple recipes and delicious meals to try.", image: "🍜" },
    { id: 5, category: "Sports", title: "Exciting Sports Highlights", description: "Watch memorable moments from different sports.", image: "⚽" },
    { id: 6, category: "Travel", title: "A Weekend in the Mountains", description: "Enjoy beautiful mountain views and outdoor adventures.", image: "🏔️" },
    { id: 7, category: "Pets", title: "Dogs Learning New Tricks", description: "Watch clever dogs practise entertaining tricks.", image: "🐶" },
    { id: 8, category: "Music", title: "Relaxing Music Playlist", description: "Find relaxing music for studying and everyday life.", image: "🎧" },
    { id: 9, category: "Food", title: "Street Food Around the World", description: "Explore different street food cultures.", image: "🍔" },
    { id: 10, category: "Sports", title: "Amazing Basketball Moments", description: "Enjoy exciting basketball highlights.", image: "🏀" },
    { id: 11, category: "Travel", title: "Exploring Ancient Cities", description: "Discover historical buildings and interesting cultures.", image: "🏛️" },
    { id: 12, category: "Pets", title: "Playful Puppies", description: "Enjoy some adorable moments with playful puppies.", image: "🐕" },
    { id: 13, category: "Music", title: "Live Concert Experience", description: "Explore unforgettable moments from live performances.", image: "🎸" },
    { id: 14, category: "Food", title: "Homemade Pizza", description: "Learn simple ways to prepare delicious homemade pizza.", image: "🍕" },
    { id: 15, category: "Sports", title: "Tennis Highlights", description: "Watch exciting moments from professional tennis.", image: "🎾" },
    { id: 16, category: "Travel", title: "Relaxing Beach Destinations", description: "Explore beautiful beaches and coastal scenery.", image: "🏖️" },
    { id: 17, category: "Pets", title: "Cute Animal Videos", description: "Watch funny and heartwarming animal moments.", image: "🐰" },
    { id: 18, category: "Music", title: "Discover Jazz Music", description: "Listen to interesting jazz performances and artists.", image: "🎷" },
    { id: 19, category: "Food", title: "Delicious Desserts", description: "Discover creative desserts and sweet treats.", image: "🍰" },
    { id: 20, category: "Sports", title: "Cycling Adventures", description: "Explore interesting cycling routes and sporting events.", image: "🚴" }
];

const categories = ["Travel", "Pets", "Music", "Food", "Sports"];

const defaultPreferences = {
    Travel: 50,
    Pets: 50,
    Music: 50,
    Food: 50,
    Sports: 50
};

let preferences = { ...defaultPreferences };
let displayedPosts = [];
let loading = false;
let messageTimeout;
let postInstanceId = 0;
let observer;

const batchSize = 5;

const feedElement = document.getElementById("feed");
const preferencesElement = document.getElementById("preferences");
const messageElement = document.getElementById("message");
const loadTrigger = document.getElementById("load-trigger");
const loadingStatus = document.getElementById("loading-status");

function hasActivePreferences() {
    return categories.some(category => preferences[category] > 0);
}

function getRecommendationReason(category) {
    const score = preferences[category];

    if (score === 0) {
        return `You have turned off new ${category.toLowerCase()} recommendations.`;
    }

    if (score > 50) {
        return `Your preference for ${category.toLowerCase()} content is currently ${score} out of 100.`;
    }

    if (score < 50) {
        return `Your preference for ${category.toLowerCase()} content is currently ${score} out of 100.`;
    }

    return `This ${category.toLowerCase()} post is recommended based on your general content interests.`;
}

function choosePost(excludedIds) {
    const activePosts = posts.filter(post =>
        preferences[post.category] > 0
    );

    if (activePosts.length === 0) {
        return null;
    }

    let candidates = activePosts.filter(post =>
        !excludedIds.includes(post.id)
    );

    if (candidates.length === 0) {
        const lastPostId = displayedPosts.length > 0
            ? displayedPosts[displayedPosts.length - 1].id
            : null;

        candidates = activePosts.filter(post =>
            post.id !== lastPostId
        );
    }

    if (candidates.length === 0) {
        candidates = activePosts;
    }

    const weightedPosts = candidates.map(post => ({
        post,
        weight: preferences[post.category]
    }));

    const totalWeight = weightedPosts.reduce(
        (sum, item) => sum + item.weight, 0
    );

    let randomValue = Math.random() * totalWeight;

    for (const item of weightedPosts) {
        randomValue -= item.weight;

        if (randomValue < 0) {
            return item.post;
        }
    }

    return weightedPosts[weightedPosts.length - 1].post;
}

function generateBatch() {
    const selectedPosts = [];
    const excludedIds = displayedPosts.slice(-5).map(post => post.id);

    for (let i = 0; i < batchSize; i++) {
        const post = choosePost(excludedIds);

        if (!post) {
            break;
        }

        selectedPosts.push(post);
        excludedIds.push(post.id);
    }

    return selectedPosts;
}

function createPostElement(post) {
    const article = document.createElement("article");
    article.className = "post";

    postInstanceId++;

    const uniqueMenuId = `menu-${postInstanceId}`;

    article.innerHTML = `
        <div class="post-header">
            <span class="post-category">${post.category}</span>
            <button class="menu-btn" type="button" aria-expanded="false" aria-controls="${uniqueMenuId}">
                Why this content?
            </button>
        </div>
        <div class="post-image">${post.image}</div>
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div class="post-menu" id="${uniqueMenuId}" hidden>
            <strong>Why was this recommended?</strong>
            <p class="reason-text"></p>
            <div class="menu-actions">
                <button class="more-btn" type="button">More like this</button>
                <button class="fewer-btn" type="button">Show fewer like this</button>
            </div>
        </div>
    `;

    const menuButton = article.querySelector(".menu-btn");
    const menu = article.querySelector(".post-menu");
    const reasonText = article.querySelector(".reason-text");

    menuButton.addEventListener("click", () => {
        menu.hidden = !menu.hidden;
        menuButton.setAttribute("aria-expanded", String(!menu.hidden));

        if (!menu.hidden) {
            reasonText.textContent = getRecommendationReason(post.category);
        }
    });

    article.querySelector(".more-btn").addEventListener("click", () => {
        updatePreference(post.category, preferences[post.category] + 20);
    });

    article.querySelector(".fewer-btn").addEventListener("click", () => {
        updatePreference(post.category, preferences[post.category] - 20);
    });

    return article;
}

function loadMorePosts() {
    if (loading) {
        return;
    }

    if (!hasActivePreferences()) {
        loadingStatus.textContent = "No categories selected. Increase a preference to continue browsing.";
        return;
    }

    loading = true;
    loadingStatus.textContent = "Loading recommendations...";

    const newPosts = generateBatch();

    newPosts.forEach(post => {
        const article = createPostElement(post);
        feedElement.appendChild(article);
        displayedPosts.push(post);
    });

    loading = false;
    loadingStatus.textContent = "";
}

function renderPreferences() {
    preferencesElement.innerHTML = "";

    categories.forEach(category => {
        const score = preferences[category];
        const item = document.createElement("div");

        item.className = "preference-item";

        item.innerHTML = `
            <div class="preference-label">
                <label for="preference-${category}">${category}</label>
                <span class="preference-value">${score}</span>
            </div>
            <input
                type="range"
                id="preference-${category}"
                class="preference-slider"
                min="0"
                max="100"
                step="1"
                value="${score}"
            >
            <div class="preference-scale">
                <span>0</span>
                <span>100</span>
            </div>
        `;

        const slider = item.querySelector(".preference-slider");
        const valueElement = item.querySelector(".preference-value");

        slider.addEventListener("input", () => {
            const newValue = Number(slider.value);
            preferences[category] = newValue;
            valueElement.textContent = newValue;
            updateSliderFill(slider);
            updateLoadingState();
        });

        slider.addEventListener("change", () => {
            showMessage(`${category} preference set to ${preferences[category]}.`);
        });

        updateSliderFill(slider);
        preferencesElement.appendChild(item);
    });
}

function updateSliderFill(slider) {
    slider.style.setProperty("--progress", `${slider.value}%`);
}

function updateLoadingState() {
    if (hasActivePreferences()) {
        if (loadingStatus.textContent.startsWith("No categories")) {
            loadingStatus.textContent = "";
        }

        if (observer) {
            observer.unobserve(loadTrigger);
            observer.observe(loadTrigger);
        }
    } else {
        loadingStatus.textContent = "No categories selected. Increase a preference to continue browsing.";
    }
}

function showMessage(text) {
    clearTimeout(messageTimeout);

    messageElement.textContent = text;

    messageTimeout = setTimeout(() => {
        messageElement.textContent = "";
    }, 3500);
}

function updatePreference(category, newValue) {
    const previousScore = preferences[category];

    const score = Math.max(
        0,
        Math.min(100, Math.round(newValue))
    );

    preferences[category] = score;

    const slider = document.getElementById(`preference-${category}`);
    const valueElement = slider.closest(".preference-item")
        .querySelector(".preference-value");

    slider.value = score;
    valueElement.textContent = score;
    updateSliderFill(slider);
    updateLoadingState();

    if (score === previousScore) {
        showMessage(`${category} preference is already at its limit.`);
    } else if (score === 0) {
        showMessage(`${category} recommendations have been turned off.`);
    } else if (score > previousScore) {
        showMessage(`Preference updated: More ${category} content.`);
    } else {
        showMessage(`Preference updated: Fewer ${category} recommendations.`);
    }
}

function resetFeed() {
    feedElement.innerHTML = "";
    displayedPosts = [];
    loadMorePosts();
}

document.getElementById("refresh-btn").addEventListener("click", () => {
    resetFeed();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showMessage("Recommendations refreshed.");
});

document.getElementById("reset-btn").addEventListener("click", () => {
    preferences = { ...defaultPreferences };
    renderPreferences();
    resetFeed();
    window.scrollTo({ top: 0, behavior: "smooth" });
    showMessage("Preferences have been reset.");
});

observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !loading && hasActivePreferences()) {
        loadMorePosts();
    }
}, {
    rootMargin: "400px 0px",
    threshold: 0
});

renderPreferences();
resetFeed();
observer.observe(loadTrigger);
