import { Elysia, HTTPHeaders } from 'elysia'
import { ElysiaSettings } from 'config'

function setContentSecurityPolicy(headers: HTTPHeaders) {
  // Cross-site-scripting protection with a safe CSP:
  headers['Content-Security-Policy'] = "default-src 'self';img-src 'self' data: https://*.googleusercontent.com/ https://avatars.githubusercontent.com/ ;"
}

export const addContentSecurityPolicyHeader = new Elysia({ ...ElysiaSettings, name: 'addCSP' })
  .onBeforeHandle({ as: 'scoped'}, ({ set }) => {
    setContentSecurityPolicy(set.headers)
  })

// Reject cross-origin requests to protect from CSRF, XSSI, and other bugs.
// see https://web.dev/articles/fetch-metadata
export function allowRequest(method: string, path: string, headers: Record<string, string | undefined>): boolean {

  // Allow requests from browsers which don't send Fetch Metadata
  if (!headers['sec-fetch-site']) {
    // crawler or old browser
    return true
  }

  // Allow application and browser-initiated requests.
  // Do not trust subdomains (same-site).
  if (['same-origin', 'none'].includes(headers['sec-fetch-site'])) {
    return true
  }

  // Allow simple top-level navigations except <object> and <embed>
  if (
    headers['sec-fetch-mode'] === 'navigate' && method === 'GET' &&
    !['object', 'embed'].includes(headers['sec-fetch-dest'] || '')
  ) {
    return true
  }

  // Exempt paths/endpoints meant to be served cross-origin
  if (['/health', '/favicon.ico'].includes(path) || path.startsWith('/image/')) {
    return true
  }

  console.log('deny access because sec-fetch-site=' + headers['sec-fetch-site'] + ' and sec-fetch-mode=' + headers['sec-fetch-mode'] + ' with set-fetch-dest=' + headers['sec-fetch-dest'])

  // Reject all other requests that are cross-site and not navigational
  return false
}
