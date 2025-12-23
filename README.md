# Bun HTMX Elysia on Cloudflare

## About this project

Rebuild of this [Vue CRUD Nuxt application](https://github.com/nico-amsterdam/vue-crud-nuxt) with [HTMX](https://htmx.org), [Bun](https://bun.com/) and [Elysia](https://elysiajs.com/).

There is a demo on https://bun-htmx-crud.nico-amsterdam.workers.dev/. Login with your Google or Github account.

You can use this project for learning purposes and demo's.
Git clone this repostory, or download the source from github.

[Sqlite](https://www.sqlite.org/index.html) is the central database. More specifically [Cloudflare D1](https://developers.cloudflare.com/d1/worker-api/d1-database/).

Uses [JSX](https://bun.com/docs/runtime/jsx): HTML is embedded in typescript functions (tsx files).
All HTML is generated server-side. All code, including route parameters and templates are typesafe.

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

In the wrangler.jsonc set your GITHUB_CLIENT_ID and GOOGLE_CLIENT_ID

In .env also set your GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

In .env also set your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

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
bun wrangler secret put GOOGLE_CLIENT_SECRET
```

Open the shown link in your browser to see the result.

## OAuth2 security

- This application uses signed session cookies; the cookies can be read with the browse devtools, but modifying them to login as a different user will not succeed, because they are digitally signed.
- The session cookies have a session id. The session id is currently not used, because the server doesn't keep session information. As a result, the sessions do not timeout.
- Although they are session cookies, most browsers by default do not delete session cookies when the tab or the browser is closed. In principle the window.unload event could be used clean up the session cookies, but with oauth2 this doesn't provide more security; see next bullet point
- Google/Github OAuth2 can be used as an identity provider (what I like), but it also provides single sign on (what I don't like). There is no way to only log out of the application only, and expect that you must enter your credentials again when you relogin. I could do a SSO-logout, but that means for example for the Google users that they will need to relogin for gmail (and other google services). The SSO sessions are long lasting sessions. To, solve this, we need a provider that supports OpenID Connect RP-Initiated Logout. OpenID is an extension of Oauth.
- I have configured the login url to always prompt for consent (so it does not automatically redirect back when there is still a valid SSO session and there was a previous authorization of this app), but it is very easy to remove this from the url.
- Github will ask to give bun-htmx-crud permission to 'act on your behalf'. The wording is very confusing for end-users, because this 'act' is only to verify the credentials. Only if you click on the link it states: "Applications act on your behalf to access your data based on the permissions you grant them."

