import { describe, it, expect } from 'bun:test'
import { NON_DEFAULT_LANGUAGES } from '../../src/i18n/lang'

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
