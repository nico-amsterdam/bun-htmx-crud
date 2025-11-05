import { Elysia, file } from 'elysia'
import { productController } from "routes/product"

const msg_404 = "Nothing here"

// use aot: false during development
const app = new Elysia({ aot: false }).onError(({ code, path, error, status }) => {
  console.log(path + ': ' + code)
  if (code === 'VALIDATION') return status(400, error.message)
  if (code === 'NOT_FOUND') return status(404, msg_404)
  return status(500, error)
})

app
  .get('/favicon.ico', file('./public/favicon.ico'))
  .get('/css/bootstrap3-un.css', file('./public/css/bootstrap3-un.css'))
  .get('/.well-known/*', ({ status }) => status(404, msg_404))
  .get('/', ({ redirect }) => redirect('/product-list', 302))
  .use(productController)
  .listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
