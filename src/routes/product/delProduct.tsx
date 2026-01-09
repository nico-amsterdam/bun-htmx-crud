import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { and, eq } from 'drizzle-orm'
import { getDB, tables } from "db"
import { PageType, CancelButton, newPage } from './productForm'
import { gotoProductList } from './productList'
import { ElysiaSettings } from 'config'
import { authRedirect } from '../auth'

function DelProductForm(page: PageType): JSX.Element {
    return (
        <form hx-post={`/product/${page.form.values.id}/delete`}>
            <input type="hidden" name="csrf" id="csrf" value={page.form.csrfToken} />
            <p>The action cannot be undone.</p><button type="submit" class="btn btn-danger" autofocus>Delete</button>
            {" "}<CancelButton />
        </form>
    )
}

function DelProduct(page: PageType): JSX.Element {
    return (
        <main id="main">
            <h2>Delete product {page.form.values.name}</h2>
            <DelProductForm {...page} />
        </main>
    )
}

export const delProductController = new Elysia(ElysiaSettings)
    .use(html())
    .use(authRedirect) // also sets authUser and csrfToken
    .get('/product/:id/delete', async ({ csrfToken, html, set, status, params: { id } }) => {
        const page = newPage()
        const product = await getDB().select().from(tables.products).where(and(
            eq(tables.products.id, +id)
        )).get()

        if (!product) {
            set.headers['Location'] = '/product-list'
            return status(307)
        }

        page.form.csrfToken = csrfToken
        page.form.values.id = id
        page.form.values.description = product.description
        page.form.values.name = product.name
        if (product.price) page.form.values["price"] = "" + (product.price / 100)

        return html(
            <DelProduct {...page} />
        )
    })
    .post('/product/:id/delete', async ({ csrfToken, html, set, params: { id }, body: { csrf } }) => {
        if (csrfToken === csrf) {
            // Delete product
            await getDB().delete(tables.products).where(
                eq(tables.products.id, +id)
            )
        }

        return html(await gotoProductList(set.headers))
    }, { // TypeBox
        body: t.Object({
            csrf: t.String()
        })
    })
