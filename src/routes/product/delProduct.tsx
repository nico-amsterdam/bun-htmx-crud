import { Elysia, t } from 'elysia'
import { html, Html } from '@elysiajs/html'
import { and, eq } from 'drizzle-orm'
import { getDB, tables } from "db"
import { ElysiaSettings, LANDING_PAGE_PATH } from 'config'
import { getContentLanguage } from 'i18n/lang'
import { getBaseURL } from 'lib/url'
import { authRedirect } from '../auth'
import { newPage } from './page'
import type { PageType } from './page'
import { CancelButton } from './productForm'
import { gotoProductList } from './productList'

/*
 * Functions with JSX
 */

function DelProductForm(page: PageType): JSX.Element {
    const _ = page.locale.t
    return (
        <form hx-post={`/product/${page.form.values.id}/delete`}>
            <input type="hidden" name="csrf" id="csrf" value={page.form.csrfToken} />
            <input type="hidden" name="lang" id="lang" value={page.locale.lang} />
            <p>{_('The action cannot be undone.')}</p><button type="submit" class="btn btn-danger" autofocus>{_('Delete')}</button>
            {" "}<CancelButton {...page} />
        </form>
    )
}

function DelProduct(page: PageType): JSX.Element {
  const _ = page.locale.t

    return (
        <main id="main">
            <h2>{_("Delete product '{0}'", page.form.values.name)}</h2>
            <DelProductForm {...page} />
        </main>
    )
}

/*
 * Elysia controllers
 */

export const delProductController = new Elysia(ElysiaSettings)
    .use(html())
    .use(authRedirect)  // redirects or sets authUser and csrfToken
    .get('/product/:id/delete', async ({ csrfToken, html, redirect, request, set, params: { id } }) => {

        const page = newPage(getContentLanguage(set.headers))
        const product = await getDB().select().from(tables.products).where(and(
            eq(tables.products.id, +id)
        )).get()

        if (!product) {
            return redirect(getBaseURL(request.url) + LANDING_PAGE_PATH + page.locale.langQueryParam, 307)
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
    .post('/product/:id/delete', async ({ csrfToken, html, set, params: { id }, body: { csrf, lang } }) => {
        if (csrfToken === csrf) {
            // Delete product
            await getDB().delete(tables.products).where(
                eq(tables.products.id, +id)
            )
        }
        return html(await gotoProductList(set.headers, lang))
    }, { // TypeBox
        body: t.Object({
            csrf: t.String(),
            lang: t.String()
        })
    })
