import { test, expect } from '@playwright/test';

test.describe('Simple Test', () => {
  test('basic test', async ({ page }) => {
    await page.goto('http://localhost:8787/');
    await expect(page).toHaveTitle(/Bun HTMX CRUD/);
  });
});