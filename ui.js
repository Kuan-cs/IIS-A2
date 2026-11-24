function signed(value) {
    return value > 0
        ? `+${value}`
        : value < 0
            ? `−${Math.abs(value)}`
            : "0";
}

function changeClass(value) {
    return value > 0
        ? "positive"
        : value < 0
            ? "negative"
            : "";
}

function weightHTML(value, delta = 0) {
    return `
        <span class="weight-number">
            ${value}${delta
                ? `<sup class="delta ${changeClass(delta)}">${signed(delta)}</sup>`
                : ""
            }
        </span>
    `;
}

function transitionHTML(entry) {
    return `
        <span class="old-value">${entry.before}</span>
        →
        ${weightHTML(
            entry.after,
            entry.after - entry.before
        )}
    `;
}

function notify(text) {
    clearTimeout(messageTimer);

    $("message").textContent = text;

    messageTimer = setTimeout(() => {
        $("message").textContent = "";
    }, 3500);
}

function createPreferences() {
    const container = $("preferences");

    const filter = $("history-filter");

    container.replaceChildren();

    categories.forEach(category => {
        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        filter.appendChild(option);

        const item = document.createElement("div");

        item.className = "preference-item";

        item.innerHTML = `
            <div class="preference-label">
                <label for="weight-${category}">
                    ${categoryIcons[category]} ${category}
                </label>

                <div class="preference-tools">
                    <span
                        class="preference-value"
                        id="value-${category}"
                    >
                        50
                    </span>

                    <button
                        class="icon-btn source-btn"
                        aria-label="View ${category} preference breakdown"
                        title="Preference breakdown"
                    >
                        ⓘ
                    </button>

                    <button
                        class="icon-btn lock-btn"
                        id="lock-${category}"
                        aria-label="Lock ${category}"
                        aria-pressed="false"
                    >
                        🔓
                    </button>
                </div>
            </div>

            <input
                id="weight-${category}"
                class="preference-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value="50"
            >
        `;

        const slider = item.querySelector("input");

        slider.addEventListener("input", () => {
            $(`value-${category}`).innerHTML =
                weightHTML(
                    Number(slider.value),
                    Number(slider.value) -
                    preferences[category]
                );

            slider.style.setProperty(
                "--progress",
                `${slider.value}%`
            );
        });

        slider.addEventListener("change", () => {
            const changed = recordManualChange(
                category,
                Number(slider.value),
                "Slider adjustment"
            );

            if (!changed) {
                renderPreferences();
            }

            if (
                !displayedPosts.length &&
                activeCategories().length
            ) {
                loadMorePosts();
            }
        });

        item.querySelector(".lock-btn")
            .addEventListener("click", () => {
                toggleLock(category);
            });

        item.querySelector(".source-btn")
            .addEventListener("click", () => {
                openBreakdown(category);
            });

        container.appendChild(item);
    });
}

function renderPreferences() {
    categories.forEach(category => {
        const value = preferences[category];

        const slider = $(`weight-${category}`);

        const lockButton = $(`lock-${category}`);

        slider.value = value;

        slider.style.setProperty(
            "--progress",
            `${value}%`
        );

        $(`value-${category}`).innerHTML =
            weightHTML(
                value,
                latestDelta(category)
            );

        lockButton.textContent = locks[category]
            ? "🔒"
            : "🔓";

        lockButton.classList.toggle(
            "locked",
            locks[category]
        );

        lockButton.setAttribute(
            "aria-pressed",
            String(locks[category])
        );

        lockButton.setAttribute(
            "aria-label",
            `${locks[category] ? "Unlock" : "Lock"} ${category}`
        );

        lockButton.title = locks[category]
            ? "Unlock automatic changes"
            : "Lock against automatic changes";
    });

    $("unlock-all-btn").disabled =
        !categories.some(category => locks[category]);
}

function renderDistribution() {
    const container = $("distribution");

    container.replaceChildren();

    if (!activeCategories().length) {
        container.innerHTML =
            '<p class="empty-state">No eligible content.</p>';

        return;
    }

    categories.forEach(category => {
        const percentage =
            baselineProbability(category) * 100;

        const row = document.createElement("div");

        row.className = "distribution-row";

        row.innerHTML = `
            <div class="distribution-heading">
                <span>
                    ${categoryIcons[category]} ${category}
                </span>

                <strong>
                    ${percentage.toFixed(1)}%
                </strong>
            </div>

            <div class="distribution-track" aria-hidden="true">
                <div
                    class="distribution-fill"
                    style="width: ${percentage}%"
                ></div>
            </div>
        `;

        container.appendChild(row);
    });
}

function renderEntryReason(
    container,
    entry,
    showTitle = false
) {
    container.replaceChildren();

    if (entry.type !== "Automatic") {
        container.textContent = entry.reason;

        return;
    }

    if (showTitle) {
        const title = document.createElement("div");

        title.textContent = entry.reason;

        container.appendChild(title);
    }

    if (entry.restored) {
        const note = document.createElement("div");

        note.textContent = "Visit included again";

        container.appendChild(note);
    }

    entry.signals.forEach(signal => {
        const row = document.createElement("div");

        row.className = "signal-row";

        const label = document.createElement("span");

        label.textContent = signal.label;

        const amount = document.createElement("sup");

        amount.className =
            `delta ${changeClass(signal.amount)}`;

        amount.textContent =
            signed(signal.amount);

        row.append(label, amount);

        container.appendChild(row);
    });

    if (entry.undone) {
        const note = document.createElement("div");

        note.textContent =
            "Visit contribution excluded.";

        container.appendChild(note);
    }
}

