function explanationSource(post) {
    const labels = {
        Automatic: "Browsing-based preference",
        Manual: "Your selected preference",
        Correction: "Corrected preference",
        Initial: "Initial preference"
    };

    return `${labels[post.selection.source]} · ${post.category}`;
}

function createPostElement(post) {
    const article = document.createElement("article");

    article.className = "post";

    article.dataset.category = post.category;

    const reasonId = `reason-${++instanceId}`;

    article.innerHTML = `
        <div class="post-image" aria-hidden="true">
            ${post.image}
        </div>

        <div class="post-header">
            <span class="category-label">
                ${categoryIcons[post.category]} ${post.category}
            </span>
        </div>

        <h3></h3>

        <p class="post-description"></p>

        <div class="post-controls">
            <button class="read-btn" type="button">
                Read more →
            </button>

            <div class="post-actions">
                <button class="action-btn more-btn">
                    + More like this
                </button>

                <button class="action-btn fewer-btn">
                    − Show fewer
                </button>

                <button
                    class="action-btn why-btn"
                    aria-expanded="false"
                    aria-controls="${reasonId}"
                >
                    ⓘ Why?
                </button>
            </div>
        </div>

        <section class="reason-panel" id="${reasonId}" hidden>
            <div class="reason-summary"></div>

            <div class="reason-metrics">
                <div class="metric">
                    <span>Weight when selected</span>
                    <strong class="selected-weight"></strong>
                </div>

                <div class="metric">
                    <span>Current weight</span>
                    <strong class="current-weight"></strong>
                </div>
            </div>

            <div class="reason-source"></div>

            <button class="secondary-btn breakdown-btn">
                View preference breakdown
            </button>

            <details>
                <summary>Recommendation details</summary>
                <p class="reason-details"></p>
            </details>
        </section>
    `;

    article.querySelector("h3").textContent =
        post.title;

    article.querySelector(".post-description").textContent =
        post.description;

    const panel =
        article.querySelector(".reason-panel");

    const whyButton =
        article.querySelector(".why-btn");

    article.updateReason = () => {
        const current = preferences[post.category];

        const latest = latestChange(post.category);

        article.querySelector(".reason-summary").textContent =
            explanationSource(post);

        article.querySelector(".selected-weight").textContent =
            `${post.selection.weight}/100`;

        article.querySelector(".current-weight").innerHTML =
            weightHTML(
                current,
                latestDelta(post.category)
            );

        article.querySelector(".reason-source").textContent =
            latest
                ? `Latest adjustment: ${latest.before} → ${latest.after}`
                : "No preference changes yet.";

        article.querySelector(".reason-details").textContent =
            `Source when selected: ${post.selection.reason}. ` +
            `Category selection chance: ${(post.selection.chance * 100).toFixed(1)}%. ` +
            `Weighted random selection. ` +
            `Current baseline chance: ${(baselineProbability(post.category) * 100).toFixed(1)}%.` +
            (
                locks[post.category]
                    ? " Category locked against automatic changes."
                    : ""
            ) +
            (
                current === 0
                    ? " Future posts in this category are excluded."
                    : ""
            );
    };

    whyButton.addEventListener("click", () => {
        panel.hidden = !panel.hidden;

        whyButton.setAttribute(
            "aria-expanded",
            String(!panel.hidden)
        );

        if (!panel.hidden) {
            article.updateReason();
        }
    });

    article.querySelector(".read-btn")
        .addEventListener("click", event => {
            openPost(post, event.currentTarget);
        });

    article.querySelector(".more-btn")
        .addEventListener("click", () => {
            feedback(post, feedbackAmount);
        });

    article.querySelector(".fewer-btn")
        .addEventListener("click", () => {
            feedback(post, -feedbackAmount);
        });

    article.querySelector(".breakdown-btn")
        .addEventListener("click", () => {
            openBreakdown(post.category);
        });

    article.updateReason();

    return article;
}

function feedback(post, amount) {
    const action = amount > 0
        ? "More like this"
        : "Show fewer";

    if (
        !recordManualChange(
            post.category,
            preferences[post.category] + amount,
            `${action}: ${post.title}`
        )
    ) {
        notify(
            `${post.category} is already at its limit.`
        );
    }
}

function loadMorePosts() {
    if (
        loading ||
        detail.open ||
        preferenceDetail.open ||
        !activeCategories().length
    ) {
        return;
    }

    loading = true;

    for (let i = 0; i < batchSize; i++) {
        const post = selectPost(
            displayedPosts.slice(-5).map(p => p.id)
        );

        if (!post) {
            break;
        }

        displayedPosts.push(post);

        feed.appendChild(
            createPostElement(post)
        );
    }

    loading = false;

    updateLoadingState();
}

function refreshFeed() {
    feed.replaceChildren();

    displayedPosts = [];

    loadMorePosts();

    updateLoadingState();

    window.scrollTo({
        top: 0,

        behavior: matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
            ? "auto"
            : "smooth"
    });

    notify(
        activeCategories().length
            ? "Feed refreshed."
            : "No active categories."
    );
}

function updateLoadingState() {
    const active =
        activeCategories().length > 0;

    $("load-more-btn").disabled = !active;

    $("loading-status").textContent = active
        ? ""
        : "No active interests. Adjust a preference to continue.";
}