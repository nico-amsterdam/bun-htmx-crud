import { Elysia, HTTPHeaders } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { asc } from 'drizzle-orm'
import { HttpHeader, isHtmxEnabled } from 'htmx'
import { getDB, tables, ProductType } from "db"
import { PageType, newPage } from './productForm'
import { ElysiaSettings } from 'config'
import { authRedirect } from '../auth'
import { BaseHtml } from '../helper/basePage'

function Body(page: PageType): JSX.Element {
    return (
        <body class="container">
            <div id="content" class="product-list">
                <header class="page-header">
                    <div class="topbar">
                        <h1>Bun JSX HTMX CRUD</h1>
                        <span class="user">
                            <img width="50px" height="50px" id="user-image" src={page.user?.avatar_url} title="Avatar" />
                            <a title="Sign out" href="/auth/login" class="signout">➜] Sign out</a>
                        </span>
                    </div>
                    <div id="logos">
                        <a href="https://bun.com" title="Bun site" target="_blank">
                            <img class="js-headerLogo Header-logo" alt="Bun logo" width="25px" src="data:image/svg+xml;base64, PHN2ZyBpZD0iQnVuIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA3MCI+PHRpdGxlPkJ1biBMb2dvPC90aXRsZT48cGF0aCBpZD0iU2hhZG93IiBkPSJNNzEuMDksMjAuNzRjLS4xNi0uMTctLjMzLS4zNC0uNS0uNXMtLjMzLS4zNC0uNS0uNS0uMzMtLjM0LS41LS41LS4zMy0uMzQtLjUtLjUtLjMzLS4zNC0uNS0uNS0uMzMtLjM0LS41LS41LS4zMy0uMzQtLjUtLjVBMjYuNDYsMjYuNDYsMCwwLDEsNzUuNSwzNS43YzAsMTYuNTctMTYuODIsMzAuMDUtMzcuNSwzMC4wNS0xMS41OCwwLTIxLjk0LTQuMjMtMjguODMtMTAuODZsLjUuNS41LjUuNS41LjUuNS41LjUuNS41LjUuNUMxOS41NSw2NS4zLDMwLjE0LDY5Ljc1LDQyLDY5Ljc1YzIwLjY4LDAsMzcuNS0xMy40OCwzNy41LTMwQzc5LjUsMzIuNjksNzYuNDYsMjYsNzEuMDksMjAuNzRaIi8+PGcgaWQ9IkJvZHkiPjxwYXRoIGlkPSJCYWNrZ3JvdW5kIiBkPSJNNzMsMzUuN2MwLDE1LjIxLTE1LjY3LDI3LjU0LTM1LDI3LjU0UzMsNTAuOTEsMywzNS43QzMsMjYuMjcsOSwxNy45NCwxOC4yMiwxM1MzMy4xOCwzLDM4LDNzOC45NCw0LjEzLDE5Ljc4LDEwQzY3LDE3Ljk0LDczLDI2LjI3LDczLDM1LjdaIiBzdHlsZT0iZmlsbDojZmJmMGRmIi8+PHBhdGggaWQ9IkJvdHRvbV9TaGFkb3ciIGRhdGEtbmFtZT0iQm90dG9tIFNoYWRvdyIgZD0iTTczLDM1LjdhMjEuNjcsMjEuNjcsMCwwLDAtLjgtNS43OGMtMi43MywzMy4zLTQzLjM1LDM0LjktNTkuMzIsMjQuOTRBNDAsNDAsMCwwLDAsMzgsNjMuMjRDNTcuMyw2My4yNCw3Myw1MC44OSw3MywzNS43WiIgc3R5bGU9ImZpbGw6I2Y2ZGVjZSIvPjxwYXRoIGlkPSJMaWdodF9TaGluZSIgZGF0YS1uYW1lPSJMaWdodCBTaGluZSIgZD0iTTI0LjUzLDExLjE3QzI5LDguNDksMzQuOTQsMy40Niw0MC43OCwzLjQ1QTkuMjksOS4yOSwwLDAsMCwzOCwzYy0yLjQyLDAtNSwxLjI1LTguMjUsMy4xMy0xLjEzLjY2LTIuMywxLjM5LTMuNTQsMi4xNS0yLjMzLDEuNDQtNSwzLjA3LTgsNC43QzguNjksMTguMTMsMywyNi42MiwzLDM1LjdjMCwuNCwwLC44LDAsMS4xOUM5LjA2LDE1LjQ4LDIwLjA3LDEzLjg1LDI0LjUzLDExLjE3WiIgc3R5bGU9ImZpbGw6I2ZmZmVmYyIvPjxwYXRoIGlkPSJUb3AiIGQ9Ik0zNS4xMiw1LjUzQTE2LjQxLDE2LjQxLDAsMCwxLDI5LjQ5LDE4Yy0uMjguMjUtLjA2LjczLjMuNTksMy4zNy0xLjMxLDcuOTItNS4yMyw2LTEzLjE0QzM1LjcxLDUsMzUuMTIsNS4xMiwzNS4xMiw1LjUzWm0yLjI3LDBBMTYuMjQsMTYuMjQsMCwwLDEsMzksMTljLS4xMi4zNS4zMS42NS41NS4zNkM0MS43NCwxNi41Niw0My42NSwxMSwzNy45Myw1LDM3LjY0LDQuNzQsMzcuMTksNS4xNCwzNy4zOSw1LjQ5Wm0yLjc2LS4xN0ExNi40MiwxNi40MiwwLDAsMSw0NywxNy4xMmEuMzMuMzMsMCwwLDAsLjY1LjExYy45Mi0zLjQ5LjQtOS40NC03LjE3LTEyLjUzQzQwLjA4LDQuNTQsMzkuODIsNS4wOCw0MC4xNSw1LjMyWk0yMS42OSwxNS43NmExNi45NCwxNi45NCwwLDAsMCwxMC40Ny05Yy4xOC0uMzYuNzUtLjIyLjY2LjE4LTEuNzMsOC03LjUyLDkuNjctMTEuMTIsOS40NUMyMS4zMiwxNi40LDIxLjMzLDE1Ljg3LDIxLjY5LDE1Ljc2WiIgc3R5bGU9ImZpbGw6I2NjYmVhNztmaWxsLXJ1bGU6ZXZlbm9kZCIvPjxwYXRoIGlkPSJPdXRsaW5lIiBkPSJNMzgsNjUuNzVDMTcuMzIsNjUuNzUuNSw1Mi4yNy41LDM1LjdjMC0xMCw2LjE4LTE5LjMzLDE2LjUzLTI0LjkyLDMtMS42LDUuNTctMy4yMSw3Ljg2LTQuNjIsMS4yNi0uNzgsMi40NS0xLjUxLDMuNi0yLjE5QzMyLDEuODksMzUsLjUsMzgsLjVzNS42MiwxLjIsOC45LDMuMTRjMSwuNTcsMiwxLjE5LDMuMDcsMS44NywyLjQ5LDEuNTQsNS4zLDMuMjgsOSw1LjI3QzY5LjMyLDE2LjM3LDc1LjUsMjUuNjksNzUuNSwzNS43LDc1LjUsNTIuMjcsNTguNjgsNjUuNzUsMzgsNjUuNzVaTTM4LDNjLTIuNDIsMC01LDEuMjUtOC4yNSwzLjEzLTEuMTMuNjYtMi4zLDEuMzktMy41NCwyLjE1LTIuMzMsMS40NC01LDMuMDctOCw0LjdDOC42OSwxOC4xMywzLDI2LjYyLDMsMzUuNywzLDUwLjg5LDE4LjcsNjMuMjUsMzgsNjMuMjVTNzMsNTAuODksNzMsMzUuN0M3MywyNi42Miw2Ny4zMSwxOC4xMyw1Ny43OCwxMyw1NCwxMSw1MS4wNSw5LjEyLDQ4LjY2LDcuNjRjLTEuMDktLjY3LTIuMDktMS4yOS0zLTEuODRDNDIuNjMsNCw0MC40MiwzLDM4LDNaIi8+PC9nPjxnIGlkPSJNb3V0aCI+PGcgaWQ9IkJhY2tncm91bmQtMiIgZGF0YS1uYW1lPSJCYWNrZ3JvdW5kIj48cGF0aCBkPSJNNDUuMDUsNDNhOC45Myw4LjkzLDAsMCwxLTIuOTIsNC43MSw2LjgxLDYuODEsMCwwLDEtNCwxLjg4QTYuODQsNi44NCwwLDAsMSwzNCw0Ny43MSw4LjkzLDguOTMsMCwwLDEsMzEuMTIsNDNhLjcyLjcyLDAsMCwxLC44LS44MUg0NC4yNkEuNzIuNzIsMCwwLDEsNDUuMDUsNDNaIiBzdHlsZT0iZmlsbDojYjcxNDIyIi8+PC9nPjxnIGlkPSJUb25ndWUiPjxwYXRoIGlkPSJCYWNrZ3JvdW5kLTMiIGRhdGEtbmFtZT0iQmFja2dyb3VuZCIgZD0iTTM0LDQ3Ljc5YTYuOTEsNi45MSwwLDAsMCw0LjEyLDEuOSw2LjkxLDYuOTEsMCwwLDAsNC4xMS0xLjksMTAuNjMsMTAuNjMsMCwwLDAsMS0xLjA3LDYuODMsNi44MywwLDAsMC00LjktMi4zMSw2LjE1LDYuMTUsMCwwLDAtNSwyLjc4QzMzLjU2LDQ3LjQsMzMuNzYsNDcuNiwzNCw0Ny43OVoiIHN0eWxlPSJmaWxsOiNmZjYxNjQiLz48cGF0aCBpZD0iT3V0bGluZS0yIiBkYXRhLW5hbWU9Ik91dGxpbmUiIGQ9Ik0zNC4xNiw0N2E1LjM2LDUuMzYsMCwwLDEsNC4xOS0yLjA4LDYsNiwwLDAsMSw0LDEuNjljLjIzLS4yNS40NS0uNTEuNjYtLjc3YTcsNywwLDAsMC00LjcxLTEuOTMsNi4zNiw2LjM2LDAsMCwwLTQuODksMi4zNkE5LjUzLDkuNTMsMCwwLDAsMzQuMTYsNDdaIi8+PC9nPjxwYXRoIGlkPSJPdXRsaW5lLTMiIGRhdGEtbmFtZT0iT3V0bGluZSIgZD0iTTM4LjA5LDUwLjE5YTcuNDIsNy40MiwwLDAsMS00LjQ1LTIsOS41Miw5LjUyLDAsMCwxLTMuMTEtNS4wNSwxLjIsMS4yLDAsMCwxLC4yNi0xLDEuNDEsMS40MSwwLDAsMSwxLjEzLS41MUg0NC4yNmExLjQ0LDEuNDQsMCwwLDEsMS4xMy41MSwxLjE5LDEuMTksMCwwLDEsLjI1LDFoMGE5LjUyLDkuNTIsMCwwLDEtMy4xMSw1LjA1QTcuNDIsNy40MiwwLDAsMSwzOC4wOSw1MC4xOVptLTYuMTctNy40Yy0uMTYsMC0uMi4wNy0uMjEuMDlhOC4yOSw4LjI5LDAsMCwwLDIuNzMsNC4zN0E2LjIzLDYuMjMsMCwwLDAsMzguMDksNDlhNi4yOCw2LjI4LDAsMCwwLDMuNjUtMS43Myw4LjMsOC4zLDAsMCwwLDIuNzItNC4zNy4yMS4yMSwwLDAsMC0uMi0uMDlaIi8+PC9nPjxnIGlkPSJGYWNlIj48ZWxsaXBzZSBpZD0iUmlnaHRfQmx1c2giIGRhdGEtbmFtZT0iUmlnaHQgQmx1c2giIGN4PSI1My4yMiIgY3k9IjQwLjE4IiByeD0iNS44NSIgcnk9IjMuNDQiIHN0eWxlPSJmaWxsOiNmZWJiZDAiLz48ZWxsaXBzZSBpZD0iTGVmdF9CbHVjaCIgZGF0YS1uYW1lPSJMZWZ0IEJsdWNoIiBjeD0iMjIuOTUiIGN5PSI0MC4xOCIgcng9IjUuODUiIHJ5PSIzLjQ0IiBzdHlsZT0iZmlsbDojZmViYmQwIi8+PHBhdGggaWQ9IkV5ZXMiIGQ9Ik0yNS43LDM4LjhhNS41MSw1LjUxLDAsMSwwLTUuNS01LjUxQTUuNTEsNS41MSwwLDAsMCwyNS43LDM4LjhabTI0Ljc3LDBBNS41MSw1LjUxLDAsMSwwLDQ1LDMzLjI5LDUuNSw1LjUsMCwwLDAsNTAuNDcsMzguOFoiIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZCIvPjxwYXRoIGlkPSJJcmlzIiBkPSJNMjQsMzMuNjRhMi4wNywyLjA3LDAsMSwwLTIuMDYtMi4wN0EyLjA3LDIuMDcsMCwwLDAsMjQsMzMuNjRabTI0Ljc3LDBhMi4wNywyLjA3LDAsMSwwLTIuMDYtMi4wN0EyLjA3LDIuMDcsMCwwLDAsNDguNzUsMzMuNjRaIiBzdHlsZT0iZmlsbDojZmZmO2ZpbGwtcnVsZTpldmVub2RkIi8+PC9nPjwvc3ZnPg==" />
                        </a>
                        <a href="https://htmx.org" title="HTMX site" target="_blank" class="htmx-logo" tabindex="0">
                            <svg class="htmx-logo-svg" viewBox="0 0 512 118" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                <title>HTMX</title>
                                <g>
                                    <g transform="translate(223.3447, 1.263)">
                                        <path d="M17.8254996,0 L17.5598845,31.7515907 L17.8254996,31.6337284 C48.1700418,24.0841275 54.670026,44.6913488 54.670026,54.6584661 L54.670026,94.3433005 L36.460168,94.3433005 L36.460168,55.8061374 C36.460168,49.9174046 33.5739581,41.5187969 17.8254996,46.3858871 L17.8257947,94.3433005 L0,94.3433005 L0,3.69864902 L17.8254996,0 Z M213.632717,56.9107711 L213.632717,94.3125593 L196.707296,94.3125593 L196.707296,56.9107711 L196.697909,56.4419487 C196.441123,49.9797562 190.90802,41.3965425 179.096702,46.9352148 L179.096702,94.3125593 L160.541261,94.3125593 L160.538367,56.5251064 C160.455137,51.0662144 158.484668,43.1969301 142.917274,44.5424567 L142.917274,94.3125593 L125.566489,94.3125593 L125.566489,34.5188504 L126.065623,34.2115136 C130.261196,31.6281282 152.39848,24.7975461 170.161803,35.5544661 C199.99949,20.696214 213.632717,36.7046538 213.632717,56.9107711 Z M88.1139423,10.9997558 L88.1139423,30.539338 L110.980118,30.5402598 L110.980118,45.2009426 L88.967508,45.2006247 L88.9677941,69.3578453 C88.9677941,72.6876794 89.0862565,75.1171204 89.9464097,76.5489262 C95.2895838,81.15652 102.30082,81.7481278 110.980118,78.3237497 L112.449157,92.795822 C94.6124334,97.8853152 82.3932891,96.0929452 75.7917244,87.4187121 C72.2551151,83.4522387 70.499374,78.0007112 70.499374,71.1101435 L70.499374,14.8228876 L88.1139423,10.9997558 Z" fill="#111111" />
                                        <polygon fill="#4065C5" points="223.509011 30.5954284 242.839974 30.5954284 255.90407 50.7743785 267.94821 30.5954284 286.997537 30.5954284 265.495849 61.3723433 288.655314 94.3125593 268.634212 94.3125593 255.253274 72.162321 241.872336 94.3125593 222.469112 94.3125593 245.805871 61.3723433" />
                                    </g>
                                    <g>
                                        <polygon fill="#111111" points="127.034576 29.9381957 179.282027 51.9665646 179.282027 67.2739923 127.034576 88.9956807 122.890712 73.9408967 161.526789 59.4411929 122.890712 44.8857548" />
                                        <polygon fill="#111111" points="52.2474505 29.9376299 4.62634637e-14 51.9665646 1.2860272e-13 67.2739923 52.2474505 88.9956807 56.3913143 73.9408967 17.7552379 59.4411929 56.3913143 44.8857548" />
                                        <polygon fill="#4065C5" points="101.084149 -1.11671878e-15 119.057207 -1.11671878e-15 79.1293384 117.030912 60.2248197 117.030912" />
                                    </g>
                                </g>
                            </svg>
                        </a>
                        <a href="https://elysiajs.com" title="Elysia site" target="_blank">
                            <img class="elysia-logo-svg" alt="Elysia logo" width="25px" src="/image/elysia.svg" />
                        </a>
                    </div>
                </header>
                <Main {...page} />
            </div>
        </body>
    )
}

