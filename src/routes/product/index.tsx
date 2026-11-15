import { Elysia } from 'elysia'

import { htmxRedirect } from '../helper/htmx'
import { addProductController } from './addProduct'
import { editProductController } from './editProduct'
import { delProductController } from './delProduct'
import { productListController } from './productList'

export const productController = new Elysia()
  .use(productListController as unknown as Elysia)
  .use(htmxRedirect)
  .use(addProductController)
  .use(editProductController)
  .use(delProductController)
