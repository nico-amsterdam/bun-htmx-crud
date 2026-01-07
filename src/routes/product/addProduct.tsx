import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { getDB, tables, AddProductType } from "db"
import { PageType, ProductFormFields, CancelButton, newPage, validateFormAndCreatePage } from './productForm'
import { gotoProductList } from './productList'
import { ElysiaSettings } from 'config'
import { authRedirect } from '../auth'

function AddProductForm(page: PageType): JSX.Element {
    return (
        <form hx-post="/add-product"><span>
            <ProductFormFields {...page} />
        </span>
            <button type="submit" class="btn btn-primary">Create</button>
            {" "}
            <CancelButton />
        </form>
    )
}

function AddProduct(page: PageType): JSX.Element {
    return (
        <main id="main">
            <h2>Add new product</h2>
            <AddProductForm {...page} />
        </main>
    )
}

export const addProductController = new Elysia(ElysiaSettings)
    .use(html())
    .use(authRedirect) // also sets authUser and csrfToken
    .get(
        '/add-product',
        ({ csrfToken, html }) => {
            const page = newPage()
            page.form.csrfToken = csrfToken
            return html(
                <AddProduct {...page} />
            )
        })
    .post('/add-product', async ({ authUser, csrfToken, html, set, body: { name, description, price, csrf } }) => {
        const page = validateFormAndCreatePage(name, description, price)
        page.form.csrfToken = csrfToken
        let errors = page.form.errors
        if (Object.keys(errors).length > 0 || csrfToken !== csrf) {
            return html(
                <AddProductForm {...page} />
            )
        }

        const newProduct: AddProductType = {
              name: name.trim()
            , description: description.trimEnd()
            , price: (price === '' ? null : +price * 100)
            , createdBy: authUser.login || 'unknown'
            , createdAt: new Date()
        }

        // Insert product
        try {
            const product = await getDB().insert(tables.products).values(newProduct).returning().get()
            if (!product) errors["general"] = `Could not create '${newProduct.name}'`
        } catch (error) {
            errors["general"] = `Product '${newProduct.name}' already exists`
        }

        if (Object.keys(errors).length > 0) {
            return html(
                <AddProductForm {...page} />
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
