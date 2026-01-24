import { test, expect } from './fixtures/index';

test.describe('Product CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display product list', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bun JSX HTMX CRUD');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('button:has-text("+ Add product")')).toBeVisible();
  });

  test('should search products', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('product');

    // Wait for HTMX to update the results
    await expect(page.locator('tbody#search-results')).toBeVisible();

    // Should show filtered results or no results message
    const results = page.locator('tbody#search-results tr');
    await expect(results.first()).toBeVisible();
  });

  test('should add new product', async ({ page }) => {
    // Click add product button
    await page.click('button:has-text("+ Add product")');

    // Fill form
    await page.fill('input[name="name"]', 'Test Product');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.fill('input[name="price"]', '99.99');

    // Submit form
    await page.click('button:has-text("Save")');

    // Verify product was added
    await expect(page.locator('text=Test Product')).toBeVisible();
    await expect(page.locator('text=Test Description')).toBeVisible();
    await expect(page.locator('text=99.99')).toBeVisible();
  });

  test('should edit product', async ({ page }) => {
    // Click edit button on first product
    const firstProductRow = page.locator('tbody tr').first();
    await firstProductRow.click('button:has-text("Edit")');

    // Modify product details
    const nameInput = page.locator('input[name="name"]');
    await nameInput.clear();
    await nameInput.fill('Updated Product Name');

    // Save changes
    await page.click('button:has-text("Save")');

    // Verify update
    await expect(page.locator('text=Updated Product Name')).toBeVisible();
  });

  test('should delete product', async ({ page }) => {
    // Get initial product count
    const initialCount = await page.locator('tbody tr').count();

    if (initialCount > 0) {
      // Click delete button on first product
      const firstProductRow = page.locator('tbody tr').first();
      await firstProductRow.click('button:has-text("Delete")');

      // Confirm deletion (if confirmation dialog exists)
      // await page.click('button:has-text("Confirm")');

      // Verify product was deleted
      const newCount = await page.locator('tbody tr').count();
      expect(newCount).toBe(initialCount - 1);
    }
  });

  test('should handle form validation', async ({ page }) => {
    // Click add product button
    await page.click('button:has-text("+ Add product")');

    // Try to submit empty form
    await page.click('button:has-text("Save")');

    // Should show validation errors
    await expect(page.locator('text=required')).toBeVisible();
  });
});