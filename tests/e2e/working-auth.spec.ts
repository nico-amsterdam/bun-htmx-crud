import { test, expect } from './fixtures/index';

test.describe('Working Authentication Flow', () => {
  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    // Should be redirected to login page
    await expect(page.locator('h1')).toContainText('Welcome to the Bun HTMX CRUD Demo');
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
    await expect(page.locator('a:has-text("Continue with GitHub")')).toBeVisible();
    await expect(page.locator('a:has-text("Continue with Google")')).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');
    await expect(page).toHaveTitle(/Bun HTMX CRUD/);
  });

  test('should show OAuth provider links', async ({ page }) => {
    await page.goto('http://localhost:8787/product-list');

    const githubLink = page.locator('a:has-text("Continue with GitHub")');
    const googleLink = page.locator('a:has-text("Continue with Google")');

    await expect(githubLink).toBeVisible();
    await expect(googleLink).toBeVisible();

    // Check that links point to correct OAuth endpoints
    await expect(githubLink).toHaveAttribute('href', '/auth/to-github');
    await expect(googleLink).toHaveAttribute('href', '/auth/to-google');
  });
});