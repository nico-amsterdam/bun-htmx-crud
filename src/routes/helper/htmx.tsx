import { Elysia } from 'elysia'
import { isHtmxEnabled } from 'htmx'
import { ElysiaSettings } from '../../config'

// redirect to main page when a page is openened directly that can only be swapped in.
export const htmxRedirect = new Elysia({ ...ElysiaSettings, name: 'htmxRedirect'})
  .onBeforeHandle({ as: 'scoped'}, ({ set, request }) => {
    if (!isHtmxEnabled(request)) {
      set.headers['Location'] = '/product-list'
      return new Response('', { status: 307 })
    }
  })
