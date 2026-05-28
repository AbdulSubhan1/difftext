/**
 * script.js — Text Compare
 *
 * Architecture
 * ────────────
 * 1. LCS Core     — generic diff engine, works on any token array
 * 2. Tokenizers   — convert raw text into token arrays per diff mode
 * 3. Renderers    — turn diff ops into highlighted HTML for each panel
 * 4. UI Handlers  — wire buttons, mode toggle, and keyboard shortcuts
 */

'use strict';

// ================================================================
// === LCS Core
// ================================================================

/**
 * Compute the Longest Common Subsequence table for two token arrays.
 * Uses classic O(m*n) DP. Returns the filled table for backtracking.
 *
 * @param {string[]} a
 * @param {string[]} b
 * @returns {number[][]} dp table
 */
function buildLCSTable(a, b) {
  const m = a.length;
  const n = b.length;
  // Allocate a (m+1) × (n+1) table filled with zeros
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Take the best of skipping from either side
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp;
}

/**
 * Backtrack through an LCS table to produce an ordered list of diff ops.
 * Each op has the shape: { type: 'equal' | 'delete' | 'insert', value: string }
 *
 * 'delete' → token exists only in `a` (left / original)
 * 'insert' → token exists only in `b` (right / modified)
 * 'equal'  → token matches in both
 *
 * @param {number[][]} dp
 * @param {string[]}   a
 * @param {string[]}   b
 * @returns {{ type: string, value: string }[]}
 */
