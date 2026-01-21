import type { HTTPHeaders } from 'elysia'

export const NON_DEFAULT_LANGUAGES = ['de', 'es', 'fr']
export const STANDARD_LANGUAGE = 'en'

export function getLang(headers: Record<string, string | undefined>, query: Record<string, string>): string {
  // Get locale from URL query parameter, or accept-language header, default to 'en'
  let locale = (query?.lang as string) ||
    (headers['accept-language']?.split(',')[0]?.split('-')[0] || STANDARD_LANGUAGE);

  if (!NON_DEFAULT_LANGUAGES.includes(locale)) {
    locale = STANDARD_LANGUAGE
  }
  return locale
}

export function getContentLanguage(httpHeaders: HTTPHeaders): string {
  return httpHeaders['content-language'] || STANDARD_LANGUAGE
}

export function setContentLanguage(httpHeaders: HTTPHeaders, lang: string): HTTPHeaders {
  httpHeaders['content-language'] = lang
  return httpHeaders
}
