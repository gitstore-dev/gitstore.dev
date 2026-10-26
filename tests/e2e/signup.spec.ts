import { test, expect } from '@playwright/test';

test.describe('Marketing page', () => {
  test('submits the early-access form and confirms signup', async ({ page }) => {
    await page.route('https://formspree.io/f/**', async (route) => {
      expect(route.request().postDataJSON().email).toBe('test@example.com');
      await route.fulfill({ json: { ok: true } });
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('With an undo');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#submit-btn').click();
    await expect(page.locator('#success-message')).toBeVisible();
    await expect(page.locator('#signup-form')).toBeHidden();
  });

  test('shows an error for an invalid email and clears it when edited', async ({ page }) => {
    await page.goto('/');
    await page.locator('#email').fill('invalid-email');
    await page.locator('#email').blur();
    await expect(page.locator('#email-error')).toBeVisible();
    await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
    await page.locator('#email').fill('valid@example.com');
    await expect(page.locator('#email-error')).toBeHidden();
    await expect(page.locator('#email')).not.toHaveAttribute('aria-invalid');
  });

  test('keeps the form usable after a network failure', async ({ page }) => {
    await page.route('https://formspree.io/f/**', (route) => route.abort());
    await page.goto('/');
    await page.locator('#email').fill('test@example.com');
    await page.locator('#submit-btn').click();
    await expect(page.locator('#error-message')).toBeVisible();
    await expect(page.locator('#submit-btn')).toBeEnabled();
    await expect(page.locator('#email')).toHaveValue('test@example.com');
  });

  test('supports mouse and keyboard exploration of the workflow', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: '02 Review' }).click();
    await expect(page.locator('#demo-command')).toHaveText('git diff main...holiday-drop');
    await page.getByRole('tab', { name: '02 Review' }).press('ArrowRight');
    await expect(page.getByRole('tab', { name: '03 Recover' })).toBeFocused();
    await expect(page.locator('#demo-command')).toHaveText('git revert <campaign-commit>');
    await page.getByRole('tab', { name: '03 Recover' }).press('Home');
    await expect(page.getByRole('tab', { name: '01 Prepare' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });

  test('fits a mobile viewport and navigates to the signup', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
      .toBe(true);
    await page.getByRole('link', { name: 'Request early access' }).click();
    await expect(page.locator('#email')).toBeInViewport();
  });
});
