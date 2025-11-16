import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { and, eq } from 'drizzle-orm'
import { isHtmxEnabled } from 'htmx'
import { getDB, tables, ModifyProductType } from "db"
import { PageType, ProductFormFields, CancelButton, newPage, validateFormAndCreatePage, validateIdAndUpdatePage } from './productForm'
import { gotoProductList } from './productList'

function EditProductForm(page: PageType): JSX.Element {
    return (
        <form hx-post={`/product/${page.form.values.id}/edit`}><span>
            <ProductFormFields {...page} />
        </span><button type="submit" class="btn btn-primary">Save</button>
            {" "}<CancelButton />
        </form>
    )
}

function EditProduct(page: PageType): JSX.Element {
    return (
        <section id="main">
            <h2>Edit product</h2>
            <EditProductForm {...page} />
        </section>
    )
}

export const editProductController = new Elysia({ aot: false })
    .use(html())
    .get('/product/:id/edit', async ({ html, request, set, status, params: { id } }) => {
        if (!isHtmxEnabled(request)) {
            set.headers['Location'] = '/product-list'
            return status(302)
        }

        const page = newPage()

        const product = await getDB().select().from(tables.products).where(and(
            eq(tables.products.id, +id)
        )).get()

        if (!product) {
            set.headers['Location'] = '/product-list'
            return status(302)
        }

        page.form.values.id = id
        page.form.values.description = product.description
        page.form.values.name = product.name
        if (product.price !== null) page.form.values.price = "" + (product.price / 100)

        return html(
            <EditProduct {...page} />
        )
    })
    .post('/product/:id/edit', async ({ html, request, redirect, set, body: { name, description, price }, params: { id } }) => {
        if (!isHtmxEnabled(request)) return redirect('/product-list', 302)
        const page = validateFormAndCreatePage(name, description, price)
        validateIdAndUpdatePage(page, id)
        let errors = page.form.errors
        if (Object.keys(errors).length > 0) {
            return html(
                <EditProductForm {...page} />
            )
        }

        const modifiedProduct: ModifyProductType = {
            id: +id
            , name: name.trim()
            , description: description.trimEnd()
            , price: (price === '' ? null : +price * 100)
            , modifiedBy: 'unknown'
            , modifiedAt: new Date()
        }

        try {
            const product = await getDB().update(tables.products)
                .set(modifiedProduct).where(and(
                    eq(tables.products.id, +id)
                )).returning().get()
            if (!product) errors["general"] = `Could not update '${modifiedProduct.name}'. Removed?`
        } catch (error) {
            errors["general"] = `Product '${modifiedProduct.name}' already exists`
        }

        if (Object.keys(errors).length > 0) {
            return html(
                <EditProductForm {...page} />
            )
        }

        return html(await gotoProductList(set.headers))
    }, { // TypeBox
        body: t.Object({
            name: t.String(),
            description: t.String(),
            price: t.String()
        })
    })

