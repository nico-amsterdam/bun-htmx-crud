import { Elysia } from 'elysia'
import Container from 'typedi'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './db/schema'
import { addContentSecurityPolicyHeader } from './routes/helper/securityHeaders'
import { allowRequest } from 'lib/security'
import { authController, LOGIN_PATH } from 'routes/auth'
import { productController } from 'routes/product'
import { ElysiaSettings, LANDING_PAGE_PATH } from './config'
import { getBaseURL } from 'lib/url'
import { getLang, setContentLanguage } from 'i18n/lang'
import { env } from 'cloudflare:workers'

export default new Elysia(ElysiaSettings)
  .onBeforeHandle(({ headers, path, query, request, set, status }) => {
    const cloudflareDB = env.DB.withSession() as unknown as D1Database
    const db = drizzle(cloudflareDB, { schema, logger: true })
    // inject db and env
    Container.set('DrizzleDB', db)
    Container.set('env', env)
    // checks cross-site origin
    if (!allowRequest(request.method, path, headers)) {
      return status(403) // Forbidden
    }
    // set content-language header. This header used in the controllers to get the current language.
    const lang = getLang(headers, query)
    setContentLanguage(set.headers, lang)
  })
  .onError(({ code, error, redirect, request, set }) => {
    if (code === 'INVALID_COOKIE_SIGNATURE') {
      console.log('Invalid cookie: ' + error.message)
      if (error.message.includes('"SESSION"')) {
        // override invalid cookie
        set.headers['Set-Cookie'] = 'SESSION=; HttpOnly; path=/; max-age=0'
        return redirect(getBaseURL(request.url) + LOGIN_PATH, 307)
      }
    }
  })
  .use(addContentSecurityPolicyHeader)
  .get('/health', ({ }) => 'ok')
  .get('/', ({ redirect, request }) => {
    return redirect(getBaseURL(request.url) + LANDING_PAGE_PATH, 307)
  })
  .use(authController as unknown as Elysia)
  .use(productController as unknown as Elysia)
  .compile() // for CloudflareAdapter
