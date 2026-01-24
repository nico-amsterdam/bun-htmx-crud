import { test, expect } from './fixtures/index';

test.describe('Fixture Test', () => {
  test('should import fixtures correctly', async ({ page }) => {
    await page.goto('http://localhost:8787/');
    await expect(page).toHaveTitle(/Bun HTMX CRUD/);
  });
});