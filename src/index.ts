import { Elysia } from 'elysia'
import Container from 'typedi'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './db/schema'
import { addContentSecurityPolicyHeader } from './routes/helper/securityHeaders'
import { allowRequest } from 'lib/security'
import { authController } from 'routes/auth'
import { productController } from 'routes/product'
import { ElysiaSettings } from './config'
import { getLang, setContentLanguage } from 'i18n/lang'

// Experimental: import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
// import { env } from 'cloudflare:workers'

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB, { schema, logger: true })
    // inject db and env
    Container.set('DrizzleDB', db)
    Container.set('env', env)
    const resp = await new Elysia(ElysiaSettings)
      .onBeforeHandle(({ headers, path, query, request, set }) => {
        // checks cross-site origin
        if (!allowRequest(request.method, path, headers)) {
          return new Response('', { status: 403 }) // Forbidden
        }
        // set content-language header. This header used in the controllers to get the current language.
        const lang = getLang(headers, query)
        setContentLanguage(set.headers, lang)
      })
      .onError(({ code, error, set }) => {
        if (code === 'INVALID_COOKIE_SIGNATURE') {
          console.log('Invalid cookie: ' + error.message)
          if (error.message.includes('"SESSION"')) {
            // override invalid cookie
            set.headers['Set-Cookie'] = 'SESSION=; HttpOnly; path=/; max-age=0'
            set.headers['Location'] = '/auth/login'
            return new Response('', { status: 307 })
          }
        }
      })
      .use(addContentSecurityPolicyHeader)
      .get('/health', ({ }) => new Response('ok'))
      .get('/', ({ set }) => {
        set.headers['Location'] = '/product-list'
        return new Response('', { status: 307 })
      })
      .use(authController as unknown as Elysia)
      .use(productController as unknown as Elysia)
      .handle(request)
    // .compile() // for CloudflareAdapter

    return resp
  },
}
