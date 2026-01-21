# AGENTS.md

This document provides guidance for AI assistants working with this codebase. This project is a **production-ready template** for building server-side rendered web applications on Cloudflare Workers, featuring secure authentication, modern security practices, and edge computing capabilities.

## Project Purpose

This application serves as a **comprehensive template/boilerplate** for creating authenticated, secure web applications that deploy to Cloudflare Workers at the edge. The products table is merely an example CRUD implementation—replace it with your own domain models and business logic.

## Technology Stack

- **Runtime**: Bun (JavaScript runtime and package manager)
- **Framework**: Elysia (lightweight, high-performance web framework)
- **Frontend**: HTMX for progressive enhancement, server-side JSX rendering
- **Database**: Cloudflare D1 (SQLite) with Drizzle ORM
- **Authentication**: OAuth2 with Google and GitHub providers
- **DI**: TypeDI container for dependency injection
- **Deployment**: Cloudflare Workers (edge computing)

## User Interface

The application uses HTMX for progressive enhancement. See `README.md` for the detailed wireframe.

Quick reference UI structure:

```
Header: Bun JSX HTMX CRUD  [User] [Sign Out] [Lang ▼]
Actions: [+ Add product] [Search product]
Table: Name | Description | Price | Actions
Row: product1 | desc | 10.00 € | [Edit] [Delete]
```

Key UI elements:
- **Header**: Authenticated user menu, language selector
- **Add button**: Opens inline form or modal for new entries
- **Search**: Filters table rows server-side via HTMX
- **Actions column**: Edit and delete buttons per row

UI files:
- `src/routes/product/list.tsx`: Main product list view
- `src/routes/product/edit.tsx`: Inline edit form

## Key Architectural Patterns

### 1. Modular Route Controllers

Each feature is self-contained with its own controller:

```
src/routes/
├── auth/          # OAuth authentication (Google/GitHub)
├── product/       # Example CRUD feature (replace with your domain)
└── helper/        # Shared utilities and middleware
```

To add a new feature:
1. Create a new directory in `src/routes/`
2. Define a controller using `new Elysia(ElysiaSettings).use(...).get(...).post(...)`
3. Export and register in `src/index.ts`

### 2. Middleware Composition

Routes use middleware stacks applied in order:

```typescript
export const productController = new Elysia(ElysiaSettings)
  .use(productListController)           // Feature routes
  .use(htmxRedirect)                    // HTMX checks
  .use(addProductController)            // More routes
  .use(editProductController)
  .use(delProductController)
```

### 3. Dependency Injection

Database and environment injected via TypeDI:

```typescript
const db = drizzle(env.DB, { schema, logger: true })
Container.set('DrizzleDB', db)
Container.set('env', env)

// Later in routes:
const db = getDB() // Container.get<DrizzleD1Database>
```

### 4. Server-Side Rendering

All HTML generated server-side using JSX with custom `Html.createElement` factory. Each route defines its own component functions that return JSX elements:

```typescript
function ProductList(page: PageType): JSX.Element {
  return (
    <tbody id="search-results">
      {page.data.products.map((product) => (
        <Product product={product} page={page} />
      ))}
    </tbody>
  )
}
```

### 5. HTMX Integration

HTMX for dynamic interactions without full page reloads:

```typescript
<button type="button"
  hx-get={`/product/${id}/edit${page.locale.langQueryParam}`}
  hx-push-url="true"
  hx-target="#main">
  {_('Edit')}
</button>
```

#### Hyperscript

