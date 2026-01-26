import type { ElysiaConfig } from 'elysia';
import Container from 'typedi'

/*
 * Functions
 */

export function getEnv() {
  return Container.get<Env>('env')
}

/*
 * Variables
 */

export const ElysiaSettings = {
  aot: false,
  normalize: false,
  cookie: {
    // when using sameSite: "strict", session cookies got lost in the temporary redirects
    sameSite: "lax", // not all browsers use lax as default
    httpOnly: true,
    // secrets: used for signing cookies. TODO: change the secret in build/deploy step
    secrets: ["Ik zag twee beren"],
    sign: true,
    path: "/",
  }
} as ElysiaConfig<any>;