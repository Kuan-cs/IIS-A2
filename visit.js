function stopReadingTimer() {
    clearInterval(readingTimer);

    readingTimer = null;

    if (
        currentVisit &&
        currentVisit.startedAt !== null
    ) {
        currentVisit.elapsed +=
            performance.now() -
            currentVisit.startedAt;

        currentVisit.startedAt = null;
    }
}

function currentReadingTime() {
    if (!currentVisit) {
        return 0;
    }

    const extra = currentVisit.startedAt === null
        ? 0
        : performance.now() -
          currentVisit.startedAt;

    return Math.min(
        readingDuration,
        currentVisit.elapsed + extra
    );
}

function updateReadingProgress() {
    if (!currentVisit || !detail.open) {
        return;
    }

    const elapsed = currentReadingTime();

    const seconds = elapsed / 1000;

    $("reading-progress").value = seconds;

    $("reading-time").textContent =
        `${Math.floor(seconds)} / 15s`;

    if (
        elapsed >= readingDuration &&
        currentVisit.eligible &&
        !currentVisit.entry?.undone &&
        canInfer(currentVisit.post) &&
        !document.hidden
    ) {
        stopReadingTimer();

        currentVisit.eligible = false;

        const changed = applyInference(
            currentVisit,
            currentVisit.readingPoints,
            "15s viewing time"
        );

        $("reading-progress").value = 15;

        $("reading-time").textContent =
            "15 / 15s";

        $("reading-status").textContent =
            changed > 0
                ? `${currentVisit.post.category} ${signed(changed)}`
                : "Preference limit reached.";

        saveState();
    }
}

function startReadingTimer() {
    if (
        !currentVisit ||
        !currentVisit.eligible ||
        currentVisit.entry?.undone ||
        !canInfer(currentVisit.post) ||
        document.hidden ||
        !detail.open ||
        readingTimer !== null
    ) {
        return;
    }

    currentVisit.startedAt =
        performance.now();

    readingTimer = setInterval(
        updateReadingProgress,
        200
    );
}

function openPost(post, opener) {
    if (
        detail.open ||
        preferenceDetail.open
    ) {
        return;
    }

    stopReadingTimer();

    const now = Date.now();

    const previous = visits[post.id];

    const first = !previous?.seen;

    const cooled =
        !previous?.lastClosed ||
        now - previous.lastClosed >= cooldownDuration;

    const eligible =
        canInfer(post) &&
        (first || cooled);

    currentVisit = {
        post,
        opener,
        entry: null,
        elapsed: 0,
        startedAt: null,
        eligible,

        readingPoints: first
            ? readingReward
            : returnReadingReward
    };

    $("detail-category").textContent =
        `${categoryIcons[post.category]} ${post.category}`;

    $("detail-image").textContent =
        post.image;

    $("detail-title").textContent =
        post.title;

    $("detail-content").textContent =
        post.content;

    detail.dataset.category =
        post.category;

    $("reading-progress").value = 0;

    $("reading-time").textContent =
        "0 / 15s";

    $("reading-panel").hidden = false;

    detail.showModal();

    visits[post.id] = {
        seen: Boolean(
            previous?.seen || eligible
        ),

        lastClosed: now
    };

    if (!eligible) {
        let reason;

        if (locks[post.category]) {
            reason =
                "🔒 Category locked";

        } else if (!autoInference) {
            reason =
                "Auto-learning paused";

        } else if (!preferences[post.category]) {
            reason =
                "Category excluded";

        } else {
            reason =
                "Repeat visit · No additional weight change.";
        }

        $("reading-status").textContent =
            reason;

        updateDetailUndo();

        saveState();

        return;
    }

    const changed = applyInference(
        currentVisit,

        first
            ? openingReward
            : returnOpeningReward,

        first
            ? "First visit"
            : "Return visit"
    );

    $("reading-status").textContent =
        `${first ? "First visit" : "Return visit"}` +
        (
            changed
                ? ` ${signed(changed)}`
                : " · No weight change"
        ) +
        ` · Up to +${currentVisit.readingPoints} after 15s`;

    updateDetailUndo();

    saveState();

    startReadingTimer();
}

function finishVisit() {
    if (!currentVisit) {
        return null;
    }

    stopReadingTimer();

    const { post, opener } = currentVisit;

    visits[post.id] = {
        seen: Boolean(visits[post.id]?.seen),

        lastClosed: Date.now()
    };

    currentVisit = null;

    saveState();

    return opener;
}

function closePost() {
    const opener = finishVisit();

    if (detail.open) {
        detail.close();
    }

    if (opener?.isConnected) {
        opener.focus();
    }
}