import { test, expect, type Page } from '@playwright/test';

async function chooseTheme(page: Page, theme: string) {
  await page.getByRole('button', { name: /^Color theme:/ }).click();
  await page.getByRole('menuitemradio', { name: theme, exact: true }).click();
}

test('follows system changes until the visitor chooses a theme, then remembers the choice', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const theme = page.getByRole('button', { name: /^Color theme:/ });
  await expect(theme).toHaveText('System');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('.site-header .brand-mark-dark')).toBeVisible();

  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await chooseTheme(page, 'Dark');
  await page.reload();
  await expect(theme).toHaveText('Dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await chooseTheme(page, 'System');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(theme).toHaveText('System');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('theme control works without persistent storage and fits on a small screen', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new Error('Storage unavailable');
      },
    });
  });
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/');
  const theme = page.getByRole('button', { name: /^Color theme:/ });
  await chooseTheme(page, 'Dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(theme).toBeInViewport();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
    .toBe(true);
  await chooseTheme(page, 'Light');
  await expect(page.locator('.site-header .brand-mark-light')).toBeVisible();
});

test('styled theme menu supports keyboard navigation and dismissal', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: /^Color theme:/ });
  await trigger.focus();
  await trigger.press('ArrowDown');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveText('Dark');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('menu')).toBeHidden();
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.click();
  await page.locator('h1').click();
  await expect(page.getByRole('menu')).toBeHidden();
});
