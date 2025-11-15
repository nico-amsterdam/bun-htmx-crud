# HTMX Elysia with Bun runtime

## About this project

Rebuild of this [Vue CRUD Nuxt application](https://github.com/nico-amsterdam/vue-crud-nuxt) with [HTMX](https://htmx.org), [Bun](https://bun.com/) and [Elysia](https://elysiajs.com/).

This project has a [cloudflare-d1 branch](https://github.com/nico-amsterdam/bun-htmx-crud/tree/cloudflare-d1) to run with the Cloudflare D1 database, and to deploy the application to a Cloudflare worker. Cloudflare is known for offering a generous [free tier](https://www.cloudflare.com/plans/).

There is a demo on https://vue-crud-nuxt.nuxt.dev/. This online demo uses Vue instead of HTMX and does not store changes.

You can use this project for learning purposes or as a quick starter.
Git clone or fork this repostory, or download the source from github.

[Sqlite](https://www.sqlite.org/index.html) is the central database.

Uses [JSX](https://bun.com/docs/runtime/jsx): HTML is embedded in typescript functions (tsx files).
All HTML is generated server-side.

Recommended HTMX reading material: [Following up "Mother of all htmx demos"](https://david.guillot.me/en/posts/tech/following-up-mother-of-all-htmx-demos/)

## Getting Started
- install Bun
- Download, clone or fork the source from https://github.com/nico-amsterdam/bun-htmx-crud
- run:

```bash
bun install
bun run generate
bun run migrate
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.
