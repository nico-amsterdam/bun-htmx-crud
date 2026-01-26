import { describe, it, expect } from 'bun:test'
import type { HTTPHeaders } from 'elysia'
import { NON_DEFAULT_LANGUAGES, getLang, getContentLanguage, setContentLanguage } from 'i18n/lang'

describe('NON_DEFAULT_LANGUAGES', () => {
  it('should contain supported non-English languages', () => {
    expect(NON_DEFAULT_LANGUAGES).toContain('de')
    expect(NON_DEFAULT_LANGUAGES).toContain('es')
    expect(NON_DEFAULT_LANGUAGES).toContain('fr')
  })

  it('should not contain English', () => {
    expect(NON_DEFAULT_LANGUAGES).not.toContain('en')
  })

  it('should not contain unsupported languages', () => {
    expect(NON_DEFAULT_LANGUAGES).not.toContain('zh')
    expect(NON_DEFAULT_LANGUAGES).not.toContain('ja')
    expect(NON_DEFAULT_LANGUAGES).not.toContain('ko')
  })

  it('should be an array', () => {
    expect(Array.isArray(NON_DEFAULT_LANGUAGES)).toBe(true)
  })

  it('should have exactly 3 supported languages', () => {
    expect(NON_DEFAULT_LANGUAGES.length).toBe(3)
  })
})

describe('getLang', () => {
  it('should return language from query parameter', () => {
    const headers = {}
    const query = { lang: 'de' }
    expect(getLang(headers, query)).toBe('de')
  })

  it('should return German from accept-language header', () => {
    const headers = { 'accept-language': 'de-DE,en-US;q=0.9' }
    const query = {}
    expect(getLang(headers, query)).toBe('de')
  })

  it('should return Spanish from accept-language header', () => {
    const headers = { 'accept-language': 'es-ES;q=0.8,fr;q=0.7' }
    const query = {}
    expect(getLang(headers, query)).toBe('es')
  })

  it('should return French from accept-language header', () => {
    const headers = { 'accept-language': 'fr-FR,en;q=0.5' }
    const query = {}
    expect(getLang(headers, query)).toBe('fr')
  })

  it('should return English for unsupported languages', () => {
    const headers = { 'accept-language': 'zh-CN,ja-JP' }
    const query = {}
    expect(getLang(headers, query)).toBe('en')
  })

  it('should return English when no headers or query', () => {
    const headers = {}
    const query = {}
    expect(getLang(headers, query)).toBe('en')
  })

  it('should prefer query parameter over accept-language header', () => {
    const headers = { 'accept-language': 'es-ES' }
    const query = { lang: 'de' }
    expect(getLang(headers, query)).toBe('de')
  })

  it('should return English for unsupported query language', () => {
    const headers = {}
    const query = { lang: 'zh' }
    expect(getLang(headers, query)).toBe('en')
  })

  it('should handle empty accept-language header', () => {
    const headers = { 'accept-language': '' }
    const query = {}
    expect(getLang(headers, query)).toBe('en')
  })
})

describe('getContentLanguage', () => {
  it('should return content-language header value', () => {
    const headers: HTTPHeaders = { 'content-language': 'de' }
    expect(getContentLanguage(headers)).toBe('de')
  })

  it('should return English when content-language is missing', () => {
    const headers: HTTPHeaders = {}
    expect(getContentLanguage(headers)).toBe('en')
  })
})

describe('setContentLanguage', () => {
  it('should set content-language header', () => {
    const headers: HTTPHeaders = {}
    const result = setContentLanguage(headers, 'de')
    expect(headers['content-language']).toBe('de')
    expect(result).toBe(headers)
  })

  it('should update existing content-language header', () => {
    const headers: HTTPHeaders = { 'content-language': 'en' }
    const result = setContentLanguage(headers, 'es')
    expect(headers['content-language']).toBe('es')
    expect(result).toBe(headers)
  })

  it('should return the modified headers object', () => {
    const headers: HTTPHeaders = {}
    const result = setContentLanguage(headers, 'fr')
    expect(result).toStrictEqual(headers)
  })
})
