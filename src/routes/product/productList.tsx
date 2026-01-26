import { Elysia, HTTPHeaders } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { asc } from 'drizzle-orm'
import { HttpHeader, isHtmxEnabled } from 'lib/htmx'
import { getDB, tables } from "db"
import type { ProductType } from "db"
import { newPage } from './page'
import type { PageType } from './page'
import { ElysiaSettings } from 'config'
import { authRedirect } from '../auth'
import { BaseHtml } from '../helper/basePage'
import { Body } from '../helper/body'
import { LanguageSwitcher } from '../helper/languageSwitcher'
import { getContentLanguage } from 'i18n/lang'

/*
 * Functions with JSX
 */

function Product({ page, product }: { page: PageType, product: ProductType }): JSX.Element {
    const { id, name, description, price } = product
    const _ = page.locale.t
    let priceInEuro = ''
    if (price !== null && Number.isFinite(+price)) priceInEuro = "" + (+price / 100)
    return (
        <tr class="hide">
            <td><a hx-get={`/product/${id}/edit${page.locale.langQueryParam}`} hx-push-url="true" hx-trigger="click"
                data-script="on keyup if the event's key is 'Enter' trigger click"
                hx-target="#main" tabindex="0">{name}</a></td>
            <td>{description}</td>
            <td class="price">{priceInEuro}{priceInEuro !== '' ? ' €' : ''}</td>
            <td class="table-actions"><button type="button" hx-get={`/product/${id}/edit${page.locale.langQueryParam}`} hx-push-url="true" hx-target="#main" class="btn btn-warning btn-xs">{_('Edit')}</button>
                {" "}<button type="button" hx-get={`/product/${id}/delete${page.locale.langQueryParam}`} hx-push-url="true" hx-target="#main" class="btn btn-danger btn-xs">{_('Delete')}</button></td>
        </tr>
    )
}

function ProductList(page: PageType): JSX.Element {
    return (
        <tbody id="search-results">
            {page.data.products.map((product) => (
                <Product product={product} page={page} />
            ))}
        </tbody>
    )
}

function Main(page: PageType): JSX.Element {
    const _ = page.locale.t
    const productCount = page.data.products.length // zero or more than zero products?
    return (
        <main id="main">
            <div class="form-actions">
                <LanguageSwitcher linkTo='/product-list' locale={page.locale} />
                <button type="button" hx-get={`/add-product${page.locale.langQueryParam}`} hx-push-url="true" hx-target="#main" class="btn btn-default"><svg xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" ssr="true" title="+"
                    class="plussign iconify iconify--mdi" width="1em" height="1em" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
                </svg>{_('Add product')}</button>
                <button id="refresh" class="btn refresh" title={_('Refresh')} type="button" hx-get={'/product-list' + page.locale.langQueryParam} hx-push-url="true" hx-target="#main">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><g transform="translate(24 0) scale(-1 1)"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4m-4 4a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path></g></svg>
                </button>
            </div>
            <search class="filters row">
                <div class="form-group product-search"><label for="search-element">{_('Search product')}</label>
                    <input
                        class="form-control" name="search" id="search-element" autocomplete="off" tabindex="0"
                        autofocus
                        aria-description={_('Results will update as you type')}
                        data-script="
on load set my.value to #search-state.value
on blur set #search-state.value to my.value
on input or load
    set matchCount to 0
    set q to my value.toLowerCase().trim()

    repeat in <#search-results tr/>
        if its children[0].textContent.toLowerCase() contains q or its children[1].textContent.toLowerCase() contains q or its children[2].textContent contains q
            remove .hide from it
            increment matchCount
        else
            add .hide to it
        end
    end

    if matchCount is 0
        remove .hide from #noResults
    else
        add .hide to #noResults
    end" />
                </div>
            </search>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">{_('Name')}</th>
                        <th scope="col">{_('Description')}</th>
                        <th scope="col" class="price">{_('Price')}</th>
                        <th scope="col" class="table-actions">{_('Actions')}</th>
                    </tr>
                </thead>
                <ProductList {...page} />
                <tfoot id="search-results-footer">
                    <tr id="announceResults" aria-live="assertive" aria-atomic="true">
                        <td id="noResults" colspan="4" class={productCount === 0 ? '' : 'hide'}>{productCount === 0 ? _('No products available') : _('No search results found')}</td>
                    </tr>
                </tfoot>
            </table>
        </main>
    )
}

export async function gotoProductList(headers: HTTPHeaders, lang: string): Promise<JSX.Element> {
    const page = newPage(lang)

    headers[HttpHeader.HxReplaceURL] = `/product-list${page.locale.langQueryParam}`
    headers[HttpHeader.HxRetarget] = "#main"
    headers[HttpHeader.HxReswap] = "outerHTML"

    page.data.products = await getDB().select().from(tables.products).orderBy(asc(tables.products.name))

    return (
        <Main {...page} />
    )
}

/*
 * Elysia controllers
 */

export const productListController = new Elysia(ElysiaSettings)
    .use(html())
    .use(authRedirect) // redirects or sets authUser and csrfToken
    .get(
        '/product-list',
        async ({ authUser, html, request, set }) => {
            const page = newPage(getContentLanguage(set.headers))
            page.user = authUser

            page.data.products = await getDB().select().from(tables.products).orderBy(asc(tables.products.name))

            if (isHtmxEnabled(request)) {
                return html(
                    <Main {...page} />
                )
            }

            const main = <Main {...page} />
            const bodyWithMain = <Body user={page.user} locale={page.locale} child={main} contentClass="product-list"></Body>
            return html(
                <BaseHtml lang={page.locale.lang} body={bodyWithMain} />
            )
        }
    )
