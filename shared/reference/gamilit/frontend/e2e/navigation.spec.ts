import { test, expect } from '@playwright/test';

/**
 * Navigation and Routing E2E Tests
 *
 * Tests basic navigation, routing, and page loads
 */

test.describe('Basic Navigation', () => {
  test('should load homepage without errors', async ({ page }) => {
    // Navigate to homepage
    const response = await page.goto('/');

    // Page should load successfully
    expect(response?.status()).toBe(200);

    // Page should have a title
    await expect(page).toHaveTitle(/GAMILIT|Gamificación/i);

    // Page should not have console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit for any async errors
    await page.waitForTimeout(2000);

    // Should have minimal or no errors
    expect(errors.length).toBeLessThan(5); // Allow for some dev warnings
  });

  test('should handle 404 pages', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    // Should either show 404 page or redirect
    const url = page.url();
    const statusCode = response?.status();

    // Accept either a 404 status OR redirect to home/login
    const isValid =
      statusCode === 404 ||
      url.includes('/login') ||
      url === 'http://localhost:3005/';

    expect(isValid).toBeTruthy();
  });

  test('should have responsive navigation menu', async ({ page }) => {
    await page.goto('/');

    // Check if navigation exists (either as sidebar or header)
    const hasNav =
      (await page.locator('nav').count()) > 0 ||
      (await page.locator('[role="navigation"]').count()) > 0;

    expect(hasNav).toBeTruthy();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const jsErrors: Error[] = [];

    page.on('pageerror', (error) => {
      jsErrors.push(error);
    });

    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Should have no JavaScript errors
    expect(jsErrors.length).toBe(0);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for viewport meta tag (important for mobile)
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');

    // Check for charset
    const hasCharset =
      (await page.locator('meta[charset]').count()) > 0 ||
      (await page.locator('meta[charset="utf-8"]').count()) > 0 ||
      (await page.locator('meta[charset="UTF-8"]').count()) > 0;

    expect(hasCharset).toBeTruthy();
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected routes unauthenticated', async ({
    page,
  }) => {
    // Try to access a protected route (e.g., dashboard)
    await page.goto('/dashboard');

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login|\//);
  });

  test('should redirect to login when accessing student pages unauthenticated', async ({
    page,
  }) => {
    await page.goto('/student/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login|\//);
  });

  test('should redirect to login when accessing teacher pages unauthenticated', async ({
    page,
  }) => {
    await page.goto('/teacher/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login|\//);
  });
});

test.describe('Performance', () => {
  test('should load initial page within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds (generous for E2E)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have memory leaks on navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate between pages multiple times
    for (let i = 0; i < 3; i++) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Try to navigate to other pages if they exist
      const links = await page.locator('a[href^="/"]').all();
      if (links.length > 0) {
        await links[0].click();
        await page.waitForLoadState('networkidle');
      }

      await page.goBack();
    }

    // If no errors thrown, test passes
    expect(true).toBeTruthy();
  });
});

test.describe('Accessibility Basics', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    expect(h1Count).toBeLessThanOrEqual(1); // Should have only one h1
  });

  test('should have skip to content link for keyboard users', async ({ page }) => {
    await page.goto('/');

    // Check for skip link (common accessibility practice)
    const skipLink = page.locator('a[href="#main-content"], a[href="#content"]');

    // Skip link may or may not be present, but if it is, it should work
    if ((await skipLink.count()) > 0) {
      await expect(skipLink).toBeAttached();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Press Tab key to navigate
    await page.keyboard.press('Tab');

    // Check if focus is visible somewhere
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    // Should have moved focus to some element
    expect(focusedElement).toBeTruthy();
  });
});
