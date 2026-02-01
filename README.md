# Project starter: HTMX with Elysia on Cloudflare

## Features

- ⛅ **Cloud**: Deploy to Cloudflare without any hassle
- 🔐 **Authentication**: Login with Google or GitHub. Easy setup instructions
- 🤖 **AI agent instructions**: AGENTS.md for the AI coding agent
- 🏭 **Server-side rendered**: Render HTML directly, no JSON API needed
- ✨ **Modern user interface**: HTMX provides interactivity and update's page fragments
- 📝 **Template system**: JSX: fully typed HTML embedded in the TypeScript source
- 🧩 **Ergonomic web framework**: Elysia features type-safe routing and validation
- 💾 **Database**: Drizzle ORM with SQLite
- 🔄 **Migrations**: Database migration system
- ✅ **Testing**: 100+ unit tests. Run by Bun's speedy test runner
- 🧠 **Type Safety**: Full TypeScript support. Enables IDE intelliSense and real-time error checking
- ☎  **Mobile compatible**: Responsive web design. Manifest enables 'Add to Home Screen'
- 🕶 **Accessible**: Follows WCAG and WAI-ARIA standards for accessibility
- 🌐 **Internationalization**: Switch between different languages
- 🧱 **Security**: Content security policy, signed cookies, fetch metadata checks, CSRF
tokens
- 🚀 **Ready to launch**: Skip the scaffolding. Get straight to implementing your business ideas

## Wireframe

```text
+-------------------------------------------------------------+
| HTMX CRUD Demo           ☼☽      [User] [Sign Out] [Lang ▼] |
+-------------------------------------------------------------+
| [+ Add product]                                 [↻ Refresh] |
| Search: [_________________________] (updates as you type)   |
+-------------------------------------------------------------+
| Name       | Description |     Price | Actions              |
|------------|-------------|-----------|----------------------|
| product2   | 2nd         |  102.78 € | [Edit] [Delete]      |
| product3   | 3rd         |    5.09 € | [Edit] [Delete]      |
| product4   | 4th         | 9000.22 € | [Edit] [Delete]      |
| product5   | 5th         |   55.55 € | [Edit] [Delete]      |
| product6   | 6th         |    2.99 € | [Edit] [Delete]      |
+-------------------------------------------------------------+
```

## About this project

