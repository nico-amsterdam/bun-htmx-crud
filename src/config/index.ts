import type { ElysiaConfig } from 'elysia';
import Container from 'typedi'

export const getEnv = () => Container.get<Env>('env')

export const ElysiaSettings = {
  aot: false,
  normalize: false,
  cookie: {
        httpOnly: true,
   //     sameSite: "strict",  when strict, cookies get lost in redirects
        secrets: ["Er waren eens twee beren"],
        sign: true,
        path: "/",
    }
} as ElysiaConfig<any>;