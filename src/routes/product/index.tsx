import { Elysia } from 'elysia'
import { addProductController } from './addProduct'
import { editProductController } from './editProduct'
import { delProductController } from './delProduct'
import { productListController } from './productList'
import { htmxRedirect } from '../helper/htmx'
import { ElysiaSettings } from 'config'

export const productController = new Elysia(ElysiaSettings)
  .use(productListController)
  .use(htmxRedirect)
  .use(addProductController)
  .use(editProductController)
  .use(delProductController)
