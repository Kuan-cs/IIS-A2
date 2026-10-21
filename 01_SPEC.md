# 01_SPEC.md: use case and system path

## User goal

The user wants to understand why certain content is recommended and reduce unwanted recommendations in a social media feed.

The use case selected from the Week 2 storyboard is correcting an incorrect recommendation. For example, a user may watch a sports video out of curiosity without wanting similar content in the future.

## System inputs

The user provides feedback through "More like this", "Show fewer like this", or preference sliders in the revised prototype.

The system receives the selected content category, requested action and current preference values.

The prototype supports five categories: Travel, Pets, Music, Food and Sports. Each preference ranges from 0 to 100, with an initial value of 50.

In the initial prototype, users could only change preferences using buttons that increased or decreased a value by 20.

## Processing and technology

- **HTML/CSS:** Display recommended posts, explanations, controls and feedback.
- **JavaScript:** Process user actions, validate preference values and update the current preference state.
- **Local dataset:** Supply 20 predefined posts across five categories.
- **Weighted random algorithm:** Select posts using their category preference values as weights.
- **IntersectionObserver:** Detect when the user approaches the bottom of the feed and load additional posts.

Categories with a preference value of 0 are excluded from new recommendations. Previously displayed posts remain visible.

The recommendation algorithm uses simulated preferences and predefined content rather than a trained model or live social media data.

## Intended result and next action

The system updates the relevant preference value and displays a confirmation message.

When the user scrolls down, new posts are selected using the updated preferences. Higher values generally increase the chance of selecting a category.

The user can continue browsing, view recommendation explanations, adjust preferences again or reset them.

## Fallback strategy

If a category's preference reaches 0, the system excludes that category from new recommendations.

If every preference is 0, the system stops generating new posts and displays a message asking the user to increase at least one preference value.

Preference values are restricted to 0–100. Previously displayed posts remain visible, and predefined posts may be reused during extended scrolling.

The prototype cannot analyse actual viewing history or retrieve live social media content.

## System path or interaction diagram

See `system_path_diagram.png`.

The revised system path follows:

1. The user selects a recommendation control or adjusts a preference slider.
2. JavaScript reads the selected category, action and preference values.
3. The system validates and updates the preference value.
4. The system checks whether any preference value is greater than 0.
5. If eligible categories exist, the recommendation algorithm selects posts from the local dataset when the user scrolls.
6. If no categories are eligible, the system stops generating posts and displays a fallback message.
7. The user continues browsing or adjusts preferences again.

**Implemented:** Interface controls, preference validation, weighted random selection, feedback, infinite scrolling and fallback handling.

**Simulated:** Social media recommendation feed using a local dataset of predefined posts.

**Not implemented:** Automatic learning from viewing history, live content retrieval and machine-learning-based personalisation.

## Test A: standard input

**Input:**

The user selects "Show fewer like this" on a Sports post with the Sports preference initially set to 50.

**What the system receives:**

- Category: Sports
- Action: Show fewer like this
- Initial preference: 50
- Requested change: -20

**What it does:**

JavaScript updates the Sports preference from 50 to 30 and uses the updated weight for subsequent recommendations.

**Response and next action:**

The Sports preference changed from 50 to 30, and a confirmation message appeared.

The user could continue scrolling and loading recommendations using the updated preference values.

**Result: Pass.**

## Test B: problem input

**Input:**

In the initial prototype, the user wants to set the Sports preference to exactly 20, starting from the default value of 50.

**What the system receives:**

The initial interface only supports fixed-step feedback buttons:

- Category: Sports
- Initial preference: 50
- Available actions: More like this (+20) or Show fewer like this (-20)
- User's intended preference: 20

The exact target value is not directly received as a numeric input because the initial interface does not support entering specific values.

**What it does:**

Each click changes the preference by 20, within the permitted range of 0–100.

Starting from 50, the user can reduce the Sports preference to 30, then 10, and then 0. The system cannot reach exactly 20 using these fixed-step controls.

**Response and next action:**

The system correctly processed individual button clicks but could not achieve the user's intended preference of 20.

The user could only select a nearby available value or abandon the exact adjustment.

**Result: Fail — the initial interaction did not support precise preference adjustment.**

## Review and revision

### Review of Test A and Test B

Did the system make clear what it can and cannot do?

Not completely. Test B showed that the initial interface could not set the Sports preference to exactly 20 using the fixed-step buttons. The interface did not clearly explain this limitation or offer an alternative way to enter an exact value.

Did it show what it understood or extract from the input?

Yes. In Test A, the Sports preference changed from 50 to 30 after the user selected "Show fewer like this". The confirmation message showed that the system had processed the action correctly.

Could the person correct a wrong extraction or decision?

Partly. Test A showed that users could reduce unwanted recommendations using the feedback buttons. However, Test B showed that the initial interface did not allow users to choose an exact preference value, limiting their ability to correct recommendations precisely.

Did it keep the person in control of the next action?

Partly. The user could continue browsing or adjust preferences using the existing buttons. However, Test B showed that the fixed steps of 20 prevented the user from reaching the intended value of 20.

Interaction problem identified:

The initial interface supported quick preference adjustments but did not provide precise control. This limitation was identified in Test B and led to the addition of preference sliders in Phase 4.

### Interaction change

Adjustable preference sliders were added so users could set any whole-number preference value between 0 and 100.

The current value is displayed next to each slider, making preference settings easier to understand and adjust.

The existing "More like this" and "Show fewer like this" buttons were retained for quick feedback.

### Technology or system change

JavaScript was updated to handle slider input and synchronise the displayed values with the internal preference state.

The weighted random recommendation algorithm remained unchanged because it already supported numeric preference values.

### Updated system path

The revised interface provides two ways to adjust recommendations: quick feedback buttons and direct preference sliders.

When the user changes a slider, JavaScript validates the selected value and updates the preference state. The recommendation algorithm then uses the updated weight when generating new posts.

The final system path is shown in `system_path_diagram.png`.

### Test B: retest

**Input:**

In the revised prototype, the user sets the Sports preference to exactly 20 using the preference slider.

**What the system receives:**

- Category: Sports
- Input method: Preference slider
- Initial preference: 50
- Requested preference: 20

**What it does:**

JavaScript reads the slider value, validates that 20 is within the permitted range and updates the Sports preference from 50 to 20.

The updated preference value is used for subsequent recommendations.

**Response and next action:**

The interface displayed Sports with a preference value of 20.

The user could continue scrolling to receive recommendations using the updated weight or adjust the value again.

**Result: Pass — the revised interface supports precise preference adjustment.**

### Why the changes improve the system

The preference sliders allow users to choose exact values instead of relying only on repeated fixed-step button clicks. This resolves the limitation identified in Test B and provides greater control over future recommendations.

Keeping the original feedback buttons also supports quick adjustments, while the sliders offer more precise control when needed.
