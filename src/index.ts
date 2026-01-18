import { Elysia } from 'elysia'
import Container from 'typedi'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './db/schema'
import { addContentSecurityPolicyHeader, allowRequest } from './routes/helper/securityHeaders'
import { authController } from 'routes/auth'
import { productController } from 'routes/product'
import { ElysiaSettings } from './config'

// Experimental: import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
// import { env } from 'cloudflare:workers'

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB, { schema, logger: true })
    // inject db and env
    Container.set('DrizzleDB', db)
    Container.set('env', env)
    const resp = await new Elysia(ElysiaSettings)
      .onBeforeHandle(({ headers, path, request }) => {
        // checks cross-site origin
        if (!allowRequest(request.method, path, headers)) {
          return new Response('', { status: 403 }) // Forbidden
        }
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
      .use(authController)
      .use(productController)
      .handle(request)
    // .compile() // for CloudflareAdapter

    return resp
  },
}
