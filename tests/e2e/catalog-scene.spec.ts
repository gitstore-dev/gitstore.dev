import { test, expect } from '@playwright/test';

// Explicit software backend makes headless WebGPU screenshots reproducible.
test.use({
  launchOptions: {
    args:
      process.platform === 'linux'
        ? ['--enable-unsafe-webgpu', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']
        : ['--enable-unsafe-webgpu', '--use-angle=swiftshader'],
  },
});

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
    await page.addInitScript(() => {
      if (!navigator.gpu) return;
      const requestAdapter = navigator.gpu.requestAdapter.bind(navigator.gpu);
      const released = new Promise<void>((resolve) =>
        window.addEventListener('test-release-gpu', () => resolve(), { once: true })
      );
      navigator.gpu.requestAdapter = async (options) => {
        await released;
        return requestAdapter(options);
      };
    });
    await page.goto('/');
    // A selection made before the adapter resolves must survive initialization.
    await page.getByRole('tab', { name: '03 Recover' }).click();
    await page.evaluate(() => window.dispatchEvent(new Event('test-release-gpu')));
    const scene = page.locator('#catalog-scene');
    // Use the application's actual initialization result for capability detection.
    await expect(async () => {
      const state = await scene.getAttribute('data-gpu-state');
      expect(['requesting-adapter', 'requesting-device', 'compiling']).not.toContain(state);
    }).toPass({ timeout: 20000 });
    const state = await scene.getAttribute('data-gpu-state');
    const hasGpu = await page.evaluate(() => !!navigator.gpu);
    test.skip(
      !hasGpu || state === 'no-adapter' || state === 'no-canvas-context',
      'This environment cannot present a WebGPU canvas; the fallback is tested separately.'
    );
    try {
      await expect(scene).toHaveAttribute('data-renderer', 'webgpu', { timeout: 20000 });
    } catch (error) {
      console.log(
        await page.evaluate(() => ({
          state: document.getElementById('catalog-scene')?.dataset.gpuState,
          hidden: document.hidden,
          rect: document.getElementById('catalog-scene')?.getBoundingClientRect().toJSON(),
        }))
      );
      throw error;
    }
    await expect(scene).toHaveAttribute('data-scene-step', '2');
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
