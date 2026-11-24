$("close-detail").addEventListener(
    "click",
    closePost
);

$("back-to-feed").addEventListener(
    "click",
    closePost
);

detail.addEventListener("cancel", event => {
    event.preventDefault();

    closePost();
});

detail.addEventListener("close", () => {
    if (!detail.open) {
        finishVisit();
    }
});

window.addEventListener("pagehide", () => {
    if (currentVisit) {
        closePost();
    }
});

$("close-preference-detail")
    .addEventListener("click", () => {
        preferenceDetail.close();
    });

$("breakdown-close-btn")
    .addEventListener("click", () => {
        preferenceDetail.close();
    });

preferenceDetail.addEventListener("close", () => {
    activeBreakdown = null;
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopReadingTimer();
    } else {
        updateReadingProgress();

        startReadingTimer();
    }
});

$("auto-inference").addEventListener("change", event => {
    autoInference = event.target.checked;

    if (!autoInference && currentVisit) {
        stopReadingTimer();

        currentVisit.eligible = false;

        $("reading-status").textContent =
            "Auto-learning paused.";
    }

    updateInterface();

    notify(
        autoInference
            ? "Auto-learning enabled."
            : "Auto-learning paused."
    );
});

$("unlock-all-btn").addEventListener("click", () => {
    locks = { ...defaultLocks };

    updateInterface();

    notify("All categories unlocked.");
});

$("history-filter").addEventListener(
    "change",
    renderHistory
);

document.querySelectorAll(".tab-btn")
    .forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn")
                .forEach(tab => {
                    tab.classList.toggle(
                        "active",
                        tab === button
                    );

                    tab.setAttribute(
                        "aria-pressed",
                        String(tab === button)
                    );
                });

            document.querySelectorAll(".profile-panel")
                .forEach(panel => {
                    panel.hidden =
                        panel.id !==
                        button.dataset.panel;
                });
        });
    });

$("refresh-btn").addEventListener(
    "click",
    refreshFeed
);

$("apply-btn").addEventListener(
    "click",
    refreshFeed
);

$("load-more-btn").addEventListener(
    "click",
    loadMorePosts
);

$("reset-btn").addEventListener("click", () => {
    if (
        !window.confirm(
            "Reset preferences, history, learning settings, locks and visit records?"
        )
    ) {
        return;
    }

    if (detail.open) {
        closePost();
    }

    if (preferenceDetail.open) {
        preferenceDetail.close();
    }

    stopReadingTimer();

    preferences = { ...defaultPreferences };

    locks = { ...defaultLocks };

    history = [];

    visits = {};

    autoInference = true;

    activeBreakdown = null;

    $("history-filter").value = "all";

    try {
        localStorage.removeItem(storageKey);

        localStorage.removeItem(previousStorageKey);

        localStorage.removeItem(oldStorageKey);
    } catch {}

    updateInterface();

    refreshFeed();

    notify("Preferences reset.");
});

restoreState();

createPreferences();

updateInterface();

loadMorePosts();

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        entries => {
            if (
                entries.some(
                    entry => entry.isIntersecting
                )
            ) {
                loadMorePosts();
            }
        },

        {
            rootMargin: "200px 0px"
        }
    );

    observer.observe(
        $("load-trigger")
    );
}