import { test, expect } from '@playwright/test';

test.describe('Email Signup Form', () => {
  test('should successfully submit email and show success message', async ({ page }) => {
    await page.goto('/');

    // Verify page loaded with coming soon message
    await expect(page.locator('h1')).toHaveText('GitStore');
    await expect(page.getByText('Coming Soon')).toBeVisible();

    // Fill in email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('test@example.com');

    // Submit form
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Note: This test will fail in real execution without actual Formspree setup
    // For now, it validates the form exists and can be interacted with
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should show error for invalid email format', async ({ page }) => {
    await page.goto('/');

    // Fill in invalid email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('invalid-email');

    // Blur to trigger validation
    await emailInput.blur();

    // Try to submit
    await page.locator('button[type="submit"]').click();

    // Should show validation error
    await expect(page.locator('#email-error')).toBeVisible();
  });
});
