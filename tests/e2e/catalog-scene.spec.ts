import { test, expect } from '@playwright/test';

// Explicit software backend makes headless WebGPU screenshots reproducible.
test.use({ launchOptions: { args: ['--enable-unsafe-webgpu', '--use-angle=swiftshader'] } });

test('keeps the illustration and workflow usable when WebGPU is unavailable', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }));
  await page.goto('/');
  await expect(page.locator('#catalog-scene')).toHaveAttribute('data-renderer', 'poster');
  await expect(page.locator('.scene-poster')).toBeVisible();
  await expect(page.locator('#scene-motion')).toBeHidden();
  await page.getByRole('tab', { name: '03 Recover' }).click();
  await expect(page.locator('#demo-title')).toHaveText('A way back, without losing the story.');
});

test.describe('WebGPU rendering', () => {
  test('renders moving pixels, pauses, and honors reduced motion', async ({ page }) => {
    test.setTimeout(60000);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'warning' || message.type() === 'error') console.log(message.text());
    });
    await page.goto('/');
    const available = await page.evaluate(async () => !!(await navigator.gpu?.requestAdapter()));
    test.skip(
      !available,
      'This environment has no WebGPU adapter; the fallback is tested separately.'
    );
    const scene = page.locator('#catalog-scene');
    await expect(scene).toHaveAttribute('data-renderer', 'webgpu', { timeout: 20000 });
    const canvas = page.locator('#catalog-canvas');
    const first = await canvas.screenshot();
    await page.waitForTimeout(250);
    const second = await canvas.screenshot();
    expect(first.equals(second)).toBe(false);
    await page.getByRole('button', { name: 'Pause scene animation' }).press('Enter');
    await expect(page.getByRole('button', { name: 'Play scene animation' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    // Let the pointer leave the scene and camera interpolation settle.
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000);
    const paused = await canvas.screenshot();
    await page.waitForTimeout(150);
    expect(paused.equals(await canvas.screenshot())).toBe(true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.locator('#scene-motion')).toBeHidden();
    await page.getByRole('tab', { name: '02 Review' }).click();
    await expect(page.locator('#demo-badge')).toHaveText('In review');
    expect(errors).toEqual([]);
  });
});
