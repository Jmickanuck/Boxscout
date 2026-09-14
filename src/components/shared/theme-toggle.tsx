'use client';
import { useState, useSyncExternalStore } from 'react';
import { browserThemePreference, parseTheme, themeStorageKey, type Theme } from '../../repositories/theme-preference-repository';

const changed = 'boxscout:theme-changed';
function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(changed));
}
function subscribe(notify: () => void) {
  const storageChanged = (event: StorageEvent) => {
    if (event.key === themeStorageKey || event.key === null) applyTheme(browserThemePreference.load());
  };
  window.addEventListener(changed, notify);
  window.addEventListener('storage', storageChanged);
  return () => { window.removeEventListener(changed, notify); window.removeEventListener('storage', storageChanged); };
}
const snapshot = () => parseTheme(document.documentElement.dataset.theme);
const serverSnapshot = (): Theme => 'dark';

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [error, setError] = useState('');
  return <>
    <button className="theme-toggle" type="button" aria-label={theme === 'dark' ? 'Dark mode; switch to Light mode' : 'Light mode; switch to Dark mode'} title="Switch between Dark and Light" onClick={() => {
      const next = theme === 'dark' ? 'light' : 'dark';
      const saved = browserThemePreference.save(next);
      applyTheme(next);
      setError(saved ? '' : 'Theme changed for this visit. Your preference could not be saved.');
    }}>
      <span className="theme-dark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z" /></svg>Dark</span>
      <span className="theme-light" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>Light</span>
    </button>
    {error && <p className="theme-status" role="status">{error}</p>}
  </>;
}
