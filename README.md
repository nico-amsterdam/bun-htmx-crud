# HTMX Elysia with Bun runtime on Cloudflare

## About this project

Rebuild of this [Vue CRUD Nuxt application](https://github.com/nico-amsterdam/vue-crud-nuxt) with [HTMX](https://htmx.org), [Bun](https://bun.com/) and [Elysia](https://elysiajs.com/).

There is a demo on https://bun-htmx-crud.nico-amsterdam.workers.dev/. Login with your Github account.

You can use this project for learning purposes and demo's.
Git clone this repostory, or download the source from github.

[Sqlite](https://www.sqlite.org/index.html) is the central database. More specifically [Cloudflare D1](https://developers.cloudflare.com/d1/worker-api/d1-database/).

Uses [JSX](https://bun.com/docs/runtime/jsx): HTML is embedded in typescript functions (tsx files).
All HTML is generated server-side.

Recommended HTMX reading material: [Following up "Mother of all htmx demos"](https://david.guillot.me/en/posts/tech/following-up-mother-of-all-htmx-demos/)

## Getting Started
- install Bun
- Download, clone or fork the source from https://github.com/nico-amsterdam/bun-htmx-crud
- When using git, switch to the Cloudflare branch:
  git checkout cloudflare-d1
- run:

```bash
bun install
bun create:db  // interactive: use DB as binding
bun generate
bun migrate:dev
bun test:db:dev
```

## Development
Update your .env file. DB_ID can be found in wrangler.jsonc as the database_id

To start the development server run:
```bash
bun dev
```

Open the shown link in your browser to see the result.

## Deploy to Cloudflare

In the wrangler.jsonc set your GITHUB_CLIENT_ID
In .env your account id (hex string of 32 chars)
  curl "https://api.cloudflare.com/client/v4/accounts" -H "Authorization: Bearer ...."
  The json response contains result.id; that is the account_id.
it is also visible in the url of https://dash.cloudflare.com/ when logged in.

To deploy to cloudflare:
```bash
bun migrate
bun test:db
bun deploy:app
bun wrangler secret put GITHUB_CLIENT_SECRET
```

Open the shown link in your browser to see the result.

