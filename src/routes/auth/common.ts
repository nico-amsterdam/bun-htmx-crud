/*
 * Shared code between index.tsx and github.tsx/google.tsx.
 *
 * Signalled by https://github.com/sverweij/dependency-cruiser
 */

export type UserType = {
  login: string
  name: string
  email: string
  avatar_url: string
}

export const AUTH_PATH = '/auth'

export const LOGIN_PATH = AUTH_PATH + '/login'
