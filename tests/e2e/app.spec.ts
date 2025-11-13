import { expect, test } from '@playwright/test';

test.describe('Application SIG 3D', () => {
  test('should load the application and display the 3D map', async ({ page }) => {
    await page.goto('/');

    // Wait for the Cesium viewer to load
    await page.waitForSelector('.cesium-viewer', { timeout: 10000 });

    // Check that the Cesium viewer is visible
    const viewer = page.locator('.cesium-viewer');
    await expect(viewer).toBeVisible();
  });

  test('should display Cesium native controls', async ({ page }) => {
    await page.goto('/');

    // Wait for the Cesium viewer to load
    await page.waitForSelector('.cesium-viewer', { timeout: 10000 });

    // Check for the home button (native Cesium control)
    const homeButton = page.locator('.cesium-home-button');
    await expect(homeButton).toBeVisible();

    // Check for the navigation help button (native Cesium control)
    const helpButton = page.locator('.cesium-navigation-help-button');
    await expect(helpButton).toBeVisible();
  });

  test('should display geolocation button in bottom right', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to load
    await page.waitForSelector('.cesium-viewer');

    // Check for geolocation button
    const geoButton = page.locator('button:has-text("Me localiser")');
    await expect(geoButton).toBeVisible();

    // Verify button is positioned in bottom right
    const geoButtonBox = await geoButton.boundingBox();
    const viewportSize = page.viewportSize();

    if (geoButtonBox && viewportSize) {
      // Button should be in the right half and bottom half of the viewport
      expect(geoButtonBox.x).toBeGreaterThan(viewportSize.width / 2);
      expect(geoButtonBox.y).toBeGreaterThan(viewportSize.height / 2);
    }
  });

  test('should have no console errors on load', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForSelector('.cesium-viewer', { timeout: 10000 });

    // Filter out known Cesium warnings
    const actualErrors = consoleErrors.filter(
      (error) => !error.includes('Ion.defaultAccessToken') && !error.includes('deprecate')
    );

    expect(actualErrors).toHaveLength(0);
  });
});
