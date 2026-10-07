export const themeStorageKey = 'modo-cidadao-theme'
const themeColors = { light: '#0056b3', dark: '#3b82f6' }

// Runs before the body is painted. No user data is interpolated into this script.
export const themeInitScript = `(() => {
  let dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  try {
    const stored = localStorage.getItem('${themeStorageKey}');
    if (stored === 'light' || stored === 'dark') dark = stored === 'dark';
  } catch {}
  document.documentElement.classList.toggle('dark', dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '${themeColors.dark}' : '${themeColors.light}');
})();`

export function storedTheme() {
  try {
    return localStorage.getItem(themeStorageKey)
  } catch {
    return null
  }
}

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? themeColors.dark : themeColors.light)
}
