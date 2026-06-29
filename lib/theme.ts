export type Theme = 'light' | 'dark' | 'system'

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem('theme') as Theme) ?? 'system'
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem('theme', theme)
  applyTheme(theme)
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

export const THEME_SCRIPT = `
(function(){
  var t=localStorage.getItem('theme')||'system';
  var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  if(d)document.documentElement.classList.add('dark');
})();
`