Inline [Hyperscript](https://hyperscript.org/) adds client-side logic:

```typescript
<button
  _="on click toggle .hidden on #target"
  class="btn">
  Toggle
</button>
```

**Security note**: When loading content from untrusted external sources (CMS, translations, SVGs), sanitize to remove inline scripts (`_` and `data-script` attributes, SVG with inline scripts, etc.).

#### HTMX Extensions

For complex client-side behavior beyond Hyperscript, build custom [HTMX extensions](https://htmx.org/extensions/building/):
1. Put source in `client/src` directory
2. Transform with `bun build:client` into minified JavaScript
3. Include scripts in `basePage.ts`

## Authentication Implementation

### Session Management

The authentication system uses **signed cookies** with comprehensive security:

- **Cookie structure**: `{ id, login, name, email, csrfToken, userAgent, ipAddress, image }`
- **Signing**: Cookies are cryptographically signed to prevent tampering
- **Validation**: On each request, validates userAgent and IP address match
- **CSRF protection**: Secure random tokens generated for each session

See `src/routes/auth/index.tsx` for the `authRedirect` middleware.

### OAuth2 Flow

1. User clicks login button → redirect to OAuth provider
2. State token generated with HMAC-SHA256 including:
   - Client IP address
   - User agent (normalized)
   - Forwarded protocol
   - Secret pepper
3. OAuth callback validates state and exchanges code for token
4. Token validated with provider before creating session
5. Session cookie set with all security context

See `src/routes/auth/google.tsx` and `src/routes/auth/github.tsx`.

### Security Helper

Key security utilities in `src/routes/auth/securityHelper.ts`:

- `generateSecureRandomString()`: Cryptographically secure random IDs
- `getIp()`: Extracts real client IP from Cloudflare headers
- `stripMobileDesktopFromUserAgent()`: Normalizes UA for session binding
- `calcStateHmac()`: Creates tamper-resistant state tokens

## Security Best Practices

### Content Security Policy

CSP headers are applied to all responses:

```typescript
headers['Content-Security-Policy'] =
  "default-src 'self';img-src 'self' data: https://*.googleusercontent.com/ https://avatars.githubusercontent.com/;"
```

See `src/routes/helper/securityHeaders.tsx`.

### Cookie Security

Configured in `src/config/index.ts`:

```typescript
cookie: {
  sameSite: "lax",
  httpOnly: true,        // Prevents JavaScript access
  secrets: [...],        // Used for signing
  sign: true,            // Enable cryptographic signing
  path: "/",
}
```

### CSRF Protection

- CSRF tokens generated per session
- Validated on all state-changing operations
- Tokens included in hidden form fields

### Session Binding

Sessions are bound to:
- Client IP address (from Cloudflare headers)
- Normalized user agent string

This prevents session hijacking via cookie theft.

### Fetch Metadata Protection

The application uses [Fetch Metadata](https://web.dev/articles/fetch-metadata) request headers to reject cross-site attacks:

```typescript
// src/routes/helper/securityHeaders.tsx
export function allowRequest(method: string, path: string, headers: Record<string, string | undefined>): boolean {
  // Allows same-origin requests (sec-fetch-site: same-origin)
  // Allows browser-initiated requests (sec-fetch-site: none)
  // Allows simple top-level navigations (GET, navigate mode)
  // Exempts /health, /favicon.ico, /image/* paths
  // Returns 403 for all other cross-site requests
}
```

This protects against:
- **CSRF attacks**: Rejects cross-site POST/PUT/DELETE requests
- **XSSI (Cross-Site Script Inclusion)**: Prevents loading JSON via script tags
- **Timing attacks**: Makes enumeration harder for attackers

The function is called in `src/index.ts` as a global `onBeforeHandle` hook that returns `403 Forbidden` for rejected requests.

## Database Schema

The `products` table demonstrates schema patterns with Drizzle ORM:

```typescript
export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  price: integer('price'),  // Stored as cents
  createdBy: text('created_by').notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
  modifiedBy: text('modified_by'),
  modifiedAt: integer("modified_at", { mode: "timestamp_ms" }),
})
```

To add your own tables:
1. Define in `src/db/schema.ts`
2. Export types in `src/db/index.ts`
3. Create migrations with `bun migrate:create`
4. Apply with `bun migrate:dev` or `bun migrate`

## Internationalization

Server-side i18n in `src/i18n/translations.ts`:
- `translate()`: Translation function with placeholder `{0}` replacement
- `newLocale()`: Creates locale object with translation function and langQueryParam

Middleware in `src/i18n/lang.ts`:
- `getLang()`: Extracts language from query param (?lang=xx) or Accept-Language header
- `getContentLanguage()`: Returns content-language header value or default 'en'
- `setContentLanguage()`: Sets content-language header on response
- `NON_DEFAULT_LANGUAGES`: Supported non-English languages ['de', 'es', 'fr']

Supported languages: English (default), German, Spanish, French

## Development Workflow

### Local Development

```bash
bun install                    # Install dependencies
bun migrate:dev               # Apply migrations to local D1
bun dev                       # Start dev server at localhost:8787
bun dbcat:db:dev              # View local database content
```

### Database Operations

```bash
bun migrate:create            # Generate new migration files
bun migrate:dev               # Apply to local database
bun migrate                   # Apply to production database
bun introspect:db             # Introspect database schema using Drizzle Kit
bun studio:db:dev             # Open Drizzle Studio (local)
bun studio:db                 # Open Drizzle Studio (production)
bun test:db:dev               # Test local database connection
```

### Deployment

```bash
bun deploy:app                # Deploy to Cloudflare Workers
bun secret:google             # Set Google OAuth secret
bun secret:github             # Set GitHub OAuth secret
bun logtail                   # Stream production logs
bun studio:db                 # Open Drizzle Studio (production)
```

### Configuration

Environment variables in `.env` and `wrangler.jsonc`:

```json
{
  "vars": {
    "GITHUB_CLIENT_ID": "...",
    "GOOGLE_CLIENT_ID": "..."
  }
}
```

Secrets (never commit):
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_SECRET`

Set via: `bun secret:google` and `bun secret:github`

## Testing

This project includes 100+ unit tests covering:
- i18n translations and locale middleware
- Authentication security helpers
- HTMX request/response headers
- Base HTML template generation
- Elysia configuration and cookie security

Run tests:
```bash
bun test                   # Run all tests
bun test --coverage        # Run with coverage report
bun test --watch           # Watch and re-run on changes
```

## TypeScript Configuration

Run type checking:
```bash
bun typecheck              # Check types without emitting files
bun typecheck:watch        # Watch mode for auto-reload on changes
```

Generate types from Cloudflare Worker config:
```bash
bun update:types           # Regenerate types from wrangler.jsonc
```

## Cloudflare Workers Configuration

The `wrangler.jsonc` configures:

- **Assets**: Static file serving from `./public`
- **D1 Database**: Bound via `DB` binding
- **Observability**: Enabled for logging
- **Compatibility**: Node.js compatibility for crypto modules

## HTMX Response Headers

Custom utilities in `src/htmx/index.ts` for HTMX responses:

```typescript
export function isHtmxEnabled(request: Request) {
  return request.headers.get(HttpHeader.HxRequest) == "true"
}

// In routes:
headers[HttpHeader.HxReplaceURL] = '/product-list'
headers[HttpHeader.HxRetarget] = "#main"
headers[HttpHeader.HxReswap] = "outerHTML"
```

## Common Patterns

### Page Type Pattern

All pages use a consistent `PageType`:

```typescript
export type PageType = {
  user: User | undefined      // Authenticated user
  data: DataType              // Domain data
  form: FormDataType          // Form state/errors
  locale: LocaleType          // i18n context
}
```

### Form Validation

Server-side validation with re-render on error:

```typescript
function validateFormAndCreatePage(name, description, price, lang) {
  const page = newPage(lang)
  // ... validation logic ...
  if (name.length == 0) errors["name"] = _('Name is required')
  return page
}
```

### Error Handling

Global error handler in `src/index.ts`:

```typescript
.onError(({ code, error, set, status }) => {
  if (code === 'INVALID_COOKIE_SIGNATURE') {
    // Handle session tampering
    set.headers['Location'] = '/auth/login'
    return new Response('', { status: 307 })
  }
})
```

## Important Implementation Details

- **Price Handling**: Stored as cents (integer), convert to/from euros for display
- **Form Validation**: Server-side only, no client-side validation
- **Concurrency**: Uses `modifiedAt` timestamp for optimistic locking
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Security**: CSP headers, secure cookies, CSRF tokens, session binding

## Using This Template

To create a new application:

1. Clone or fork the repository
2. Update `package.json` with your project name
3. Configure OAuth credentials in `wrangler.jsonc` vars section
4. Replace the products table with your domain models
5. Update authentication to match your requirements
6. Add your own routes and features
7. Run `bun create:db` to create a D1 database
8. Configure database binding in `wrangler.jsonc`
9. Run migrations and deploy

This template demonstrates enterprise-grade patterns suitable for production applications, including security hardening, proper authentication flows, and Cloudflare Workers deployment.

## Troubleshooting

### Database Reconnection
If the remote database is deleted and recreated, you may see:
```
Error: 7500: You do not have permission to perform this operation
```

Reconnect in Cloudflare dashboard:
1. Workers & Pages → bun-htmx-crud → Settings → Variables
2. D1 Databases section → Add → Select recreated database
3. Remove old bindings

### Common Issues
- **Migration failures**: Verify `DB_ID` in `.env` matches `wrangler.jsonc`
- **Auth errors**: Ensure OAuth secrets set with `bun secret:google` and `bun secret:github`
- **Type errors**: Run `bun typecheck` before deployment
