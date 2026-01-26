import { Html } from '@elysiajs/html'
import type { LocaleType } from 'i18n/translations'
import type { UserType } from 'routes/auth'

export function Body({user, locale, child, contentClass}: {user: UserType, locale: LocaleType, child: JSX.Element, contentClass: string}): JSX.Element {
    const _ = locale.t
    return (
        <body class={`container light lang-${locale.lang}`} data-script="on every htmx:sendError call #networkErrDialog.showModal()">
            <a href="#main" id="skip-link" class="skip-link">Skip to main content</a>
            <section id="content" class={contentClass}>
                <header class="page-header">
                    <div class="topbar">
                        <h1>{_('HTMX CRUD Demo')}</h1>
                        <span class="color-scheme">
                            <button id="light-switch" class="btn light" title={_('Dark mode switch')} type="button" data-script="on click toggle .light on <body /> toggle .dark on <body />">
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" title="Dark mode switch" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="sun"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" title="Dark mode switch" width="1.5em" height="1.5em" viewBox="0 0 24 24" class="moon"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"></path></svg>
                            </button>
                        </span>
                        <span class="user">
                            <img width="50px" height="50px" id="user-image" src={user?.avatar_url} title={user?.name || _('Avatar')} />
                            <button type="button" data-script={`on click go to url /auth/login${locale.langQueryParam}`} class="btn btn-default signout">➜] {_('Sign out')}</button>
                        </span>
                    </div>
                    <div id="logos">
                        <a href="https://htmx.org" title="HTMX site" target="_blank" class="htmx-logo" tabindex="0">
                            <svg class="htmx-logo-svg" viewBox="0 0 512 118" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
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
                        <input type="hidden" id="search-state" value=""></input>
                    </div>
                </header>
                {child}
                <dialog id="networkErrDialog" data-script="on click if target is me call #networkErrDialog.close()">
                    <h2>{_('Network error')}</h2>
                    <p>{_('Offline? Check your connection')}</p>
                    <button id="closeNetworkErrDialogBtn" aria-controls="networkErrDialog" data-script="on click call #networkErrDialog.close()">Close</button>
                </dialog>
            </section>
        </body>
    )
}
