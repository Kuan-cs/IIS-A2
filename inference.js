function canUndo(entry) {
    return Boolean(
        entry &&
        entry.type === "Automatic" &&
        !entry.undone &&
        latestChange(entry.category) === entry &&
        preferences[entry.category] === entry.after
    );
}

function canInfer(post) {
    return autoInference &&
        !locks[post.category] &&
        preferences[post.category] > 0;
}

function recordManualChange(category, value, reason) {
    const before = preferences[category];
    const after = clamp(value);

    if (before === after) return false;

    preferences[category] = after;

    history.push({
        category,
        before,
        after,
        type: "Manual",
        reason,
        undone: false
    });

    updateInterface();

    notify(`${category}: ${before} → ${after}`);

    return true;
}

function applyInference(visit, points, reason) {
    if (!canInfer(visit.post)) return 0;

    const category = visit.post.category;
    const before = preferences[category];
    const after = clamp(before + points);
    const change = after - before;

    if (!change) return 0;

    let entry = visit.entry;

    if (
        !entry ||
        entry.undone ||
        latestChange(category) !== entry ||
        entry.after !== before
    ) {
        entry = {
            category,
            before,
            after,
            type: "Automatic",
            reason: visit.post.title,
            postId: visit.post.id,
            signals: [],
            undone: false
        };

        history.push(entry);

        visit.entry = entry;
    }

    entry.after = after;

    entry.signals.push({
        label: reason,
        amount: change
    });

    preferences[category] = after;

    updateInterface();

    return change;
}

function canRestore(entry) {
    if (
        !entry ||
        entry.type !== "Automatic" ||
        !entry.undone
    ) {
        return false;
    }

    const correction = latestChange(entry.category);

    return Boolean(
        correction &&
        correction.type === "Correction" &&
        correction.undoOf === history.indexOf(entry) &&
        correction.before === entry.after &&
        correction.after === entry.before &&
        preferences[entry.category] === entry.before
    );
}

function undoInference(entry) {
    if (!canUndo(entry)) {
        notify("A newer preference change exists.");
        return;
    }

    const before = preferences[entry.category];

    entry.undone = true;

    preferences[entry.category] = entry.before;

    history.push({
        category: entry.category,
        before,
        after: entry.before,
        type: "Correction",
        reason: `Excluded: ${entry.reason}`,
        undoOf: history.indexOf(entry),
        undone: false
    });

    if (currentVisit?.entry === entry) {
        stopReadingTimer();

        $("reading-status").textContent =
            "This visit is excluded from your interests.";
    }

    updateInterface();

    notify(
        `${entry.category}: ${before} → ${entry.before}`
    );
}

function restoreInference(entry) {
    if (!canRestore(entry)) {
        notify("A newer preference change exists.");
        return;
    }

    const restored = {
        ...entry,
        signals: entry.signals.map(signal => ({
            ...signal
        })),
        undone: false,
        restored: true
    };

    preferences[entry.category] = entry.after;

    history.push(restored);

    if (currentVisit?.entry === entry) {
        currentVisit.entry = restored;

        $("reading-status").textContent =
            "This visit is included in your interests.";
    }

    updateInterface();

    if (currentVisit?.entry === restored) {
        startReadingTimer();
    }

    notify(
        `${entry.category}: ${entry.before} → ${entry.after}`
    );
}

function toggleLock(category) {
    locks[category] = !locks[category];

    if (
        locks[category] &&
        currentVisit?.post.category === category
    ) {
        stopReadingTimer();

        currentVisit.eligible = false;

        $("reading-status").textContent =
            "Category locked";
    }

    updateInterface();

    notify(
        `${category} ${locks[category] ? "locked" : "unlocked"}`
    );
}