function renderLatestChange() {
    const entry = history[history.length - 1];

    const undoButton = $("quick-undo");

    $("latest-change").hidden = !entry;

    if (!entry) {
        undoButton.hidden = true;

        undoButton.onclick = null;

        return;
    }

    $("latest-category").textContent =
        `${categoryIcons[entry.category]} ${entry.category} · ${entry.type}`;

    $("latest-values").innerHTML =
        transitionHTML(entry);

    renderEntryReason(
        $("latest-reason"),
        entry
    );

    const target = entry.type === "Correction"
        ? history[entry.undoOf]
        : entry;

    undoButton.hidden = !(
        canUndo(target) ||
        canRestore(target)
    );

    undoButton.textContent = target?.undone
        ? "Include this visit"
        : "Exclude this visit";

    undoButton.onclick = canRestore(target)
        ? () => restoreInference(target)
        : canUndo(target)
            ? () => undoInference(target)
            : null;
}

function renderHistory() {
    const container = $("history");

    const filter = $("history-filter").value;

    const entries = history.filter(entry =>
        filter === "all" ||
        entry.category === filter
    );

    container.replaceChildren();

    if (!entries.length) {
        container.innerHTML =
            '<p class="empty-state">No activity yet.</p>';

        return;
    }

    [...entries].reverse().forEach(entry => {
        const item = document.createElement("div");

        item.className =
            `history-item${entry.undone ? " undone" : ""}`;

        const typeClass = {
            Automatic: "automatic-label",
            Manual: "explicit-label",
            Correction: "correction-label"
        }[entry.type];

        item.innerHTML = `
            <div class="history-title">
                <strong>
                    ${categoryIcons[entry.category]}
                    ${entry.category}
                </strong>

                <span class="${typeClass}">
                    ${entry.type}
                </span>
            </div>

            <div class="history-values">
                ${transitionHTML(entry)}
            </div>

            <div class="history-reason"></div>
        `;

        renderEntryReason(
            item.querySelector(".history-reason"),
            entry,
            true
        );

        if (entry.type === "Automatic") {
            const button =
                document.createElement("button");

            button.className = "secondary-btn";

            button.textContent = entry.undone
                ? "Include this visit"
                : "Exclude this visit";

            button.disabled = entry.undone
                ? !canRestore(entry)
                : !canUndo(entry);

            if (button.disabled) {
                button.title =
                    "A newer preference change prevents this action.";
            }

            button.addEventListener("click", () => {
                if (entry.undone) {
                    restoreInference(entry);
                } else {
                    undoInference(entry);
                }
            });

            item.appendChild(button);
        }

        container.appendChild(item);
    });
}

function openBreakdown(category) {
    activeBreakdown = category;

    renderBreakdown(category);

    if (!preferenceDetail.open) {
        preferenceDetail.showModal();
    }
}

function renderBreakdown(category) {
    $("preference-detail-title").textContent =
        `${categoryIcons[category]} ${category}`;

    $("breakdown-value").innerHTML =
        weightHTML(
            preferences[category],
            latestDelta(category)
        );

    const container = $("breakdown-content");

    container.innerHTML = `
        <div class="breakdown-row">
            <div class="breakdown-heading">
                <span>Initial preference</span>

                <strong>50</strong>
            </div>

            <div class="breakdown-reason">
                Starting weight
            </div>

            <div class="breakdown-track">
                <div
                    class="breakdown-fill"
                    style="width: 50%"
                ></div>
            </div>
        </div>
    `;

    history.filter(
        entry => entry.category === category
    ).forEach(entry => {
        const row = document.createElement("div");

        row.className = "breakdown-row";

        row.innerHTML = `
            <div class="breakdown-heading">
                <strong>${entry.type}</strong>

                <span>
                    ${transitionHTML(entry)}
                </span>
            </div>

            <div class="breakdown-reason"></div>

            <div class="breakdown-track">
                <div
                    class="breakdown-fill"
                    style="width: ${entry.after}%"
                ></div>
            </div>
        `;

        renderEntryReason(
            row.querySelector(".breakdown-reason"),
            entry,
            true
        );

        container.appendChild(row);
    });

    const note = document.createElement("p");

    note.className = "small-note";

    note.textContent = locks[category]
        ? "Automatic changes locked. Manual adjustments remain available."
        : "Automatic changes permitted when learning is on.";

    container.appendChild(note);
}

function updateDetailUndo() {
    const button = $("detail-undo");

    const entry = currentVisit?.entry;

    button.hidden = !(
        canUndo(entry) ||
        canRestore(entry)
    );

    button.textContent = entry?.undone
        ? "Include this visit"
        : "Exclude this visit";

    button.onclick = canRestore(entry)
        ? () => restoreInference(entry)
        : canUndo(entry)
            ? () => undoInference(entry)
            : null;
}

function updateInterface() {
    renderPreferences();

    renderDistribution();

    renderLatestChange();

    renderHistory();

    $("auto-inference").checked =
        autoInference;

    $("learning-state").textContent =
        autoInference
            ? "On"
            : "Paused";

    updateLoadingState();

    updateDetailUndo();

    if (activeBreakdown) {
        renderBreakdown(activeBreakdown);
    }

    feed.querySelectorAll(".post").forEach(article => {
        if (
            !article.querySelector(".reason-panel").hidden
        ) {
            article.updateReason();
        }
    });

    saveState();
}