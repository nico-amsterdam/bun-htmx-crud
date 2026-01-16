import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { and, eq, isNull } from 'drizzle-orm'
import { getDB, tables, ModifyProductType } from "db"
import { ProductFormFields, CancelButton, newPage, validateFormAndCreatePage, validateIdAndUpdatePage } from './productForm'
import type { PageType } from './productForm'
import { gotoProductList } from './productList'
import { ElysiaSettings } from 'config'
import { authRedirect } from '../auth'
import { localeMiddleware } from '../../i18n/localeMiddleware'

function EditProductForm(page: PageType): JSX.Element {
    const _ = page.locale.t
    return (
        <form hx-post={`/product/${page.form.values.id}/edit`}><span>
            <ProductFormFields {...page} />
        </span><button type="submit" class="btn btn-primary">{_('Save')}</button>
            {" "}<CancelButton {...page} />
        </form>
    )
}

function EditProduct(page: PageType): JSX.Element {
    const _ = page.locale.t
    return (
        <main id="main">
            <h2>{_('Edit product')}</h2>
            <EditProductForm {...page} />
        </main>
    )
}

export const editProductController = new Elysia(ElysiaSettings)
    .use(html())
    .use(localeMiddleware)
    .use(authRedirect) // also sets authUser and csrfToken
    .get('/product/:id/edit', async ({ csrfToken, html, set, status, params: { id }, lang }) => {
        const page = newPage(lang)

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
        page.form.values.modifiedAt = product.modifiedAt?.toISOString() || ''

        return html(
            <EditProduct {...page} />
        )
    })
    .post('/product/:id/edit', async ({ authUser, csrfToken, html, set, body: { name, description, price, modifiedAt, csrf, lang }, params: { id } }) => {
        const page = validateFormAndCreatePage(name, description, price, lang)
        const _ = page.locale.t
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
            const verifyModifiedAt = modifiedAt === '' ? null : new Date(modifiedAt)
            console.log('Verify ' + verifyModifiedAt)
            const updatedProductIds: { updatedId: number }[] = await getDB().update(tables.products)
                .set(modifiedProduct).where(and(
                    eq(tables.products.id, +id),
                    (!verifyModifiedAt ? isNull(tables.products.modifiedAt) : eq(tables.products.modifiedAt, verifyModifiedAt))
                )).returning({ updatedId: tables.products.id })

            const countUpdates = updatedProductIds.length
            if (countUpdates === 0) errors['general'] = _("'{0}' is changed or removed by another user. Reopen it from the list.", modifiedProduct.name)
        } catch (error) {
            errors['general'] = _("Product '{0}' already exists", modifiedProduct.name)
        }

        if (Object.keys(errors).length > 0) {
            return html(
                <EditProductForm {...page} />
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

