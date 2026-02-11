import { Elysia, status } from 'elysia'
import { isHtmxEnabled } from 'lib/htmx'
import { ElysiaSettings, LANDING_PAGE_PATH } from 'config'
import { newLocale } from 'i18n/translations'
import { getContentLanguage } from 'i18n/lang'
import { getBaseURL } from 'lib/url'

// redirect to main page when a page is openened directly that can only be swapped in.
export const htmxRedirect = new Elysia({ ...ElysiaSettings, name: 'htmxRedirect'})
  .onBeforeHandle({ as: 'scoped'}, ({ set, redirect, request }) => {
    const locale = newLocale(getContentLanguage(set.headers))
    if (!isHtmxEnabled(request)) {
      return redirect(getBaseURL(request.url) + LANDING_PAGE_PATH + locale.langQueryParam, 307)
    }
  })
