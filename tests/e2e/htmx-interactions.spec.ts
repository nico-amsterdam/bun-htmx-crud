import { test, expect } from './fixtures/index';

test.describe('HTMX Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should update search results without page reload', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');

    // Type in search box
    await searchInput.fill('product');

    // Wait for HTMX request to complete
    await page.waitForLoadState('networkidle');

    // Check that URL didn't change (no page reload)
    expect(page.url()).toBe('http://localhost:8787/');

    // Results should be updated
    await expect(page.locator('tbody#search-results')).toBeVisible();
  });

  test('should handle inline editing with HTMX', async ({ page }) => {
    // Click edit button
    const firstProductRow = page.locator('tbody tr').first();
    await firstProductRow.click('button:has-text("Edit")');

    // Form should appear inline (no page reload)
    const editForm = page.locator('form').first();
    await expect(editForm).toBeVisible();
    expect(page.url()).toContain('/edit');

    // Cancel editing
    await page.click('button:has-text("Cancel")');

    // Should return to list view
    await expect(page.locator('table')).toBeVisible();
  });

  test('should handle form submission with HTMX', async ({ page }) => {
    // Click add product
    await page.click('button:has-text("+ Add product")');

    // Fill and submit form
    await page.fill('input[name="name"]', 'HTMX Test Product');
    await page.fill('textarea[name="description"]', 'HTMX Description');
    await page.fill('input[name="price"]', '19.99');

    // Submit form
    await page.click('button:has-text("Save")');

    // Should redirect back to list without full page reload
    await expect(page.locator('text=HTMX Test Product')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should handle delete with confirmation', async ({ page }) => {
    // Click delete button
    const firstProductRow = page.locator('tbody tr').first();
    await firstProductRow.click('button:has-text("Delete")');

    // Wait for HTMX confirmation or deletion
    await page.waitForLoadState('networkidle');

    // Row should be removed from table
    await expect(page.locator('text=Product deleted successfully')).toBeVisible();
  });

  test('should handle refresh button', async ({ page }) => {
    // Click refresh button
    await page.click('button:has-text("Refresh")');

    // Wait for HTMX request
    await page.waitForLoadState('networkidle');

    // Table should be updated (no page reload)
    expect(page.url()).toBe('http://localhost:8787/');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should preserve HTMX headers in requests', async ({ page }) => {
    // Listen for HTMX requests
    const htmxRequests = [];
    page.on('request', request => {
      const headers = request.headers();
      if (headers['hx-request'] === 'true') {
        htmxRequests.push({
          url: request.url(),
          headers: headers
        });
      }
    });

    // Trigger HTMX action
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('test');

    // Wait for HTMX request
    await page.waitForTimeout(500);

    // Verify HTMX headers were sent
    expect(htmxRequests.length).toBeGreaterThan(0);
    htmxRequests.forEach(request => {
      expect(request.headers['hx-request']).toBe('true');
    });
  });
});