function backtrackDiff(dp, a, b) {
  const ops = [];
  let i = a.length;
  let j = b.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      // Tokens match — part of the LCS
      ops.push({ type: 'equal', value: a[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Moving left in the table — token only in b → insertion
      ops.push({ type: 'insert', value: b[j - 1] });
      j--;
    } else {
      // Moving up in the table — token only in a → deletion
      ops.push({ type: 'delete', value: a[i - 1] });
      i--;
    }
  }

  // Backtracking produces ops in reverse order
  return ops.reverse();
}

/**
 * Main diff entry point. Tokenize both texts, build the LCS table,
 * and return the ordered diff ops.
 *
 * @param {string[]} tokensA  — tokenized original text
 * @param {string[]} tokensB  — tokenized modified text
 * @returns {{ type: string, value: string }[]}
 */
function computeDiff(tokensA, tokensB) {
  const dp = buildLCSTable(tokensA, tokensB);
  return backtrackDiff(dp, tokensA, tokensB);
}


// ================================================================
// === Tokenizers
// ================================================================
// All tokenizers share the same signature: (text: string) => string[]
// so the diff engine can be called uniformly regardless of mode.

/**
 * Line-level tokenizer. Preserves line endings as part of each token
 * so whitespace is faithfully reconstructed in the output.
 *
 * @param {string} text
 * @returns {string[]}
 */
function tokenizeLines(text) {
  // Split on newlines but keep the delimiter attached to each line
  return text.split(/^/m);
}

/**
 * Word-level tokenizer. Splits on word boundaries while keeping
 * surrounding whitespace/punctuation as separate tokens so the
 * rendered output still looks like the original text.
 *
 * @param {string} text
 * @returns {string[]}
 */
function tokenizeWords(text) {
  // Match runs of word characters OR runs of non-word characters
  return text.match(/\w+|\W+/g) ?? [];
}

/**
 * Character-level tokenizer.
 *
 * @param {string} text
 * @returns {string[]}
 */
function tokenizeChars(text) {
  return [...text];
}

/** Map diff mode name → tokenizer function */
const TOKENIZERS = {
  line: tokenizeLines,
  word: tokenizeWords,
  char: tokenizeChars,
};


// ================================================================
// === Renderers
// ================================================================

/**
 * Escape a string for safe insertion as HTML text content.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Build the highlighted HTML for ONE side (left or right panel).
 *
 * Strategy:
 *  - 'equal' tokens → plain text (no highlight)
 *  - 'delete' ops   → shown on LEFT  panel with remove highlight; skipped on right
 *  - 'insert' ops   → shown on RIGHT panel with add highlight;    skipped on left
 *
 * The CSS class names follow the pattern: hl-{mode}-{remove|add}
 * which maps to the highlight pairs defined in style.css.
 *
 * @param {{ type: string, value: string }[]} ops
 * @param {'left'|'right'} side
 * @param {'line'|'word'|'char'} mode
 * @returns {string} HTML string
 */
function buildPanelHtml(ops, side, mode) {
  let html = '';

  for (const op of ops) {
    const escaped = escapeHtml(op.value);

    if (op.type === 'equal') {
      html += escaped;
    } else if (op.type === 'delete' && side === 'left') {
      html += `<mark class="hl-${mode}-remove">${escaped}</mark>`;
    } else if (op.type === 'insert' && side === 'right') {
      html += `<mark class="hl-${mode}-add">${escaped}</mark>`;
    }
    // Opposite-side tokens are simply omitted for the other panel
  }

  return html;
}

/**
 * Run the full diff pipeline and inject results into the DOM panels.
 *
 * @param {string} textA  — content from the left textarea
 * @param {string} textB  — content from the right textarea
 * @param {'line'|'word'|'char'} mode
 */
function renderDiff(textA, textB, mode) {
  const tokenize = TOKENIZERS[mode];
  const ops = computeDiff(tokenize(textA), tokenize(textB));

  document.getElementById('diff-left').innerHTML  = buildPanelHtml(ops, 'left',  mode);
  document.getElementById('diff-right').innerHTML = buildPanelHtml(ops, 'right', mode);
}


// ================================================================
// === UI Handlers
// ================================================================

/** Toggle visibility between the editor and diff panel sections. */
function showDiffView() {
  document.getElementById('editor-panels').hidden = true;
  document.getElementById('diff-panels').hidden   = false;
  document.getElementById('btn-edit').disabled    = false;
}

function showEditorView() {
  document.getElementById('editor-panels').hidden = false;
  document.getElementById('diff-panels').hidden   = true;
  document.getElementById('btn-edit').disabled    = true;
}

/** Read the currently selected diff mode from the radio group. */
function getSelectedMode() {
  return document.querySelector('input[name="diff-mode"]:checked').value;
}

/** Return true when the diff view is currently visible. */
function isDiffVisible() {
  return !document.getElementById('diff-panels').hidden;
}

// ── Entry point ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Cache DOM references
  const textLeft   = document.getElementById('text-left');
  const textRight  = document.getElementById('text-right');
  const btnCompare = document.getElementById('btn-compare');
  const btnEdit    = document.getElementById('btn-edit');
  const btnSwitch  = document.getElementById('btn-switch');
  const btnClear   = document.getElementById('btn-clear');
  const btnTheme   = document.getElementById('btn-theme');
  const modeInputs = document.querySelectorAll('input[name="diff-mode"]');

  // ── Theme (light / dark) ─────────────────────────────────────
  // Restore saved preference, falling back to dark
  const THEME_KEY = 'difftext-theme';

  /** Apply a theme and persist it. @param {'light'|'dark'} theme */
  function applyTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    btnTheme.textContent = theme === 'light' ? '🌙' : '☀️';
    btnTheme.title       = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    localStorage.setItem(THEME_KEY, theme);
  }

  // Load saved or system preference on startup
  const savedTheme = localStorage.getItem(THEME_KEY)
    ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  applyTheme(savedTheme);

  btnTheme.addEventListener('click', () => {
    applyTheme(document.body.classList.contains('light') ? 'dark' : 'light');
  });

  // Start with Edit button disabled (nothing to go back to yet)
  showEditorView();

  // ── Compare ──────────────────────────────────────────────────
  btnCompare.addEventListener('click', () => {
    renderDiff(textLeft.value, textRight.value, getSelectedMode());
    showDiffView();
  });

  // ── Edit texts (return to input view) ───────────────────────
  btnEdit.addEventListener('click', () => {
    showEditorView();
  });

  // ── Switch texts ─────────────────────────────────────────────
  btnSwitch.addEventListener('click', () => {
    const tmp = textLeft.value;
    textLeft.value  = textRight.value;
    textRight.value = tmp;

    // Re-run diff if the output is currently visible
    if (isDiffVisible()) {
      renderDiff(textLeft.value, textRight.value, getSelectedMode());
    }
  });

  // ── Clear all ────────────────────────────────────────────────
  btnClear.addEventListener('click', () => {
    textLeft.value  = '';
    textRight.value = '';
    showEditorView();
  });

  // ── Mode toggle: re-render on change if diff is already visible
  modeInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (isDiffVisible()) {
        renderDiff(textLeft.value, textRight.value, getSelectedMode());
      }
    });
  });

  // ── Keyboard shortcut: Ctrl+Enter / Cmd+Enter → Compare ──────
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      renderDiff(textLeft.value, textRight.value, getSelectedMode());
      showDiffView();
    }
  });

  // ── Footer modals ─────────────────────────────────────────────
  /**
   * Wire a footer button to open a <dialog> modal, and set up the
   * close button + backdrop-click to dismiss it.
   *
   * @param {string} btnId    — id of the footer <button>
   * @param {string} modalId  — id of the <dialog>
   */
  function bindModal(btnId, modalId) {
    const btn   = document.getElementById(btnId);
    const modal = document.getElementById(modalId);

    // Open
    btn.addEventListener('click', () => modal.showModal());

    // Close via ✕ button
    modal.querySelector('.modal-close').addEventListener('click', () => modal.close());

    // Close when clicking the backdrop (outside the inner content)
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.close();
    });
  }

  bindModal('footer-about',    'modal-about');
  bindModal('footer-feedback', 'modal-feedback');
  bindModal('footer-privacy',  'modal-privacy');

});
