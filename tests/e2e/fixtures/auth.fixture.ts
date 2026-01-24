import { test as base, expect } from '@playwright/test';

export interface AuthUser {
  email: string;
  name: string;
  provider: 'google' | 'github';
}

export interface AuthFixture {
  // Mock authenticated user for testing
  mockAuthenticatedUser: (user?: Partial<AuthUser>) => Promise<void>;
  // Clear authentication state
  clearAuth: () => Promise<void>;
  // Check if user is authenticated
  isAuthenticated: () => Promise<boolean>;
}

/**
 * Authentication fixture for handling OAuth flows in tests.
 * This fixture helps manage authentication state without requiring real OAuth providers in tests.
 */
export const test = base.extend<AuthFixture>({
  // Mock authentication for testing purposes
  mockAuthenticatedUser: async ({ page }, use) => {
    const mockUser = async (user: Partial<AuthUser> = {}) => {
      const defaultUser = {
        email: 'test@example.com',
        name: 'Test User',
        provider: 'google' as const,
        ...user
      };

      // Set authentication cookie or session
      // This would need to be implemented based on your auth system
      try {
        await page.evaluate((userData) => {
          // Mock the authentication state
          localStorage.setItem('test_auth_user', JSON.stringify(userData));
        }, defaultUser);
      } catch (error) {
        // If localStorage is not available, we'll need to use cookies or another method
        console.log('localStorage not available for auth mocking');
      }
    };

    await use(mockUser);
  },

  // Clear authentication state
  clearAuth: async ({ page }, use) => {
    const clear = async () => {
      await page.context().clearCookies();
      try {
        await page.evaluate(() => {
          localStorage.removeItem('test_auth_user');
          sessionStorage.clear();
        });
      } catch (error) {
        // Ignore localStorage errors - might not be available in some contexts
        console.log('localStorage not available, clearing cookies only');
      }
    };

    await use(clear);
  },

  // Check authentication status
  isAuthenticated: async ({ page }, use) => {
    const check = async () => {
      // Check for auth cookie or session indicator
      const cookies = await page.context().cookies();
      const hasAuthCookie = cookies.some(cookie =>
        cookie.name.includes('session') || cookie.name.includes('auth')
      );

      // Also check for user menu or auth indicators in page
      const hasUserMenu = await page.locator('[data-testid="user-menu"]').isVisible().catch(() => false);

      return hasAuthCookie || hasUserMenu;
    };

    await use(check);
  },
});

export { expect } from '@playwright/test';