Rebuild of this [Vue CRUD Nuxt application](https://github.com/nico-amsterdam/vue-crud-nuxt) with [HTMX](https://htmx.org), [Bun](https://bun.com/) and [Elysia](https://elysiajs.com/), with the option to deploy it on Cloudflare, so everything can run on the edge in the cloud.

There is a demo on https://htmx-crud.nico-amsterdam.workers.dev/. Login with your Google or GitHub account.

You can use this project as a starter for your server-side rendered application with authentication.
Git clone this repository, or download the source from GitHub.

[SQLite](https://www.sqlite.org/index.html) is the central database. More specifically [Cloudflare D1](https://developers.cloudflare.com/d1/worker-api/d1-database/).
D1 is a managed database with automatic backups (Time Travel).
It is great for most CRUD applications. There are a few limitations; D1 has a maximum size of 10 GB per instance (5 GB in the free plan) and it doesn't support transactions with multiple steps, though it does support atomic batch operations.

Uses [JSX](https://bun.com/docs/runtime/jsx): HTML is embedded in TypeScript functions (tsx files).
All HTML is generated server-side. All code, including route parameters and templates are type-safe.

Recommended HTMX reading material: [Following up "Mother of all htmx demos"](https://david.guillot.me/en/posts/tech/following-up-mother-of-all-htmx-demos/)

## Directory structure

```text
├── client/src/        # client-side code
├── migrations/        # database migrations (generated)
├── public/            # public assets
│   ├── css/           # stylesheets
│   ├── image/         # images
│   └── javascript/    # compiled client-side code
│       └── vendor/    # 3rd party javascript libraries
│
├── src/               # server-side code
│   ├── config/        # configuration
│   ├── db/            # database schema
│   ├── lib/           # general purpose code
│   ├── i18n/          # internationalization
│   └── routes/
│       ├── auth/      # OAuth authentication (Google/GitHub)
│       ├── helper/    # Shared utilities and middleware
│       └── product/   # Example CRUD feature (replace with your domain)
│
└── tests/             # subfolders in tests follow the src/ structure
```

## Getting Started
- install [Git](https://github.com/git-guides/install-git)
- install [Bun](https://bun.com) package manager and test runner.
- install [Node](https://nodejs.org/en/download). I recommend using nvm for the installation of Node.
  Node is needed in this project, because Cloudflare's miniflare does not run on the Bun runtime.
- [Create a GitHub project with this template](https://github.com/nico-amsterdam/bun-htmx-crud/generate) and get the project without git history.
Or download, clone or fork the source code
```bash
git clone https://github.com/nico-amsterdam/bun-htmx-crud.git
```

- run:

```bash
cd bun-htmx-crud
bun install
cp .env.example .env
bun migrate:create
bun migrate:dev
bun update:types
```

## Setup Google and GitHub authentication

[Setup Google](auth-setup-google.md)

[Setup GitHub](auth-setup-github.md)

In .env set your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

In .env set your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

In `src/routes/auth/google.tsx` change the `redirect_uri_remote` to match with your production environment.



## Development

To start the development server run:
```bash
bun dev
```

Open the link shown in your terminal (typically http://localhost:8787) in your browser to see the result.
When using another localhost port, adjust the url in the OAuth Client's and the update the `redirect_uri_local` in the `src/routes/auth/google.tsx` file accordingly.

To run type checking in watch mode (auto-reloads on file changes):
```bash
bun typecheck:watch
```

## Deploy to Cloudflare

In the wrangler.jsonc set your GITHUB_CLIENT_ID and GOOGLE_CLIENT_ID

In .env set your Cloudflare account id. This is a hex string of 32 chars,
which can be seen in the url of https://dash.cloudflare.com/ when logged in.

For the first deployment, change the secrets for the signed cookies in `src/config/index.ts`. Do not expose these secrets.

To deploy to cloudflare:
```bash
bun wrangler login   # login on your Cloudflare account
bun create:db        # interactive: use DB as binding
```

Set DB_ID in the .env file. The value can be found in `wrangler.jsonc` as the database_id.

Remove old bindings from wrangler.jsonc, such that only one DB binding remains.

```bash
bun migrate
bun deploy:app
bun secret:google
bun secret:github
```

Open the shown link by the deploy:app command in your browser to see the result.

## Video Guide - From Scratch to Cloudflare

This video shows how to set everything up from scratch, deploy it to Cloudflare, and gives a quick tour of some of the app’s features.

https://github.com/user-attachments/assets/7489d524-3229-46a9-a48c-efe58c99432d


## OAuth2 (or OpenID connect) security

- OpenID connect (OIDC) is a very thin layer around OAuth2
- This application uses signed session cookies; the cookies can be read with the browser devtools, but modifying them to login as a different user will not succeed, because they are digitally signed.
- The session cookies have a session id. The session id is currently not used, because the server doesn't keep session information. As a result, the sessions do not timeout.
- Although they are session cookies, most browsers by default do not delete session cookies when the tab or the browser is closed. In principle the window.unload event could be used clean up the session cookies, but with OAuth2 this doesn't provide more security; see next bullet point
- Google/GitHub OAuth2 can be used as an identity provider (what I like), but it also provides single sign on (what I don't like). There is no good way to only log out of the application, and expect that they must enter credentials again on relogin. I could do a Federated/Single Logout, but that means for example for the Google users that they will need to relogin for Gmail and other google services. The SSO sessions are long lasting sessions.
- I have configured the login url to always prompt for consent (so it does not automatically redirect back when there is still a valid SSO session and permissions where already granted by the user), but it is very easy to remove this from the url.

## Tips

- Run `bun logtail` to view the log of the application running on Cloudflare
- Run `bun studio:db` to view the production database with Drizzle Studio. Needs the Cloudflare environment settings in the .env file. Create the Cloudflare token with the following additional account permission: D1:Edit
- The content of the local database can be quickly viewed with `bun dbcat:db:dev`
- If you define a CLOUDFLARE_API_TOKEN environment variable in the .env file, wrangler will automatically use this token (instead of `wrangler login`). Make sure that the token has enough permissions.

<img width="358" height="177" alt="permissions" src="https://github.com/user-attachments/assets/b9a2d706-d591-4eaf-9202-7965f91988f5" />

- Inline [Hyperscript](https://hyperscript.org/) is used to add client-side logic. When loading page content (CMS) or other parts (translations, svg's) from untrusted external sources, make sure to sanitize it and remove all inline scripts (_ and data-script attributes, svg with inline scripts, etc.).
- Build [HTMX extensions](https://htmx.org/extensions/building/) if Hyperscript doesn't cut it for you. Put them in the `client/src` directory and transform them with `bun build:client` into minified javascript. Then, add the scripts in the `basePage.ts`.


## Available Scripts

| Script | Description |
|--------|-------------|
| `bun update:types` | Generate TypeScript types from your Cloudflare Worker configuration |
| `bun build:client` | Transpose client-side TypeScript from `client/src` to minified javascript |
| `bun typecheck` | Run TypeScript type checking without emitting files |
| `bun typecheck:watch` | Run TypeScript type checking in watch mode |
| `bun create:db` | Create a new Cloudflare D1 database |
| `bun migrate:create` | Generate database migration files using Drizzle Kit |
| `bun migrate:dev` | Apply database migrations to local development database |
| `bun migrate` | Apply database migrations to remote production database |
| `bun test:db:dev` | Test local development database connection and query products table |
| `bun test:db` | Test remote production database connection and query products table |
| `bun test` | Run tests |
| `bun test --coverage` | Print out a test coverage report to the console |
| `bun test --watch` | Watch changes and re-run tests |
| `bun dev` | Start local development server with hot reload |
| `bun deploy:app` | Deploy application to Cloudflare Workers |
| `bun secret:github` | Set GitHub OAuth client secret in Cloudflare environment |
| `bun secret:google` | Set Google OAuth client secret in Cloudflare environment |
| `bun logtail` | Stream real-time logs from deployed Cloudflare Worker |
| `bun rollback:app` | Rollback to previous deployment version |
| `bun delete:app` | Delete the deployed Cloudflare Worker |
| `bun databases` | List all Cloudflare D1 databases |
| `bun studio:db` | Open Drizzle Studio for production database management |
| `bun studio:db:dev` | Open Drizzle Studio for local development database |
| `bun introspect:db` | Introspect database schema using Drizzle Kit |
| `bun dbcat:db:dev` | View local development database content using dbcat CLI tool |

## Troubleshooting

### Database Reconnection

If the remote database is deleted (`bun wrangler d1 delete htmx-crud`) and recreated, you may encounter errors like:
```
Error: 7500: You do not have permission to perform this operation
```

To fix, reconnect the worker with the correct database in the [Cloudflare dashboard](https://dash.cloudflare.com/):
1. Go to Workers & Pages → htmx-crud → Bindings
2. In the table with types, click the edit button for the D1 Database
3. Reconnect the worker with the correct database

<img width="423" height="271" alt="Fix database binding" src="https://github.com/user-attachments/assets/9bdced9d-b67d-49f4-be79-5f7ed85e5421" />


### Common Errors

- **Migration failures**: Ensure `DB_ID` in `.env` matches the database_id in `wrangler.jsonc`
- **Auth errors**: Verify OAuth secrets are set with `bun secret:google` and `bun secret:github`
- **Type errors**: Run `bun typecheck` to identify type issues before deployment
- **Slow TypeScript checks and/or errors like: `Expression produces a union type that is too complex to represent`**: Types becomes too complex if in too many places variables are added to the context. Do not overuse this mechanism, it also makes type checking slow. If the variables are not needed in the parent controller, cast the return type like this: `.use(your-plugin as unknown as Elysia)`. Time the typechecker with `time bun typecheck`. Find hotspots with the commands `bunx tsc --generateTrace trace --noEmit --incremental false` and `bunx @typescript/analyze-trace trace/`. The [go TypeScript checker](https://github.com/microsoft/typescript-go) is in many cases faster.
- **Browser not using the latest css file**: The assets in the `/public` folder have cache-control settings in the `_headers` file. Force the use of the new stylesheet by changing it's `t=` query parameter in the `src/routes/helper/basePage.ts` file.