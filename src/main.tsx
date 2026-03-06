import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ─── Global Styles ────────────────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  /* ── Design Tokens ─────────────────────────────────────────── */
  :root {
    --color-bg:              #0C0E14;
    --color-surface:         #131720;
    --color-surface-raised:  #1A2030;
    --color-border:          #252D3D;

    --color-text:            #E8EBF0;
    --color-text-secondary:  #A8B2C3;
    --color-text-muted:      #5C6A82;

    --color-amber:           #F59E0B;
    --color-teal:            #06B6D4;
    --color-green:           #10B981;
    --color-orange:          #F97316;
    --color-red:             #EF4444;
    --color-purple:          #8B5CF6;

    --font-display:  'Playfair Display', Georgia, serif;
    --font-mono:     'IBM Plex Mono', 'Courier New', monospace;
    --font-body:     'Sora', system-ui, sans-serif;
  }

  /* ── Reset ──────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    height: 100%;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  #root { height: 100%; }

  /* ── Scrollbar ──────────────────────────────────────────────── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--color-bg); }
  ::-webkit-scrollbar-thumb { background: var(--color-border); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }

  /* ── Inputs / Selects ───────────────────────────────────────── */
  input, textarea, select {
    color-scheme: dark;
  }
  input:focus, textarea:focus, select:focus {
    border-color: var(--color-amber) !important;
    box-shadow: 0 0 0 2px rgba(245,158,11,0.12);
  }
  option { background: var(--color-surface-raised); }

  /* ── Animations ─────────────────────────────────────────────── */
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(-12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
