import { Elysia, t } from 'elysia'
import { Html, html } from '@elysiajs/html'
import Container from 'typedi'
import { getEnv, ElysiaSettings } from "config"


// from Lucia auth:
// https://lucia-auth.com/sessions/basic
export function generateSecureRandomString(): string {
  // Human readable alphabet (a-z, 0-9 without l, o, 0, 1 to avoid confusion)
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";

  // Generate 24 bytes = 192 bits of entropy.
  // We're only going to use 5 bits per byte so the total entropy will be 192 * 5 / 8 = 120 bits
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);

  let id = "";
  for (let i = 0; i < bytes.length; i++) {
    // >> 3 "removes" the right-most 3 bits of the byte
    id += alphabet[bytes[i] >> 3];
  }
  return id;
}

type CookieValuesType = {
  id: string,
  name: string,
  userAgent: string,
  ipAddress: string,
  image: string
}

type User = {
  login: string,
  avatar_url: string
}

export const authRedirect = new Elysia(ElysiaSettings)
  .onBeforeHandle(({ headers, set, status, cookie: { SESSION } }) => {
    const rawcookie = SESSION.value as string
    const ip = "" + headers['cf-connecting-ip']
    const userAgent = "" + headers['user-agent']
    // Set
    // console.log('found: ' + rawcookie)
    if (rawcookie === undefined) {
      console.log('No cookie')
      set.headers['Location'] = '/auth/login'
      return status(307)
    }
    try {
      const cookieContent = JSON.parse(rawcookie) as CookieValuesType
      if (!cookieContent.name
        || cookieContent.name.indexOf(':') < 0
        || cookieContent.userAgent !== userAgent
        || cookieContent.ipAddress !== ip) {
        set.headers['Location'] = '/auth/login'
        return status(307)
      }
      const user = {
        login: cookieContent.name,
        avatar_url: cookieContent.image
      } as User
      Container.set('user', user)
    } catch (e) {
      console.log('Session cookie did not parse')
      set.headers['Location'] = '/auth/login'
      return status(307)
    }
  })
  // Scoped to parent instance but not beyond
  .as('scoped')


type AccessTokenResponse = {
  access_token: string
  // scope, token_type, etc.
}

type TokenCheckResponse = {
  user: User
}

export const getUser = () => Container.get<User>('user')


export const authController = new Elysia(ElysiaSettings)
  .get('/auth/to-github', ({ set, status }) => { set.headers['Location'] = 'https://github.com/login/oauth/authorize?client_id=' + getEnv().GITHUB_CLIENT_ID; return status(307) })
  .get('/auth/github', async ({ headers, query, set, status, cookie: { SESSION } }) => {
    console.log('Code: ' + query.code)
    if (query.code === undefined) {
      console.log(query.error_description)
      // user cancelled, go to login page
      set.headers['Location'] = '/auth/login'
      return status(307)
    }
    const ip = "" + headers['cf-connecting-ip']
    const tokenAccessResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "bun-htmx-crud/v1",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: getEnv().GITHUB_CLIENT_ID,
        client_secret: getEnv().GITHUB_CLIENT_SECRET,
        "code": query.code
      })
    })
    const githubAccessToken = await tokenAccessResponse.json() as AccessTokenResponse;
    console.log('access token: ' + JSON.stringify(githubAccessToken))

    const { access_token } = githubAccessToken;

    /*
    check-a-token:
    https://docs.github.com/en/rest/apps/oauth-applications?apiVersion=2022-11-28#check-a-token
    curl -L \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -u "<YOUR_CLIENT_ID>:<YOUR_CLIENT_SECRET>" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/applications/<YOUR_CLIENT_ID>/token \
    -d '{"access_token":<access_token>}'
    */
    const basicAuth = 'Basic ' + btoa(getEnv().GITHUB_CLIENT_ID + ":" + getEnv().GITHUB_CLIENT_SECRET)

    const tokenCheckResponse = await fetch('https://api.github.com/applications/' + getEnv().GITHUB_CLIENT_ID + '/token', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "bun-htmx-crud/v1",
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: "application/json",
        Authorization: basicAuth,
      },
      body: JSON.stringify({
        "access_token": access_token
      })
    })
    const checkedTokenInfo = await tokenCheckResponse.json() as TokenCheckResponse;
    console.log('token check response: ' + JSON.stringify(checkedTokenInfo))
    console.log('login name: ' + checkedTokenInfo.user.login)

    Container.set('user', checkedTokenInfo.user)

    const sessionId = generateSecureRandomString();
    SESSION.value = {
      id: sessionId,
      name: 'github:' + checkedTokenInfo.user.login,
      userAgent: "" + headers['user-agent'],
      ipAddress: ip,
      image: checkedTokenInfo.user.avatar_url
    }
    // go to main page
    set.headers['Location'] = '/product-list'
    return status(307)
  }, {
    query: t.Object({
      code: t.Optional(t.String()),
      error: t.Optional(t.String()),
      error_description: t.Optional(t.String()),
      error_uri: t.Optional(t.String()),
    }),
    cookie: t.Cookie({
      SESSION: t.Optional(
        t.Object({
          id: t.String(),
          name: t.String(),
          userAgent: t.String(),
          ipAddress: t.String(),
          image: t.String()
        })
      )
    })
  })
  .use(html())
  .get('/auth/login', ({ html, cookie: { SESSION } }) => {

    // logout: remove previous cookie
    SESSION.remove()

    return html(<div><a href="/auth/to-github">Login with Github</a></div>)
  })


