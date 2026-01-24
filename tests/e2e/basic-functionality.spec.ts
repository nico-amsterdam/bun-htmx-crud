import { test, expect } from '@playwright/test';

test.describe('Basic Application Functionality', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    // Check main title
    await expect(page.locator('h1')).toContainText('Welcome to the Bun HTMX CRUD Demo');

    // Check subtitle
    await expect(page.locator('text=Sign in to continue')).toBeVisible();

    // Check OAuth buttons
    await expect(page.locator('a:has-text("Continue with GitHub")')).toBeVisible();
    await expect(page.locator('a:has-text("Continue with Google")')).toBeVisible();
  });

  test('should have correct page title and meta tags', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    // Page title
    await expect(page).toHaveTitle(/Bun HTMX CRUD/);

    // Meta tags
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', 'width=device-width, initial-scale=1');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'BUN HTMX CRUD project');
  });

  test('should include required CSS and JS files', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    // Check CSS files exist in DOM (not necessarily visible)
    const bootstrapCss = page.locator('link[rel="stylesheet"][href*="bootstrap"]');
    const authCss = page.locator('link[rel="stylesheet"][href*="auth"]');

    await expect(bootstrapCss).toHaveCount(1);
    await expect(authCss).toHaveCount(1);

    // Check JS files exist in DOM
    const htmxScript = page.locator('script[src*="htmx"]');
    const hyperscriptScript = page.locator('script[src*="hyperscript"]');

    await expect(htmxScript).toHaveCount(1);
    await expect(hyperscriptScript).toHaveCount(1);
  });

  test('should have correct OAuth links', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    const githubLink = page.locator('a:has-text("Continue with GitHub")');
    const googleLink = page.locator('a:has-text("Continue with Google")');

    // Check visibility
    await expect(githubLink).toBeVisible();
    await expect(googleLink).toBeVisible();

    // Check href attributes
    const githubHref = await githubLink.getAttribute('href');
    const googleHref = await googleLink.getAttribute('href');

    expect(githubHref).toMatch(/\/auth\/to-github/);
    expect(googleHref).toMatch(/\/auth\/to-google/);
  });

  test('should have manifest and theme configuration', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    // Check manifest
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest');

    // Check theme color
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#fddcd0');

    // Check apple touch icon
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/image/icon-192.png');
  });

  test('should have HTMX configuration', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    const htmxConfig = page.locator('meta[name="htmx-config"]');
    await expect(htmxConfig).toHaveCount(1);

    const configContent = await htmxConfig.getAttribute('content');
    expect(configContent).toContain('"allowEval":false');
    expect(configContent).toContain('"defaultSwapStyle":"outerHTML"');
  });

  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    // Check basic structure exists
    await expect(page.locator('html[lang="en"]')).toHaveCount(1);
    await expect(page.locator('head')).toHaveCount(1);
    await expect(page.locator('body')).toHaveCount(1);

    // Check main content structure
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('main')).toHaveClass(/login-box/);
  });
});