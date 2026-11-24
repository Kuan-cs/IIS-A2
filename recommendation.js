function baselineProbability(category) {
    const total = posts.reduce(
        (sum, post) =>
            sum + preferences[post.category],
        0
    );

    const count = posts.filter(
        post => post.category === category
    ).length;

    return total
        ? count * preferences[category] / total
        : 0;
}

function selectPost(
    excludedIds = [],
    random = Math.random
) {
    const eligible = posts.filter(
        post => preferences[post.category] > 0
    );

    if (!eligible.length) {
        return null;
    }

    let candidates = eligible.filter(
        post => !excludedIds.includes(post.id)
    );

    if (!candidates.length) {
        candidates = eligible.filter(
            post =>
                post.id !==
                excludedIds[excludedIds.length - 1]
        );
    }

    if (!candidates.length) {
        candidates = eligible;
    }

    const totalWeight = candidates.reduce(
        (sum, post) =>
            sum + preferences[post.category],
        0
    );

    let ticket = random() * totalWeight;

    let selected = candidates[candidates.length - 1];

    for (const post of candidates) {
        ticket -= preferences[post.category];

        if (ticket < 0) {
            selected = post;
            break;
        }
    }

    const category = selected.category;

    const weight = preferences[category];

    const count = candidates.filter(
        post => post.category === category
    ).length;

    const last = latestChange(category);

    return {
        ...selected,

        selection: {
            weight,

            chance: count * weight / totalWeight,

            source: last
                ? last.type
                : "Initial",

            reason: last
                ? `${last.reason}: ${last.before} → ${last.after}`
                : "Default weight of 50"
        }
    };
}