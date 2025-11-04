# HTMX Elysia with Bun runtime

## About this project

Rebuild of this [Vue CRUD Nuxt application](https://github.com/nico-amsterdam/vue-crud-nuxt) with [HTMX](https://htmx.org), [Bun](https://bun.com/) and [Elysia](https://elysiajs.com/).

There is a demo on https://vue-crud-nuxt.nuxt.dev/. This online demo does not store changes.

You can use this project for learning purposes and demo's.
Git clone this repostory, or download the source from github.

[Sqlite](https://www.sqlite.org/index.html) is the central database.

Uses [JSX](https://bun.com/docs/runtime/jsx): HTML is embedded in typescript functions (tsx files).
All HTML is generated server-side.

Recommended HTMX reading material: [Following up "Mother of all htmx demos"](https://david.guillot.me/en/posts/tech/following-up-mother-of-all-htmx-demos/)

## Getting Started
- install Bun
- Download, clone or fork the source from https://github.com/nico-amsterdam/bun-htmx-crud

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
