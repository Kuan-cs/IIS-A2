# Transparent and Controllable Social Media Recommender System

Assignment 2 — Intelligent Interactive Systems  
University of Birmingham

**README prose word count: 1009**

## 1. Project Status

Building on my Assignment 1 literature review and Lab 3 prototype, this project explores how recommendation explanations, preference visualisation and interactive controls can help users understand and correct inferred interests.

- **Implemented:** Preference sliders, explicit feedback, recommendation explanations, preference breakdowns, activity history, reversible visit correction, category locks, Auto-learning controls, recommendation distributions, feed refresh and local persistence.
- **Simulated intelligence:** Functional rule-based interest inference and weighted random recommendation using 48 predefined posts across eight categories. No trained model or live social media data is used.
- **Planned:** Comparative user evaluation of recommendation transparency, correction effectiveness and perceived control.

## 2. Technology Stack

- **HTML and CSS:** Interface structure, layout and visual feedback.
- **JavaScript:** Behavioural inference, recommendation selection, state management and interaction logic.
- **LocalStorage:** Browser-local storage of preferences, settings, visit records and adjustment history.
- **Python 3:** Local static-file server for running the prototype.
- **ChatGPT:** Development and documentation assistance only; not a runtime component.

| Module | Responsibility |
| --- | --- |
| `data.js` | Content dataset and categories |
| `state.js`, `storage.js` | Shared state and persistence |
| `visit.js`, `inference.js` | Behavioural tracking, preference adjustments and correction |
| `recommendation.js` | Weighted random selection and probabilities |
| `feed.js`, `ui.js`, `script.js` | Feed generation, interface feedback and interaction |

## 3. Running Instructions

### 3.1 Running the Prototype

A modern desktop browser and Python 3 are required. No additional packages, API keys or external models are needed.

1. Download or clone the repository.
2. Open the folder containing `index.html`.
3. Open a terminal in that folder and run:

```bash
python -m http.server 8000
```

Alternatively, on Windows:

```bash
py -m http.server 8000
```

4. Open http://localhost:8000 in Chrome or Edge.
5. Use the reset function to restore the default preferences if necessary.
6. Press Ctrl+C in the terminal to stop the server.

The application runs entirely in the browser. The Python server only serves static files.

### 3.2 Suggested Interaction Checks

Start each independent scenario with the default preference settings.

| Scenario | Suggested operations | Expected behaviour |
| --- | --- | --- |
| Automatic interest inference | Open a post using “Read more” and keep it visible for 15 seconds. Inspect Latest adjustment, Why? and Activity. | An eligible first visit increases the category weight from 50 to 60, followed by a further increase to 65 after 15 seconds of visible dwell time. |
| Reversible correction | Complete the automatic adjustment described above. Select “Exclude this visit”, then select “Include this visit” without making other adjustments to that category. | The preference weight changes from 65 to 50 and is subsequently restored to 65. |
| Recommendation control | Set the Sports preference weight to zero, inspect Distribution and select “Refresh feed”. | The Sports recommendation probability becomes zero, and sports posts are excluded from the newly generated feed. |
| Automatic learning control | Lock a category or disable Auto-learning, then open a relevant post. | Automatic preference adjustments are prevented while manual preference controls remain available. |
| Fallback and recovery | Set all preference weights to zero and refresh the feed. Restore at least one category to a positive value and refresh again. | Content generation stops when no eligible category remains and resumes after an eligible preference is restored. |

These scenarios allow reviewers to inspect the main interaction mechanisms of the prototype directly.

## 4. Development Record and Authorship

The project was developed by extending my existing Lab 3 prototype. Multiple functional changes were consolidated into a single A2 development commit. To provide a clearer development record, the significant changes, their rationale and associated checks are documented individually below.

The main A2 development changes are available in this [Git commit](https://github.com/Kuan-cs/IIS-A2/commit/c577e19).

### 4.1 Significant Development Changes

| Changes | Rationale | Checks |
| --- | --- | --- |
| Expanded the dataset from five to eight categories. | Provide greater variety for exploring personalised recommendations. | Checked dataset size, category coverage and initial recommendation probabilities. |
| Introduced automatic interest inference based on post openings and visible dwell time. | Reduce reliance on repeated manual preference adjustments. | Checked automatic weight adjustments and inspected dwell-time tracking logic. |
| Added reduced repeat-visit rewards and a 60-second cooldown mechanism. | Limit excessive reinforcement from repeated browsing. | Reviewed repeat-visit conditions and cooldown logic. |
| Replaced permanent exclusion with reversible visit-level correction. | Allow users to reject an inaccurate inference without rejecting the associated content. | Checked exclusion, restoration and protection against conflicting adjustments. |
| Distinguished selection-time weights from current weights. | Prevent later adjustments from misleadingly explaining earlier recommendations. | Inspected recommendation explanations and displayed preference values. |
| Added recommendation distributions and explicit feed refresh. | Help users anticipate recommendation changes while preserving browsing continuity. | Checked baseline probabilities, zero-weight exclusion and illustrated refresh behaviour. |
| Introduced category locks and global Auto-learning controls. | Give users control over the scope of automated inference. | Checked that locked categories and disabled Auto-learning prevent automatic adjustments. |
| Modularised JavaScript and added local persistence. | Improve maintainability and retain preferences between sessions. | Checked JavaScript syntax, module responsibilities and storage logic. |

### 4.2 Validation

Validation included source inspection, AI-assisted logic-level checks and inspection of prototype screenshots. All nine JavaScript files passed syntax checks, and seven core logic checks passed.

### 4.3 Authorship and Reused Work

The Lab 3 prototype was developed as part of my own earlier coursework and serves as the foundation for Assignment 2. I continued developing the existing prototype by expanding its functionality and refining its interaction design.

The original prototype primarily relied on explicit preference adjustments. The A2 development introduces behavioural interest inference, transparent recommendation explanations, reversible visit correction and more comprehensive preference controls.

## 5. AI Assistance

I used ChatGPT to support the following aspects of the project:

| Assistance | Use, adaptation and checking |
| --- | --- |
| Idea development | Explored recommendation transparency, user control and interaction mechanisms. Refined the correction design from permanent exclusion to reversible visit-level adjustment. Used implementation suggestions during development. |
| Visual documentation | Assisted in creating storyboards and the system architecture diagram. Used actual prototype screenshots and revised diagram content and layout to reflect the implemented system. |
| Literature search | Assisted in identifying relevant academic literature. Bibliographic information and cited findings were checked against the original papers. |
| Code debugging and review | Assisted with code debugging and review to identify potential logic errors, edge cases and implementation problems. Suggestions were adapted to the intended interaction behaviour and checked through source inspection and logic-level tests. |

## 6. Additional Files

The A2 report is submitted separately through Canvas and contains three illustrated interaction scenarios, the system architecture diagram and academic references.

Earlier Lab 3 documentation remains accessible through the repository's commit history.

No additional ZIP files, external datasets or trained models are required to run the current prototype.