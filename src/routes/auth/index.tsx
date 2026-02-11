import { Elysia } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { isHtmxEnabled } from 'lib/htmx'
import { ElysiaSettings } from "config"
import { getIp, stripMobileDesktopFromUserAgent } from 'lib/security'
import { githubController } from './github'
import { googleController } from './google'
import { BaseHtml } from '../helper/basePage'
import { newLocale } from 'i18n/translations'
import { getContentLanguage } from 'i18n/lang'
import { getBaseURL } from 'lib/url'
import type { UserType } from './common'
import { LOGIN_PATH, AUTH_PATH } from './common'



/*
 * Types
 */

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

export type { UserType } from './common'

/*
 * Variables
 */

export { LOGIN_PATH }

const emptyAuthUserAndCSRFToken: { authUser: UserType, csrfToken: string } = {
  'authUser': {
    login: '',
    name: '',
    email: '',
    avatar_url: ''
  },
  'csrfToken': ''
}


/*
 * Functions
 */

function LoginPage({ lang }: { lang: string }): JSX.Element {
  const locale = newLocale(lang)
  const _ = locale.t
  const toGithubLink = AUTH_PATH + '/to-github' + locale.langQueryParam
  const toGoogleLink = AUTH_PATH + '/to-google' + locale.langQueryParam
  const body =
    <body class="full-container">
      <div id="content" class="login-container">
        <main id="main" class="login-box">
          <h1 class="login-title">{_('Welcome to the HTMX CRUD Demo')}</h1>
          <p class="login-subtitle">{_('Sign in to continue')}</p>

          <div class="social-login-container">
            <a href={toGithubLink} class="social-login-button github-login">
              <img src="/image/github-icon.svg" alt="GitHub logo" class="social-icon" />
              {_('Continue with GitHub')}
            </a>

            <a href={toGoogleLink} class="social-login-button google-login">
              <img src="/image/google-icon.svg" alt="Google logo" class="social-icon" />
              {_('Continue with Google')}
            </a>
          </div>
        </main>
      </div>
    </body>

  return (
    <BaseHtml lang="en" body={body} />
  )
}

function SessionExpired({ lang }: { lang: string }): JSX.Element {
  const _ = newLocale(lang).t
  return (
    <dialog open class="relogin" aria-labelledby="dialog-title">
      <h3 id="dialog-title">{_('Session expired')}</h3>
      <form method="get" action={ LOGIN_PATH }>
        <p>{_('Please login again.')}</p>
        <button class="btn btn-primary" autofocus>{_('Login')}</button>
      </form>
    </dialog>
  )
}

/*
 * Elysia controllers
 */

export const authController = new Elysia(ElysiaSettings)
  .use(githubController)
  .use(googleController)
  .use(html())
  .post(LOGIN_PATH, ({ html, set }) => {
    const lang = getContentLanguage(set.headers)
    return html(<SessionExpired lang={lang} />)
  })
  .get(LOGIN_PATH, ({ html, request, set, cookie: { SESSION } }) => {
    const lang = getContentLanguage(set.headers)
    if (isHtmxEnabled(request)) {
      // Show error to user in the current part of the screen. The login link will swap the whole page.
      return html(<SessionExpired lang={lang} />)
    }

    // logout: remove previous cookie
    SESSION.remove()

    return html(<LoginPage lang={lang} />)
  })

/*
 * Redirect to /auth/login when not logged-in.
 * If logged-in, add authUser and csrfToken to the context
 */
export const authRedirect = new Elysia({ ...ElysiaSettings, name: 'authRedirect' })
  .resolve({ as: 'scoped' }, ({ headers, cookie: { SESSION } }) => {
    const ip = getIp(headers)
    const userAgent = stripMobileDesktopFromUserAgent(headers['user-agent'])
    if (SESSION === undefined) {
      console.log('No cookie')
      return emptyAuthUserAndCSRFToken
    }
    // console.log('found: ' + SESSION.toString())
    try {
      const cookieContent = SESSION.value as CookieValuesType

      if (!cookieContent.login
        || cookieContent.login.indexOf(':') < 0
        || cookieContent.userAgent !== userAgent
        || cookieContent.ipAddress !== ip) {
        console.log('Cookie does not match user')
        return emptyAuthUserAndCSRFToken
      }
      const user = {
        login: cookieContent.login,
        name: cookieContent.name,
        email: cookieContent.email,
        avatar_url: cookieContent.image
      } as UserType
      // add to context
      return {
        'authUser': user,
        'csrfToken': cookieContent.csrfToken
      }
    } catch (e) {
      console.log('Session cookie did not parse')
      return emptyAuthUserAndCSRFToken
    }
  })
  .onBeforeHandle({ as: 'scoped' }, ({ csrfToken, redirect, request }) => {
    if (csrfToken === '') {
      return redirect(getBaseURL(request.url) + LOGIN_PATH, 307)
    }
  })

