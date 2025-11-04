import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import * as schema from './schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

const sqlite = new Database('sqlite.db')
export const db = drizzle(sqlite, { schema, logger: true })
export const tables = schema

export type ProductType = InferSelectModel<typeof schema.products>
export type AddProductType = InferInsertModel<typeof schema.products>
export type ModifyProductType = Omit<ProductType, 'createdBy' | 'createdAt'>
