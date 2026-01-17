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
  .use(addContentSecurityPolicyHeader)  // Security headers
  .use(productListController)           // Feature routes
  .use(htmxRedirect)                    // HTMX utilities
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

All HTML generated server-side using JSX with custom `Html.createElement` factory:

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

## Authentication Implementation

### Session Management

The authentication system uses **signed cookies** with comprehensive security:

- **Cookie structure**: `{ id, login, name, email, csrfToken, userAgent, ipAddress, image }`
- **Signing**: Cookies are cryptographically signed to prevent tampering
- **Validation**: On each request, validates userAgent and IP address match
- **CSRF protection**: Secure random tokens generated for each session

See `src/routes/auth/index.tsx:102-139` for the `authRedirect` middleware.

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

Simple server-side i18n system in `src/i18n/translations.ts`:

```typescript
export function newLocale(lang: string): LocaleType {
  const t = function (key: string, ...args: string[]) {
    return translate(lang, key, args)
  }
  const langQueryParam = lang === 'en' ? '' : '?lang=' + lang
  return { lang, t, langQueryParam }
}
```

Middleware extracts language from:
1. URL query parameter (`?lang=fr`)
2. Accept-Language header
3. Defaults to English

## Development Workflow

### Local Development

```bash
bun install                    # Install dependencies
bun migrate:dev               # Apply migrations to local D1
bun dev                       # Start dev server at localhost:8787
```

### Database Operations

```bash
bun migrate:create            # Generate new migration files
bun migrate:dev               # Apply to local database
bun migrate                   # Apply to production database
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
    return status(307)
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
