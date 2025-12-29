import { Elysia, t } from 'elysia'
import { createSecretKey } from 'crypto'
import { getEnv, ElysiaSettings } from "config"
import { calcStateHmac, generateSecureRandomString, getIp, stripMobileDesktopFromUserAgent } from './securityHelper'
import type { User } from './'

type AccessTokenResponse = {
  access_token: string,
  // scope, token_type, etc. not used in this code
  error: string,
  error_description: string
}

type TokenCheckResponse = {
  user: User,
  error: string,
  error_description: string
}

const secretKey = createSecretKey(Buffer.from('key-object-secret'));

export const githubController = new Elysia(ElysiaSettings)
  .get('/auth/to-github', async ({ headers, set, status }) => {
    const state = calcStateHmac(headers, secretKey)
    set.headers['Location'] = 'https://github.com/login/oauth/authorize?client_id=' + getEnv().GITHUB_CLIENT_ID + '&prompt=consent&state=' + state
    return status(307)
  })
  .get('/auth/github', async ({ headers, query, set, status, cookie: { SESSION } }) => {
    console.log('Code: ' + query.code)
    if (query.code === undefined || query.error !== undefined) {
      console.log(query.error_description)
      // user cancelled, go to login page
      set.headers['Location'] = '/auth/login'
      return status(307)
    }
    const ip = getIp(headers)
    const verifyState = calcStateHmac(headers, secretKey)
    if (verifyState !== query.state) {
      console.log('state has been tampered')
      set.headers['Location'] = '/auth/login'
      return status(307)
    }
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
    // console.log('access token: ' + JSON.stringify(githubAccessToken))

    const { access_token } = githubAccessToken;
    if (access_token === undefined || githubAccessToken.error !== undefined) {
      console.log(githubAccessToken.error_description)
      // incorrect secret?
      set.headers['Location'] = '/auth/login'
      return status(307)
    }

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
    // console.log('token check response: ' + JSON.stringify(checkedTokenInfo))
    console.log('login name: ' + checkedTokenInfo.user.login)

    if (checkedTokenInfo.user.login === undefined || checkedTokenInfo.error !== undefined) {
      console.log(checkedTokenInfo.error_description)
      set.headers['Location'] = '/auth/login'
      return status(307)
    }

    const sessionId = generateSecureRandomString();
    const csrfToken = generateSecureRandomString();
    SESSION.value = {
      id: sessionId,
      login: 'github:' + checkedTokenInfo.user.login,
      name: checkedTokenInfo.user.name || '',
      email: checkedTokenInfo.user.email || '',
      csrfToken: csrfToken,
      userAgent: stripMobileDesktopFromUserAgent(headers['user-agent']),
      ipAddress: ip,
      image: checkedTokenInfo.user.avatar_url || ''
    }
    const protocol = headers['x-forwarded-proto'] || 'http'
    if (protocol === 'https') SESSION.secure = true;

    // go to main page
    set.headers['Location'] = '/product-list'
    return status(307)
  }, {
    query: t.Object({
      code: t.Optional(t.String()),
      state: t.Optional(t.String()),
      error: t.Optional(t.String()),
      error_description: t.Optional(t.String()),
      error_uri: t.Optional(t.String()),
    }),
    cookie: t.Cookie({
      SESSION: t.Optional(
        t.Object({
          id: t.String(),
          login: t.String(),
          name: t.String(),
          email: t.String(),
          csrfToken: t.String(),
          userAgent: t.String(),
          ipAddress: t.String(),
          image: t.String()
        })
      )
    })
  })
