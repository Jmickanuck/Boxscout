export type Theme = 'dark' | 'light';
export const themeStorageKey = 'boxscout:theme:v1';
export interface ThemeStorage { getItem(key: string): string | null; setItem(key: string, value: string): void }
export interface ThemePreferenceRepository { load(): Theme; save(theme: Theme): boolean }

export function parseTheme(value: unknown): Theme { return value === 'light' ? 'light' : 'dark'; }

export function createThemePreferenceRepository(storage: () => ThemeStorage): ThemePreferenceRepository {
  return {
    load() { try { return parseTheme(storage().getItem(themeStorageKey)); } catch { return 'dark'; } },
    save(theme) {
      if (theme !== 'dark' && theme !== 'light') return false;
      try { storage().setItem(themeStorageKey, theme); return true; } catch { return false; }
    },
  };
}
export const browserThemePreference = createThemePreferenceRepository(() => window.localStorage);

// Runs synchronously in <head>, before body paint and before React hydration.
// Share the parser and key with the repository; never interpolate user input.
export const themeInitializationScript = `(()=>{const parse=${parseTheme.toString()};let theme='dark';try{theme=parse(localStorage.getItem(${JSON.stringify(themeStorageKey)}))}catch{}document.documentElement.dataset.theme=theme})()`;
