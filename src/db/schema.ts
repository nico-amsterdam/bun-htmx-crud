import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const products = sqliteTable('products', {
  id: integer('id').primaryKey(),
  productName: text('name').notNull().unique(),
  description: text('description').notNull(),
  price: integer('price'),
  createdBy: text('created_by').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  modifiedBy: text('modified_by'),
  modifiedAt: integer('modified_at', { mode: 'timestamp' })
})