function Product({ id, name, description, price }: ProductType): JSX.Element {
    let priceInEuro = ''
    if (price !== null && Number.isFinite(+price)) priceInEuro = "" + (+price / 100)
    return (
        <tr>
            <td><a hx-get={`/product/${id}/edit`} hx-push-url="true" hx-trigger="click"
                data-script="on keyup if the event's key is 'Enter' trigger click"
                hx-target="#main" tabindex="0">{name}</a></td>
            <td>{description}</td>
            <td>{priceInEuro}{priceInEuro !== '' ? ' €' : ''}</td>
            <td><button type="button" hx-get={`/product/${id}/edit`} hx-push-url="true" hx-target="#main" class="btn btn-warning btn-xs">Edit</button>
                {" "}<button type="button" hx-get={`/product/${id}/delete`} hx-push-url="true" hx-target="#main" class="btn btn-danger btn-xs">Delete</button></td>
        </tr>
    )
}

function ProductList(page: PageType): JSX.Element {
    return (
        <tbody id="search-results">
            {page.data.products.map((product) => (
                <Product {...product} />
            ))}
        </tbody>
    )
}

function Main(page: PageType): JSX.Element {
    return (
        <main id="main">
            <div class="actions"><button type="button" hx-get="/add-product" hx-push-url="true" hx-target="#main" class="btn btn-default"><svg xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" ssr="true" title="+"
                class="plussign iconify iconify--mdi" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
            </svg> Add product </button></div>
            <div class="filters row">
                <div class="form-group col-sm-3"><label for="search-element">Search product</label><input
                    class="form-control" name="search" id="search-element" autocomplete="off" tabindex="0"
                    autofocus
                    data-script="on input show <tbody > tr/> in #search-results when its children[0].textContent.toLowerCase() contains my value.toLowerCase() or its children[1].textContent.toLowerCase() contains my value.toLowerCase() or its children[2].textContent contains my value"
                /></div>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th class="col-sm-2">Actions</th>
                    </tr>
                </thead>
                <ProductList {...page} />
            </table>
        </main>
    )
}

const PRODUCT_LIST_PATH = '/product-list'

export async function gotoProductList(headers: HTTPHeaders): Promise<JSX.Element> {
    headers[HttpHeader.HxReplaceURL] = PRODUCT_LIST_PATH
    headers[HttpHeader.HxRetarget] = "#main"
    headers[HttpHeader.HxReswap] = "outerHTML"

    const page = newPage()
    page.data.products = await getDB().select().from(tables.products).orderBy(asc(tables.products.name))

    return (
        <Main {...page} />
    )
}

export const productListController = new Elysia(ElysiaSettings)
    .use(html())
    .use(authRedirect) // also sets authUser and csrfToken
    .get(
        PRODUCT_LIST_PATH,
        async ({ authUser, html, request }) => {

            const page = newPage()
            page.user = authUser

            page.data.products = await getDB().select().from(tables.products).orderBy(asc(tables.products.name))

            if (isHtmxEnabled(request)) {
                return html(
                    <Main {...page} />
                )
            }

            return html(
                <BaseHtml>
                    <Body {...page} />
                </BaseHtml>
            )
        }
    )


