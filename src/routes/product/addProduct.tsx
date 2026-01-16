import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { getDB, tables, AddProductType } from "db"
import { PageType, ProductFormFields, CancelButton, newPage, validateFormAndCreatePage } from './productForm'
import { gotoProductList } from './productList'
import { ElysiaSettings } from 'config'
import { authRedirect } from '../auth'
import { localeMiddleware } from '../../i18n/localeMiddleware'

function AddProductForm(page: PageType): JSX.Element {
    const _ = page.locale.t
    return (
        <form hx-post="/add-product"><span>
            <ProductFormFields {...page} />
        </span>
            <button type="submit" class="btn btn-primary">{_('Create')}</button>
            {" "}
            <CancelButton {...page} />
        </form>
    )
}

function AddProduct(page: PageType): JSX.Element {
    const _ = page.locale.t
    return (
        <main id="main">
            <h2>{_('Add new product')}</h2>
            <AddProductForm {...page} />
        </main>
    )
}

export const addProductController = new Elysia(ElysiaSettings)
    .use(html())
    .use(localeMiddleware)
    .use(authRedirect) // also sets authUser and csrfToken
    .get(
        '/add-product',
        ({ csrfToken, html, lang }) => {
            const page = newPage(lang)
            page.form.csrfToken = csrfToken
            return html(
                <AddProduct {...page} />
            )
        })
    .post('/add-product', async ({ authUser, csrfToken, html, set, body: { name, description, price, csrf, lang } }) => {
        const page = validateFormAndCreatePage(name, description, price, lang)
        const _ = page.locale.t
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
            if (!product) errors['general'] = _("Could not create '{0}'", newProduct.name)
        } catch (error) {
            errors['general'] = _("Product '{0}' already exists", newProduct.name)
        }

        if (Object.keys(errors).length > 0) {
            return html(
                <AddProductForm {...page} />
            )
        }

        return html(await gotoProductList(set.headers, lang))
    }, { // TypeBox
        body: t.Object({
            name: t.String(),
            description: t.String(),
            price: t.String(),
            modifiedAt: t.String(),
            csrf: t.String(),
            lang: t.String()
        })
    })
