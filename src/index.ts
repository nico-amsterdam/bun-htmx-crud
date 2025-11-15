import { Elysia } from 'elysia'
import Container from 'typedi'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from './db/schema'
import { productController } from "routes/product"
// Experimental: import { CloudflareAdapter } from 'elysia/adapter/cloudflare-worker'
// import { env } from 'cloudflare:workers'

const msg_404 = "Nothing here"

export interface Env {
  DB: D1Database
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB, { schema, logger: true })
    // inject db and env as deps
    Container.set('DrizzleDB', db)
    Container.set('env', env)
    const resp = await new Elysia({ aot: false })
    // .onError(({ code, path, error, status }) => {
    //   console.log(path + ': ' + (code || error))
    //   if (code === 'VALIDATION') return status(400, error.message)
    //   if (code === 'NOT_FOUND') return status(404, msg_404)
    //   return status(500, error)
    // })
      // .get('/favicon.ico', file('./public/favicon.ico'))
      // .get('/css/bootstrap3-un.css', file('./public/css/bootstrap3-un.css'))
      // .get('/.well-known/*', ({ status }) => status(404, msg_404))
      .get('/', ({ set, status }) => { set.headers['Location'] = '/product-list'; return status(302) })
      .get('/health', ({}) => new Response('ok') )
      .use(productController)
      .handle(request)
    // .compile()
    // .listen(3000)

    // console.log(
    //   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    // );

    return resp
  },
}
