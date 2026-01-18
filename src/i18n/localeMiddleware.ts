import { Elysia } from 'elysia';
import { ElysiaSettings } from 'config'

export const NON_DEFAULT_LANGUAGES = ['de', 'es', 'fr']
export const STANDARD_LANGUAGE = 'en'

export const localeMiddleware = new Elysia({ ...ElysiaSettings, name: 'locale-middleware' })
  .derive({ as: 'scoped' }, ({ query, headers }) => {
    // Get locale from URL query parameter, or accept-language header, default to 'en'
    let locale = (query?.lang as string) ||
      (headers['accept-language']?.split(',')[0]?.split('-')[0] || STANDARD_LANGUAGE);

    if (!NON_DEFAULT_LANGUAGES.includes(locale)) {
      locale = STANDARD_LANGUAGE
    }

    return {
      lang: locale
    };
  });