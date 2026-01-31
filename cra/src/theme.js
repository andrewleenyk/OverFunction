// Minimal theme controller: 'light' | 'dark' | 'system'
export function initTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      setTheme(saved);
    }
  } catch (_) {
    // ignore storage errors
  }
}

export function setTheme(mode) {
  const root = document.documentElement;
  if (mode === 'light' || mode === 'dark') {
    root.setAttribute('data-theme', mode);
    try { localStorage.setItem('theme', mode); } catch (_) {}
  } else {
    // system (or invalid): remove explicit override
    root.removeAttribute('data-theme');
    try { localStorage.setItem('theme', 'system'); } catch (_) {}
  }
}

