import { Elysia } from 'elysia'
import Container from 'typedi'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './db/schema'
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
      .get('/', ({ set, status }) => {
        set.headers['Location'] = '/product-list'
        return status(307)
      })
      .get('/health', ({ }) => new Response('ok'))
      .use(authController)
      .use(productController)
      .handle(request)
    // .compile() // for CloudflareAdapter

    return resp
  },
}
