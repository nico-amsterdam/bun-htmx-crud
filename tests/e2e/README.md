# End-to-End Testing with Playwright

This directory contains end-to-end tests for the Bun HTMX Elysia CRUD application using Playwright.

## 🚀 Quick Start

### Installation
```bash
# Install Playwright browsers (run this first!)
bun playwright:install

# Run all e2e tests
bun test:e2e

# Run tests with UI mode (recommended for development)
bun test:e2e:ui

# Run tests in debug mode
bun test:e2e:debug

# Generate test code by recording user interactions
bun playwright:codegen
```

## 📁 Test Structure

```
tests/e2e/
├── fixtures/
│   ├── auth.fixture.ts      # Authentication helpers
│   └── index.ts            # Export all fixtures
├── product-crud.spec.ts    # Product CRUD operations
├── auth.spec.ts            # Authentication flows
├── i18n.spec.ts            # Internationalization
└── htmx-interactions.spec.ts  # HTMX-specific tests
```

## 🧪 Test Categories

### 1. **Product CRUD Operations** (`product-crud.spec.ts`)
- ✅ Display product list
- ✅ Search functionality with HTMX
- ✅ Add new product
- ✅ Edit existing product
- ✅ Delete product
- ✅ Form validation

### 2. **Authentication** (`auth.spec.ts`)
- ✅ Login/logout flows
- ✅ OAuth provider redirects
- ✅ Protected routes
- ✅ Session management

### 3. **Internationalization** (`i18n.spec.ts`)
- ✅ Language switching (EN, DE, ES, FR)
- ✅ Persistent language preference
- ✅ Translated form labels
- ✅ URL parameter handling

### 4. **HTMX Interactions** (`htmx-interactions.spec.ts`)
- ✅ Search without page reload
- ✅ Inline editing
- ✅ Form submissions
- ✅ Delete confirmations
- ✅ HTMX header verification

## 🛠️ Fixtures

### Authentication Fixture
```typescript
// Mock authenticated user
await mockAuthenticatedUser({
  email: 'test@example.com',
  name: 'Test User',
  provider: 'google'
});

// Clear authentication
await clearAuth();

// Check authentication status
const isAuth = await isAuthenticated();
```

## 🎯 Best Practices

### 1. **HTMX Testing**
- Wait for `networkidle` after HTMX actions
- Check for HTMX headers in requests
- Verify no page reloads occur
- Use `page.waitForTimeout(500)` for debounced operations

### 2. **Authentication Testing**
- Always clear auth state in `beforeEach`
- Use fixtures for consistent auth mocking
- Test both authenticated and unauthenticated states

### 3. **Multi-language Testing**
- Test URL parameters after language changes
- Verify persistence across page reloads
- Check form labels and UI elements

### 4. **General Guidelines**
- Use `data-testid` attributes for stable selectors
- Prefer visible text over CSS selectors when possible
- Use `first()` and `last()` for dynamic lists
- Always wait for elements before interacting

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)
- **Base URL**: `http://localhost:8787`
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5, iPhone 12
- **Retries**: 2 on CI, 0 locally
- **Workers**: 1 on CI, unlimited locally
- **Screenshots**: On failure
- **Videos**: Retain on failure
- **Traces**: On first retry

### Test Environment
- Automatically starts dev server (`bun dev`)
- Waits for server to be ready
- Supports both local and CI environments

## 📊 Running Tests

### Local Development
```bash
# Run all tests
bun test:e2e

# Run specific test file
bun test:e2e product-crud.spec.ts

# Run with UI (interactive)
bun test:e2e:ui

# Debug mode
bun test:e2e:debug
```

### CI/Production
```bash
# Run with coverage
bun test:e2e:coverage

# Run specific browser
bun test:e2e --project=chromium

# Run headed mode for debugging
bun test:e2e --headed
```

## 🚨 Common Issues

### 1. **Dev Server Not Starting**
- Ensure `bun dev` works standalone
- Check port 8787 is available
- Verify wrangler configuration

### 2. **HTMX Timing Issues**
- Use `page.waitForLoadState('networkidle')`
- Add explicit waits for debounced operations
- Check for HTMX request headers

### 3. **Authentication Problems**
- Clear cookies between tests
- Use fixtures for consistent state
- Mock OAuth flows appropriately

### 4. **Database State**
- Consider resetting database between test suites
- Use unique data for each test
- Clean up test data after tests

## 🔍 Debugging

### View Test Reports
```bash
# Open HTML report
npx playwright show-report

# View trace files
npx playwright show-trace path/to/trace.zip
```

### Code Generation
```bash
# Record user interactions
bun playwright:codegen

# This opens a browser where you can interact with your app
# Playwright will generate the test code for you
```

## 🚀 Next Steps

1. **Add More Test Coverage**:
   - Error handling scenarios
   - Network failure recovery
   - Concurrent user operations
   - Performance testing

2. **Test Data Management**:
   - Database seeding for tests
   - Test data cleanup
   - Environment-specific data

3. **CI Integration**:
   - Add to GitHub Actions workflow
   - Parallel test execution
   - Test result reporting

4. **Visual Testing**:
   - Screenshot comparison
   - Responsive design testing
   - Cross-browser visual regression

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [HTMX Testing Guide](https://htmx.org/docs/#testing)
- [Best Practices for Testing HTMX Applications](https://david.guillot.me/posts/tech/testing-htmx-applications/)