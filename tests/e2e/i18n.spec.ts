import { test, expect } from './fixtures/index';

test.describe('Internationalization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should default to English', async ({ page }) => {
    // Check for English text
    await expect(page.locator('h1')).toContainText('Bun JSX HTMX CRUD');
    await expect(page.locator('button:has-text("+ Add product")')).toBeVisible();
  });

  test('should switch to German', async ({ page }) => {
    // Click language selector
    await page.click('button:has-text("Lang")');
    await page.click('button:has-text("Deutsch")');

    // Check for German text
    await expect(page.locator('button:has-text("+ Produkt hinzufügen")')).toBeVisible();

    // Check URL parameter
    expect(page.url()).toContain('lang=de');
  });

  test('should switch to Spanish', async ({ page }) => {
    await page.click('button:has-text("Lang")');
    await page.click('button:has-text("Español")');

    await expect(page.locator('button:has-text("+ Añadir producto")')).toBeVisible();
    expect(page.url()).toContain('lang=es');
  });

  test('should switch to French', async ({ page }) => {
    await page.click('button:has-text("Lang")');
    await page.click('button:has-text("Français")');

    await expect(page.locator('button:has-text("+ Ajouter produit")')).toBeVisible();
    expect(page.url()).toContain('lang=fr');
  });

  test('should persist language preference', async ({ page }) => {
    // Switch to German
    await page.click('button:has-text("Lang")');
    await page.click('button:has-text("Deutsch")');

    // Navigate away and back
    await page.reload();

    // Should still be in German
    await expect(page.locator('button:has-text("+ Produkt hinzufügen")')).toBeVisible();
  });

  test('should translate form labels', async ({ page }) => {
    // Switch to German
    await page.click('button:has-text("Lang")');
    await page.click('button:has-text("Deutsch")');

    // Open add product form
    await page.click('button:has-text("+ Produkt hinzufügen")');

    // Check form labels are translated
    await expect(page.locator('label:has-text("Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Beschreibung")')).toBeVisible();
    await expect(page.locator('label:has-text("Preis")')).toBeVisible();
  });
});