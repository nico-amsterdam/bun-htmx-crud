# Bun HTMX Elysia on Cloudflare

## About this project

Rebuild of this [Vue CRUD Nuxt application](https://github.com/nico-amsterdam/vue-crud-nuxt) with [HTMX](https://htmx.org), [Bun](https://bun.com/) and [Elysia](https://elysiajs.com/), with the option to deploy it on Cloudflare, so everything can run on the edge in the cloud.

There is a demo on https://bun-htmx-crud.nico-amsterdam.workers.dev/. Login with your Google or Github account.

You can use this project as a starter for your server-side rendered application with authentication.
Git clone this repostory, or download the source from github.

[Sqlite](https://www.sqlite.org/index.html) is the central database. More specifically [Cloudflare D1](https://developers.cloudflare.com/d1/worker-api/d1-database/).
D1 is a managed database with automatic backups (Time Travel).
It is great for most CRUD applications. There are a few limitations; D1 has a maximum size of 10 GB per instance (5 GB in the free plan) and it does't support transactions with multiple steps, though it does support atomic batch operations.

Uses [JSX](https://bun.com/docs/runtime/jsx): HTML is embedded in typescript functions (tsx files).
All HTML is generated server-side. All code, including route parameters and templates are typesafe.

Recommended HTMX reading material: [Following up "Mother of all htmx demos"](https://david.guillot.me/en/posts/tech/following-up-mother-of-all-htmx-demos/)

## Directory structure

```text
├── migrations/
├── public/
│   ├── css/
│   ├── image/
│   └── javascript/
│       └── vendor/
├── src/
│   ├── config/
│   ├── db/
│   ├── htmx/
│   └── routes/
│       ├── auth/
│       ├── helper/
│       └── product/
└── tests/
```

## Getting Started
- install [Bun](https://bun.com)
- Download, clone or fork the source from https://github.com/nico-amsterdam/bun-htmx-crud

  `git clone https://github.com/nico-amsterdam/bun-htmx-crud.git`
- run:

```bash
cd bun-htmx-crud
bun install
cp .env.example .env
bun migrate:create
bun migrate:dev
```

## Setup Google and Github authentication

[Setup Google](auth-setup-google.md)

[Setup Github](auth-setup-github.md)

In .env set your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

In .env set your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

## Development

To start the development server run:
```bash
bun dev
```

Open the shown [link](http://localhost:8787/) in your browser to see the result.

## Deploy to Cloudflare

In the wrangler.jsonc set your GITHUB_CLIENT_ID and GOOGLE_CLIENT_ID

In .env set your Cloudflare account id. This is a hex string of 32 chars,
which can be seen in the url of https://dash.cloudflare.com/ when logged in.

To deploy to cloudflare:
```bash
bun wrangler login  # login on your Cloudflare account
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

## OAuth2 (or OpenID connect) security

- OpenID connect (OIDC) is a very thin layer arround OAuth2
- This application uses signed session cookies; the cookies can be read with the browse devtools, but modifying them to login as a different user will not succeed, because they are digitally signed.
- The session cookies have a session id. The session id is currently not used, because the server doesn't keep session information. As a result, the sessions do not timeout.
- Although they are session cookies, most browsers by default do not delete session cookies when the tab or the browser is closed. In principle the window.unload event could be used clean up the session cookies, but with OAuth2 this doesn't provide more security; see next bullet point
- Google/Github OAuth2 can be used as an identity provider (what I like), but it also provides single sign on (what I don't like). There is no good way to only log out of the application, and expect that they must enter credentials again on relogin. I could do a Federated/Single Logout, but that means for example for the Google users that they will need to relogin for Gmail and other google services. The SSO sessions are long lasting sessions.
- I have configured the login url to always prompt for consent (so it does not automatically redirect back when there is still a valid SSO session and permissions where already granted by the user), but it is very easy to remove this from the url.

## Tips

- Run `bun logtail` to view the log of the application running on Cloudflare
- Run `bun studio:db` to view the production database with Drizzle Studio. Needs the Cloudflare environment settings in the .env file. Create the Cloudflare token with the following additional account permission: D1:Edit
- The content of the local database can be quickly viewed with `bun dbcat:db:dev`
- If you define a CLOUDFLARE_API_TOKEN environment variable in the .env file, wrangler will use automatically this token (instead of `wrangler login`). Make sure that the token has enough permissions.

<img width="358" height="177" alt="image" src="https://github.com/user-attachments/assets/b9a2d706-d591-4eaf-9202-7965f91988f5" />

- If the remote database is deleted (`bun wrangler d1 delete bun-htmx-crud`) and created again, and there are errors (like: `Error: 7500: You do not have permission to perform this operation`) when doing queries then reconnect the worker with the correct database in the [Cloudflare dashboard](https://dash.cloudflare.com/):

<img width="495" height="273" alt="image" src="https://github.com/user-attachments/assets/4cfb4dfa-cdb7-4e0e-aaeb-4b4d65d33dec" />

## Available Scripts

| Script | Description |
|--------|-------------|
| `bun update:types` | Generate TypeScript types from your Cloudflare Worker configuration |
| `bun typecheck` | Run TypeScript type checking without emitting files |
| `bun typecheck:watch` | Run TypeScript type checking in watch mode |
| `bun create:db` | Create a new Cloudflare D1 database |
| `bun migrate:create` | Generate database migration files using Drizzle Kit |
| `bun migrate:dev` | Apply database migrations to local development database |
| `bun migrate` | Apply database migrations to remote production database |
| `bun test:db:dev` | Test local development database connection and query products table |
| `bun test:db` | Test remote production database connection and query products table |
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
