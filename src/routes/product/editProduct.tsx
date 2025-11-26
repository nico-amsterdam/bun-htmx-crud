import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { and, eq } from 'drizzle-orm'
import { getDB, tables, ModifyProductType } from "db"
import { PageType, ProductFormFields, CancelButton, newPage, validateFormAndCreatePage, validateIdAndUpdatePage } from './productForm'
import { gotoProductList } from './productList'
import { ElysiaSettings } from 'config'
import { authRedirect } from '../auth'

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

export const editProductController = new Elysia(ElysiaSettings)
    .use(html())
    .use(authRedirect)
    .get('/product/:id/edit', async ({ csrfToken, html, set, status, params: { id } }) => {
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
        if (product.price !== null) page.form.values.price = "" + (product.price / 100)

        return html(
            <EditProduct {...page} />
        )
    })
    .post('/product/:id/edit', async ({ authUser, csrfToken, html, set, body: { name, description, price, csrf }, params: { id } }) => {
        const page = validateFormAndCreatePage(name, description, price)
        page.form.csrfToken = csrfToken
        validateIdAndUpdatePage(page, id)
        let errors = page.form.errors
        if (Object.keys(errors).length > 0 || csrfToken !== csrf) {
            return html(
                <EditProductForm {...page} />
            )
        }

        const modifiedProduct: ModifyProductType = {
            id: +id
            , name: name.trim()
            , description: description.trimEnd()
            , price: (price === '' ? null : +price * 100)
            , modifiedBy: authUser.login || 'unknown'
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
            price: t.String(),
            csrf: t.String()
        })
    })

