# DiffText ⟺

A clean, fast, mobile-first text diff tool. Paste two versions of any text and instantly see what changed — highlighted by **word**, **line**, or **character** — each with its own distinct color scheme.

---

## Features

- **Three diff modes** with distinct highlight colors:
  - **Word** — highlights individual changed words
  - **Line** — highlights entire changed lines
  - **Character** — highlights individual changed characters
- **Teal / cyan brand** — clean, original design
- **Light & dark theme** — toggle with one click, remembers your preference
- **Swap texts** — swap left and right content instantly
- **Edit / Run Diff** toggle — jump between input and diff view without losing text
- **Clear** — reset both panels
- **Keyboard shortcut** — `Ctrl+Enter` (or `Cmd+Enter` on Mac) to run diff
- **Mobile-first** — both editors visible and usable on small screens
- **Zero dependencies** — plain HTML, CSS, JavaScript; no build step

---

## How to Use

1. Open `index.html` in any modern browser (no server required).
2. Paste your original text in the **left** panel.
3. Paste the modified text in the **right** panel.
4. Select a diff mode: **Word**, **Line**, or **Character**.
5. Click **Run Diff** (or press `Ctrl+Enter`).
6. Differences are highlighted in both panels.
7. Click **✏️ Edit** to go back and make changes.

---

## Tech Stack

| Layer      | Tech                        |
|------------|-----------------------------|
| Markup     | Semantic HTML5              |
| Styles     | Vanilla CSS (custom props)  |
| Logic      | Vanilla JavaScript (ES6+)   |
| Algorithm  | LCS-based diff (O(m×n) DP)  |

---

## Project Structure

```
text-compare/
├── index.html   — layout and markup
├── style.css    — all styles and theme variables
├── script.js    — diff engine and UI logic
├── favicon.svg  — browser tab icon
└── README.md    — this file
```
