import { Elysia } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { isHtmxEnabled } from 'htmx'
import { ElysiaSettings } from "config"
import { getIp, stripMobileDesktopFromUserAgent } from './securityHelper'
import { githubController } from './github'
import { googleController } from './google'
import { addContentSecurityPolicyHeader } from '../helper/securityHeaders'
import { BaseHtml } from '../helper/basePage'


export type User = {
  login: string,
  name: string,
  email: string,
  avatar_url: string
}

type CookieValuesType = {
  id: string,
  login: string,
  name: string,
  email: string,
  csrfToken: string,
  userAgent: string,
  ipAddress: string,
  image: string
}

function LoginPage(): JSX.Element {
  return (
    <BaseHtml>
      <body class="full-container">
        <div id="content" class="login-container">
          <main id="main" class="login-box">
            <h1 class="login-title">Welcome to the Bun HTMX CRUD Demo</h1>
            <p class="login-subtitle">Sign in to continue</p>

            <div class="social-login-container">
              <a href="/auth/to-github" class="social-login-button github-login">
                <img src="/image/github-icon.svg" alt="GitHub" class="social-icon" />
                Continue with GitHub
              </a>

              <a href="/auth/to-google" class="social-login-button google-login">
                <img src="/image/google-icon.svg" alt="Google" class="social-icon" />
                Continue with Google
              </a>
            </div>
          </main>
        </div>
      </body>
    </BaseHtml>
  )
}
function SessionExpired(): JSX.Element {
  return (
    <dialog open class="relogin" aria-labelledby="dialog-title">
      <h3 id="dialog-title">Session expired</h3>
      <form method="get" action="/auth/login">
        <p>Please login again.</p>
        <button class="btn btn-primary" autofocus>Login</button>
      </form>
    </dialog>
  )
}

export const authController = new Elysia(ElysiaSettings)
  .use(githubController)
  .use(googleController)
  .use(html())
  .use(addContentSecurityPolicyHeader)
  .post('auth/login', ({ html }) => {
    return html(<SessionExpired />)
  })
  .get('auth/login', ({ html, request, cookie: { SESSION } }) => {

    if (isHtmxEnabled(request)) {
      // Show error to user in the current part of the screen. The login link will swap the whole page.
      return html(<SessionExpired />)
    }

    // logout: remove previous cookie
    SESSION.remove()

    return html(<LoginPage />)
  })

export const authRedirect = new Elysia(ElysiaSettings)
  .resolve({ as: 'scoped' }, ({ headers, set, status, cookie: { SESSION } }) => {
    const rawcookie = SESSION.value as string
    const ip = getIp(headers)
    const userAgent = stripMobileDesktopFromUserAgent(headers['user-agent'])
    // console.log('found: ' + rawcookie)
    if (rawcookie === undefined) {
      console.log('No cookie')
      set.headers['Location'] = '/auth/login'
      return status(307)
    }
    try {
      const cookieContent = JSON.parse(rawcookie) as CookieValuesType
      if (!cookieContent.login
        || cookieContent.login.indexOf(':') < 0
        || cookieContent.userAgent !== userAgent
        || cookieContent.ipAddress !== ip) {
        console.log('Cookie does not match user')
        set.headers['Location'] = '/auth/login'
        return status(307)
      }
      const user = {
        login: cookieContent.login,
        name: cookieContent.name,
        email: cookieContent.email,
        avatar_url: cookieContent.image
      } as User
      // add to context
      return {
        'authUser': user,
        'csrfToken': cookieContent.csrfToken
      }
    } catch (e) {
      console.log('Session cookie did not parse')
      set.headers['Location'] = '/auth/login'
      return status(307)
    }
  })
