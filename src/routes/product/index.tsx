import { Elysia } from 'elysia'
import { ElysiaSettings } from 'config'
import { htmxRedirect } from '../helper/htmx'
import { addProductController } from './addProduct'
import { editProductController } from './editProduct'
import { delProductController } from './delProduct'
import { productListController } from './productList'

export const productController = new Elysia(ElysiaSettings)
  .use(productListController as unknown as Elysia)
  .use(htmxRedirect)
  .use(addProductController)
  .use(editProductController)
  .use(delProductController)
