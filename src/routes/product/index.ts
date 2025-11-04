import { Elysia } from 'elysia'
import { addProductController } from './addProduct'
import { editProductController } from './editProduct'
import { delProductController } from './delProduct'
import { productListController } from './productList'

export const productController = new Elysia({})
  .use(addProductController)
  .use(editProductController)
  .use(delProductController)
  .use(productListController)