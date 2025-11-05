import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { and, eq } from 'drizzle-orm'
import { isHtmxEnabled } from 'htmx'
import { db, tables, ModifyProductType } from "db"
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

export const editProductController = new Elysia({})
    .use(html())
    .get('/product/:id/edit', ({ html, request, redirect, params: { id } }) => {
        if (!isHtmxEnabled(request)) return redirect('/product-list', 302)

        const page = newPage()

        const product = db.select().from(tables.products).where(and(
            eq(tables.products.id, +id)
        )).get()

        if (!product) return redirect('/product-list', 302)

        page.form.values["id"] = id
        page.form.values["description"] = product.description
        page.form.values["name"] = product.productName
        if (product.price) page.form.values["price"] = "" + (product.price / 100)

        return html(
            <EditProduct {...page} />
        )
    })
    .post('/product/:id/edit', ({ html, request, redirect, set, body: { name, description, price }, params: { id } }) => {
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
            , productName: name.trim()
            , description: description.trimEnd()
            , price: +price * 100
            , modifiedBy: 'unknown'
            , modifiedAt: new Date()
        }

        try {
            const product = db.update(tables.products)
                .set(modifiedProduct).where(and(
                    eq(tables.products.id, +id)
                )).returning().get()
            if (!product) errors["general"] = `Could not update '${modifiedProduct.productName}'. Removed?`
        } catch (error) {
            errors["general"] = `Product '${modifiedProduct.productName}' already exists`
        }

        if (Object.keys(errors).length > 0) {
            return html(
                <EditProductForm {...page} />
            )
        }

        return html(gotoProductList(set.headers))
    }, { // TypeBox
        body: t.Object({
            name: t.String(),
            description: t.String(),
            price: t.String()
        })
    })

