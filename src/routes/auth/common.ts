/*
 * Type shared between index.tsx and github.tsx.
 *
 * Signalled by https://github.com/sverweij/dependency-cruiser
 */

export type UserType = {
  login: string
  name: string
  email: string
  avatar_url: string
}
