import { Elysia, t } from 'elysia'
import { createSecretKey } from 'crypto'
import { getEnv, ElysiaSettings } from "config"
import { calcStateHmac, generateSecureRandomString, getIp } from './securityHelper'

const redirect_uri_local = 'http://localhost:8787/auth/google'
const redirect_uri_remote = 'https://bun-htmx-crud.nico-amsterdam.workers.dev/auth/google'

type AccessTokenResponse = {
  access_token: string,
  token_type: string,
  error: string,
  error_description: string
  // scope, expires_in, etc. not used in this code
}

type TokenCheckResponse = {
  sub: string,
  name: string,
  given_name: string,
  family_name: string,
  picture: string,
  error: string,
  error_description: string
}

function getRedirectUri(headers: Record<string, string | undefined>) {
  const protocol = headers['x-forwarded-proto'] || 'http'
  return (protocol === 'http' ? redirect_uri_local : redirect_uri_remote)
}

const secretKey = createSecretKey(Buffer.from('key-object-secret'));

export const googleController = new Elysia(ElysiaSettings)
  .get('/auth/to-google', async ({ headers, set, status }) => {
    const state = calcStateHmac(headers, secretKey)
    const redirect_uri = getRedirectUri(headers)
    set.headers['Location'] = 'https://accounts.google.com/o/oauth2/auth?client_id=' + getEnv().GOOGLE_CLIENT_ID + '&prompt=consent&redirect_uri=' + redirect_uri + '&scope=' + encodeURIComponent('https://www.googleapis.com/auth/userinfo.profile') + '&response_type=code&state=' + state
    return status(307)
  })
  .get('/auth/google', async ({ headers, query, set, status, cookie: { SESSION } }) => {
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
    const redirect_uri = getRedirectUri(headers)
    const tokenAccessResponse = await fetch('https://accounts.google.com/o/oauth2/token', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "bun-htmx-crud/v1",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: getEnv().GOOGLE_CLIENT_ID,
        client_secret: getEnv().GOOGLE_CLIENT_SECRET,
        "code": query.code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri
      })
    })
    const googleAccessToken = await tokenAccessResponse.json() as AccessTokenResponse;
    // console.log('access token: ' + JSON.stringify(googleAccessToken))

    const { access_token, token_type } = googleAccessToken;

    if (access_token === undefined || googleAccessToken.error !== undefined) {
      console.log(googleAccessToken.error_description)
      // incorrect secret?
      set.headers['Location'] = '/auth/login'
      return status(307)
    }

    const bearerAuth = token_type + ' ' + access_token

    const tokenCheckResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "bun-htmx-crud/v1",
        Accept: "application/json",
        Authorization: bearerAuth,
      },
      body: JSON.stringify({
        "access_token": access_token
      })
    })

    const checkedTokenInfo = await tokenCheckResponse.json() as TokenCheckResponse;
    // console.log('token check response: ' + JSON.stringify(checkedTokenInfo))
    console.log('login name: ' + checkedTokenInfo.name)
    console.log('user unique id: ' + checkedTokenInfo.sub)

    if (checkedTokenInfo.sub === undefined || checkedTokenInfo.error !== undefined) {
      console.log(checkedTokenInfo.error_description)
      set.headers['Location'] = '/auth/login'
      return status(307)
    }

    const sessionId = generateSecureRandomString();
    const csrfToken = generateSecureRandomString();
    SESSION.value = {
      id: sessionId,
      login: 'google:' + checkedTokenInfo.sub,
      name: checkedTokenInfo.name || '',
      email: '',
      csrfToken: csrfToken,
      userAgent: headers['user-agent'] || '',
      ipAddress: ip,
      image: checkedTokenInfo.picture || ''
    }
    const protocol = headers['x-forwarded-proto'] || 'http'
    if (protocol === 'https') SESSION.secure = true;

    // go to main page
    set.headers['Location'] = '/product-list'
    return status(307)
  }, {
    query: t.Object({
      code: t.Optional(t.String()),
      scope: t.Optional(t.String()),
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
