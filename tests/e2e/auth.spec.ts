import { test, expect } from './fixtures/index';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ clearAuth, page }) => {
    await clearAuth();
    await page.goto('http://localhost:8787/product-list');
  });

  test('should redirect to login when not authenticated', async ({ page, isAuthenticated }) => {
    const authenticated = await isAuthenticated();
    expect(authenticated).toBe(false);

    // Should be redirected to login page
    await expect(page.locator('h1')).toContainText('Welcome to the Bun HTMX CRUD Demo');
    await expect(page.locator('text=Sign in to continue')).toBeVisible();
    await expect(page.locator('a:has-text("Continue with GitHub")')).toBeVisible();
    await expect(page.locator('a:has-text("Continue with Google")')).toBeVisible();
  });

  test('should redirect to OAuth provider when clicking login', async ({ page, context }) => {
    // Click GitHub login button
    await page.click('a:has-text("Continue with GitHub")');

    // Should redirect to GitHub OAuth
    await expect(page).toHaveURL(/github\.com.*login|github\.com.*oauth/, { timeout: 10000 });
  });

  test('should show user menu when authenticated', async ({ page, mockAuthenticatedUser, isAuthenticated }) => {
    // Mock authenticated user
    await mockAuthenticatedUser({
      email: 'test@example.com',
      name: 'Test User',
      provider: 'google'
    });

    await page.goto('/');

    const authenticated = await isAuthenticated();
    expect(authenticated).toBe(true);

    // Should show user menu
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should handle logout', async ({ page, mockAuthenticatedUser, clearAuth }) => {
    // Mock authenticated user
    await mockAuthenticatedUser({
      email: 'test@example.com',
      name: 'Test User'
    });

    await page.goto('/');

    // Click logout button
    await page.click('[data-testid="user-menu"]');
    await page.click('button:has-text("Sign Out")');

    // Should redirect to login page or show login button
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should protect authenticated routes', async ({ page, clearAuth }) => {
    await clearAuth();

    // Try to access protected page
    await page.goto('/protected');

    // Should redirect to login
    await expect(page).toHaveURL(/.*login|.*auth/);
  });
});