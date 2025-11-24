import { Elysia } from 'elysia'
import { isHtmxEnabled } from 'htmx'
import { addProductController } from './addProduct'
import { editProductController } from './editProduct'
import { delProductController } from './delProduct'
import { productListController } from './productList'
import { authRedirect } from '../auth'
import { ElysiaSettings } from '../../config'

const htmxRedirect = new Elysia(ElysiaSettings)
  .onBeforeHandle(({ set, status, request }) => {
    if (!isHtmxEnabled(request)) {
      set.headers['Location'] = '/product-list'
      return status(307)
    }
  })
  .as('scoped') // Scoped to parent instance but not beyond


export const productController = new Elysia(ElysiaSettings)
  .use(authRedirect)
  .use(productListController)
  .use(htmxRedirect)
  .use(addProductController)
  .use(editProductController)
  .use(delProductController)
