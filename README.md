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

## OAuth2 (or OpenID connect) security

- OpenID connect (OIDC) is a very thin layer arround OAuth2
- This application uses signed session cookies; the cookies can be read with the browse devtools, but modifying them to login as a different user will not succeed, because they are digitally signed.
- The session cookies have a session id. The session id is currently not used, because the server doesn't keep session information. As a result, the sessions do not timeout.
- Although they are session cookies, most browsers by default do not delete session cookies when the tab or the browser is closed. In principle the window.unload event could be used clean up the session cookies, but with OAuth2 this doesn't provide more security; see next bullet point
- Google/Github OAuth2 can be used as an identity provider (what I like), but it also provides single sign on (what I don't like). There is no good way to only log out of the application, and expect that they must enter credentials again on relogin. I could do a Federated/Single Logout, but that means for example for the Google users that they will need to relogin for Gmail and other google services. The SSO sessions are long lasting sessions.
- I have configured the login url to always prompt for consent (so it does not automatically redirect back when there is still a valid SSO session and permissions where already granted by the user), but it is very easy to remove this from the url.

## Setup Google client

It must be setup in 'Google Auth Platform'.

- Login at https://console.cloud.google.com/. When asked, choose the free tier
- Create a new project or select an existing project
- In the project select 'APIs & Services' plus 'Credentials' from the menu

<img width="312" height="260" alt="image" src="https://github.com/user-attachments/assets/b19d55e4-59f9-4ed6-86a0-e8d767fd52d4" />

- Click 'Create Credentials' plus 'OAuth client ID'

<img width="241" height="144" alt="image" src="https://github.com/user-attachments/assets/61fcbbfb-a7a7-4d18-8988-8eb52816e8c5" />

- Choose web application type: Web application
- Enter a name
- Add authorized redirect Url's. One with your production url, and another one for local development

<img width="249" height="121" alt="image" src="https://github.com/user-attachments/assets/4a637026-2c6d-4d1d-b7ed-7242e1002977" />

- Push the create button
- Download or copy the client id and client secret. Put them in the `.env` file. Also put the client id in `wrangler.jsonc`. Use the `bun wrangler secret put GOOGLE_CLIENT_SECRET` command to upload the secret to Cloudflare.


[More info](https://developers.google.com/identity/openid-connect/openid-connect)



## Setup Github OAuth2 client

Github recommends to use a 'Github App' for authentication, but this will ask your users for permission to 'act on your behalf'. The wording is very confusing for end-users and it is an [unresolved issue since 2022](https://github.com/orgs/community/discussions/37117). Instead, you must create a Github 'OAuth App' which only ask the end-user access to 'public data only'. 

To create the OAuth App:
- login with your account in [github.com](https://github.com/)
- In the upper right corner, click on your picture and goto settings:

<img width="159" height="276" alt="Github settings" src="https://github.com/user-attachments/assets/7a979212-984f-496f-a707-5a1338f5dabe" />

- Select 'Developer settings':  

<img width="301" height="427" alt="Developer settings" src="https://github.com/user-attachments/assets/b68cc95d-4091-4c4b-9605-1420a4d2e2ac" />

- Select 'OAuth Apps'
- Click the 'New OAuth App' button
- Fill in the details. During local development fill in the logout url: 'http://localhost:8787/auth/github'. After deployment, change it to the url for production. In my case this is 'https://bun-htmx-crud.nico-amsterdam.workers.dev/auth/github'.

<img width="716" height="663" alt="Register OAuth App" src="https://github.com/user-attachments/assets/e2e14c48-8c02-4d45-87a3-3b68c91d049d" />

- Click on 'Register application'.
- Copy the client ID to your `.env` file and your `wrangler.jsonc` file
- Click on 'Generate a new client secret'
- Copy the secret to your clickboard and past it in your `.env` file. Use the `bun wrangler secret put GITHUB_CLIENT_SECRET` command to upload the secret to Cloudflare.




