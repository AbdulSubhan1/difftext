# DiffText ⟺ — Free Online Text Compare & Diff Tool

**[🚀 Live Demo → abdulsubhan1.github.io/difftext](https://abdulsubhan1.github.io/difftext/)**

A fast, free online text comparison tool. Paste two versions of any text and instantly see the differences highlighted — by **word**, **line**, or **character**. No account, no upload, no install — runs 100% in your browser.

> **The quickest way to compare two texts online.** Find differences between documents, code, essays, or any plain text in seconds — completely private, nothing leaves your browser.

### Why use DiffText?

- **Instant text compare** — paste and click, results in milliseconds
- **Three diff modes** — word-by-word, line-by-line, character-by-character
- **Side-by-side view** — additions and removals highlighted with distinct colors
- **Works offline** — fully functional without an internet connection
- **Private** — your text never leaves your browser, no server involved
- **Free forever** — no account, no subscription, no file upload needed

**Keywords:** text compare, compare two texts, text diff tool, online diff, text comparison, find differences, word diff, line diff, character diff, compare text online, free diff tool

---

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
