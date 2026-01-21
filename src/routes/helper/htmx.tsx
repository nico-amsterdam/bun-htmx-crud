import { Elysia } from 'elysia'
import { isHtmxEnabled } from 'htmx'
import { ElysiaSettings } from 'config'
import { newLocale } from 'i18n/translations'
import { getContentLanguage } from 'i18n/lang'

// redirect to main page when a page is openened directly that can only be swapped in.
export const htmxRedirect = new Elysia({ ...ElysiaSettings, name: 'htmxRedirect'})
  .onBeforeHandle({ as: 'scoped'}, ({ set, request }) => {
    const locale = newLocale(getContentLanguage(set.headers))
    if (!isHtmxEnabled(request)) {
      set.headers['Location'] = '/product-list' + locale.langQueryParam
      return new Response('', { status: 307 })
    }
  })
