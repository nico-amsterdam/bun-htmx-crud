import { Elysia } from 'elysia';

export const NON_DEFAULT_LANGUAGES = ['de', 'es', 'fr']

export const localeMiddleware = new Elysia({
  name: 'locale-middleware'
}).derive({ as: 'scoped' }, ({ query, headers }) => {
  // Get locale from URL query parameter, or accept-language header, default to 'en'
  let locale = (query?.lang as string) ||
    (headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en');

  if (!NON_DEFAULT_LANGUAGES.includes(locale)) {
     locale = 'en'
  }

  return {
    lang: locale
  };
});