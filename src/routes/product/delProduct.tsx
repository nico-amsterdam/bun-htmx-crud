import { Elysia } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { and, eq } from 'drizzle-orm'
import { isHtmxEnabled } from 'htmx'
import { db, tables } from "db"
import { PageType, CancelButton, newPage } from './productForm'
import { gotoProductList } from './productList'

function DelProductForm(page: PageType): JSX.Element {
    return (
        <form hx-post={`/product/${page.form.values.id}/delete`}>
            <p>The action cannot be undone.</p><button type="submit" class="btn btn-danger">Delete</button>
            {" "}<CancelButton />
        </form>
    )
}

function DelProduct(page: PageType): JSX.Element {
    return (
        <section id="main">
            <h2>Delete product {page.form.values.name}</h2>
            <DelProductForm {...page} />
        </section>
    )
}

export const delProductController = new Elysia({})
    .use(html())
    .get('/product/:id/delete', ({ html, request, redirect, params: { id } }) => {
        if (!isHtmxEnabled(request)) return redirect('/product-list', 302)

        const page = newPage()

        const product = db.select().from(tables.products).where(and(
            eq(tables.products.id, +id)
        )).get()

        if (!product) return redirect('/product-list', 302)

        page.form.values.id = id
        page.form.values.description = product.description
        page.form.values.name = product.name
        if (product.price) page.form.values["price"] = "" + (product.price / 100)

        return html(
            <DelProduct {...page} />
        )
    })
    .post('/product/:id/delete', ({ html, request, redirect, set, params: { id } }) => {
        if (!isHtmxEnabled(request)) return redirect('/product-list', 302)

        // Delete product
        db.delete(tables.products).where(
            eq(tables.products.id, +id)
        ).returning().get()

        return html(gotoProductList(set.headers))
    })
