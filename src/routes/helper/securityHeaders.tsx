import { Elysia, HTTPHeaders } from 'elysia'
import { ElysiaSettings } from 'config'

function setContentSecurityPolicy(headers: HTTPHeaders) {
  // Cross-site-scripting protection with a safe CSP:
  headers['Content-Security-Policy'] = "default-src 'self';img-src 'self' data: https://*.googleusercontent.com/ https://avatars.githubusercontent.com/ ;"
}

export const addContentSecurityPolicyHeader = new Elysia(ElysiaSettings)
  .onBeforeHandle({ as: 'scoped' }, ({ set }) => {
    setContentSecurityPolicy(set.headers)
  })