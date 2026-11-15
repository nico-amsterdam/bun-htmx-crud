import { Elysia, HTTPHeaders } from 'elysia'


function setContentSecurityPolicy(headers: HTTPHeaders) {
  // Cross-site-scripting protection with a safe CSP:
  headers['Content-Security-Policy'] = "default-src 'self';img-src 'self' data: https://*.googleusercontent.com/ https://avatars.githubusercontent.com/ ;"
}

/*
 * Elysia controllers
 */

export const addContentSecurityPolicyHeader = new Elysia({ name: 'addCSP' })
  .onBeforeHandle({ as: 'scoped'}, ({ set }) => {
    setContentSecurityPolicy(set.headers)
  })