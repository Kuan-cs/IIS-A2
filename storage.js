function saveState() {
    try {
        localStorage.setItem(
            storageKey,
            JSON.stringify({
                preferences,
                locks,
                history,
                visits,
                autoInference
            })
        );

        $("save-status").textContent = "✓ Saved locally";
        $("save-status").classList.add("saved");
    } catch {
        $("save-status").textContent = "Not saved";
        $("save-status").classList.remove("saved");
    }
}

function restoreState() {
    try {
        const raw =
            localStorage.getItem(storageKey) ??
            localStorage.getItem(previousStorageKey) ??
            localStorage.getItem(oldStorageKey);

        if (!raw) return;

        const state = JSON.parse(raw);

        categories.forEach(c => {
            const value = state.preferences?.[c];

            if (
                typeof value === "number" &&
                Number.isFinite(value)
            ) {
                preferences[c] = clamp(value);
            }

            locks[c] = state.locks?.[c] === true;
        });

        if (typeof state.autoInference === "boolean") {
            autoInference = state.autoInference;
        }

        if (Array.isArray(state.history)) {
            history = state.history.filter(entry =>
                entry &&
                categories.includes(entry.category) &&
                [entry.before, entry.after].every(
                    v => Number.isInteger(v) &&
                    v >= 0 && v <= 100
                ) &&
                ["Automatic", "Manual", "Correction"]
                    .includes(entry.type) &&
                typeof entry.reason === "string" &&
                typeof entry.undone === "boolean" &&
                (
                    entry.type !== "Automatic" ||
                    (
                        Array.isArray(entry.signals) &&
                        entry.signals.every(s =>
                            s &&
                            typeof s.label === "string" &&
                            Number.isFinite(s.amount)
                        )
                    )
                )
            );
        }

        posts.forEach(post => {
            const visit = state.visits?.[post.id];

            if (visit && typeof visit.seen === "boolean") {
                visits[post.id] = {
                    seen: visit.seen,
                    lastClosed:
                        Number.isFinite(visit.lastClosed) &&
                        visit.lastClosed >= 0
                            ? visit.lastClosed
                            : 0
                };
            } else if (
                state.openedPosts?.includes?.(post.id) ||
                state.completedReading?.includes?.(post.id)
            ) {
                visits[post.id] = {
                    seen: true,
                    lastClosed: 0
                };
            }
        });

    } catch {
        preferences = { ...defaultPreferences };
        locks = { ...defaultLocks };
        history = [];
        visits = {};
        autoInference = true;
    }
}