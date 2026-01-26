import { describe, it, expect } from 'bun:test'
import { ElysiaSettings } from 'config'

describe('ElysiaSettings', () => {
  it('should be defined', () => {
    expect(ElysiaSettings).toBeDefined()
  })

  describe('aot setting', () => {
    it('should have aot set to false', () => {
      expect(ElysiaSettings.aot).toBe(false)
    })
  })

  describe('normalize setting', () => {
    it('should have normalize set to false', () => {
      expect(ElysiaSettings.normalize).toBe(false)
    })
  })

  describe('cookie configuration', () => {
    const cookie = ElysiaSettings.cookie!

    it('should have cookie configuration', () => {
      expect(cookie).toBeDefined()
    })

    it('should have sameSite set to lax', () => {
      expect(cookie.sameSite).toBe('lax')
    })

    it('should have httpOnly set to true', () => {
      expect(cookie.httpOnly).toBe(true)
    })

    it('should have secrets configured', () => {
      expect(cookie.secrets).toBeDefined()
      expect(Array.isArray(cookie.secrets)).toBe(true)
      expect((cookie.secrets as string[]).length).toBeGreaterThan(0)
    })

    it('should have sign set to true', () => {
      expect(cookie.sign).toBe(true)
    })

    it('should have path set to root', () => {
      expect(cookie.path).toBe('/')
    })
  })

  describe('cookie security best practices', () => {
    const cookie = ElysiaSettings.cookie!

    it('should use httpOnly to prevent XSS access', () => {
      expect(cookie.httpOnly).toBe(true)
    })

    it('should use lax sameSite for security balance', () => {
      expect(cookie.sameSite).toBe('lax')
    })

    it('should sign cookies for tamper protection', () => {
      expect(cookie.sign).toBe(true)
    })

    it('should have a non-empty secrets array', () => {
      expect((cookie.secrets as string[]).length).toBeGreaterThan(0)
    })
  })
})
