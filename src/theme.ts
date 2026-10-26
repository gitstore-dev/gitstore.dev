type ThemePreference = 'system' | 'light' | 'dark';
const root = document.documentElement;
const picker = document.querySelector<HTMLElement>('.theme-picker')!;
const trigger = document.getElementById('theme-trigger') as HTMLButtonElement;
const menu = document.getElementById('theme-menu')!;
const items = Array.from(menu.querySelectorAll<HTMLButtonElement>('[data-theme-choice]'));
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let preference = (root.dataset.themePreference || 'system') as ThemePreference;
function applyTheme() {
  const theme = preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
  root.dataset.theme = theme;
  root.dataset.themePreference = preference;
  const label = preference[0].toUpperCase() + preference.slice(1);
  document.getElementById('theme-label')!.textContent = label;
  trigger.setAttribute('aria-label', `Color theme: ${label}`);
  items.forEach((item) =>
    item.setAttribute('aria-checked', String(item.dataset.themeChoice === preference))
  );
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')!.content =
    theme === 'dark' ? '#101b18' : '#f7f6f0';
}
function closeMenu(restoreFocus = false) {
  menu.classList.add('hidden');
  trigger.setAttribute('aria-expanded', 'false');
  if (restoreFocus) trigger.focus();
}
function openMenu(last = false) {
  menu.classList.remove('hidden');
  trigger.setAttribute('aria-expanded', 'true');
  const selected = items.find((item) => item.getAttribute('aria-checked') === 'true')!;
  (last ? items[items.length - 1] : selected).focus();
}
trigger.addEventListener('click', () =>
  menu.classList.contains('hidden') ? openMenu() : closeMenu()
);
trigger.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  openMenu(event.key === 'ArrowUp');
});
items.forEach((item, index) => {
  item.addEventListener('click', () => {
    preference = item.dataset.themeChoice as ThemePreference;
    try {
      if (preference === 'system') localStorage.removeItem('gitstore-theme');
      else localStorage.setItem('gitstore-theme', preference);
    } catch {
      /* Theme selection works even when storage is unavailable. */
    }
    applyTheme();
    closeMenu(true);
  });
  item.addEventListener('keydown', (event) => {
    let next: number;
    if (event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowUp') next = (index + items.length - 1) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    items[next].focus();
  });
});
picker.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu(true);
  }
});
document.addEventListener('pointerdown', (event) => {
  if (!picker.contains(event.target as Node)) closeMenu();
});
picker.addEventListener('focusout', (event) => {
  if (!picker.contains(event.relatedTarget as Node)) closeMenu();
});
systemTheme.addEventListener('change', () => {
  if (preference === 'system') applyTheme();
});
window.addEventListener('storage', (event) => {
  if (event.key !== 'gitstore-theme' && event.key !== null) return;
  preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : 'system';
  applyTheme();
});
applyTheme();
