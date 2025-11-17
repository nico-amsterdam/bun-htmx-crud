import { Elysia } from 'elysia'
import Container from 'typedi'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './db/schema'
import { productController } from "routes/product"
// Experimental: import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
// import { env } from 'cloudflare:workers'

export interface Env {
  DB: D1Database
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB, { schema, logger: true })
    // inject db and env as deps
    Container.set('DrizzleDB', db)
    Container.set('env', env)
    const resp = await new Elysia({ aot: false, normalize: false })
      .get('/', ({ set, status }) => { set.headers['Location'] = '/product-list'; return status(302) })
      .get('/health', ({}) => new Response('ok') )
      .use(productController)
      .handle(request)
    // .compile() // for CloudflareAdapter

    return resp
  },
}
