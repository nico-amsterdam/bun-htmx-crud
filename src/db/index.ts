import Container from 'typedi'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import * as schema from './schema'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const getDB = () => Container.get<DrizzleD1Database<typeof import('../db/schema')>>('DrizzleDB')

export const tables = schema

export type ProductType = InferSelectModel<typeof schema.products>
export type AddProductType = InferInsertModel<typeof schema.products>
export type ModifyProductType = Omit<ProductType, 'createdBy' | 'createdAt'>
export type BaseProductType = Omit<ModifyProductType, 'modifiedBy' | 'modifiedAt'>
