import { Elysia } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { ElysiaSettings } from "config"
import { getIp } from './securityHelper'
import { githubController } from './github'
import { googleController } from './google'
import { addContentSecurityPolicyHeader } from '../helper/securityHeaders'

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
    <div><a href="/auth/to-github">Login with Github</a>
      <p><a href="/auth/to-google">Login with Google</a></p></div>
  )
}

export const authController = new Elysia(ElysiaSettings)
  .use(githubController)
  .use(googleController)
  .use(html())
  .use(addContentSecurityPolicyHeader)
  .get('/auth/login', ({ html, cookie: { SESSION } }) => {

    // logout: remove previous cookie
    SESSION.remove()

    return html(<LoginPage />)
  })

export const authRedirect = new Elysia(ElysiaSettings)
  .resolve({ as: 'scoped'}, ({ headers, set, status, cookie: { SESSION } }) => {
    const rawcookie = SESSION.value as string
    const ip = getIp(headers)
    const userAgent = headers['user-agent'] || ""
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
      return {'authUser': user,
              'csrfToken': cookieContent.csrfToken}
    } catch (e) {
      console.log('Session cookie did not parse')
      set.headers['Location'] = '/auth/login'
      return status(307)
    }
  })
