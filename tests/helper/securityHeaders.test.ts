import { describe, it, expect } from 'bun:test'
import { allowRequest } from '../../src/routes/helper/securityHeaders'

describe('allowRequest', () => {
  describe('no fetch metadata (crawlers/old browsers)', () => {
    it('should allow requests without sec-fetch-site', () => {
      expect(allowRequest('GET', '/product-list', {})).toBe(true)
    })
    it('should allow POST without sec-fetch-site', () => {
      expect(allowRequest('POST', '/add-product', {})).toBe(true)
    })
    it('should allow DELETE without sec-fetch-site', () => {
      expect(allowRequest('DELETE', '/product/1/delete', {})).toBe(true)
    })
  })

  describe('same-origin requests', () => {
    it('should allow GET same-origin requests', () => {
      expect(allowRequest('GET', '/product-list', { 'sec-fetch-site': 'same-origin' })).toBe(true)
    })
    it('should allow POST same-origin requests', () => {
      expect(allowRequest('POST', '/add-product', { 'sec-fetch-site': 'same-origin' })).toBe(true)
    })
  })

  describe('browser-initiated requests', () => {
    it('should allow requests with sec-fetch-site: none', () => {
      expect(allowRequest('GET', '/product-list', { 'sec-fetch-site': 'none' })).toBe(true)
    })
  })

  describe('navigational requests', () => {
    it('should allow GET navigate requests', () => {
      expect(allowRequest('GET', '/product-list', { 
        'sec-fetch-site': 'cross-site', 
        'sec-fetch-mode': 'navigate',
        'sec-fetch-dest': 'document'
      })).toBe(true)
    })
    it('should reject navigate requests with object dest', () => {
      expect(allowRequest('GET', '/product-list', { 
        'sec-fetch-site': 'cross-site', 
        'sec-fetch-mode': 'navigate',
        'sec-fetch-dest': 'object'
      })).toBe(false)
    })
    it('should reject navigate requests with embed dest', () => {
      expect(allowRequest('GET', '/product-list', { 
        'sec-fetch-site': 'cross-site', 
        'sec-fetch-mode': 'navigate',
        'sec-fetch-dest': 'embed'
      })).toBe(false)
    })
  })

  describe('exempt paths', () => {
    it('should allow /health endpoint', () => {
      expect(allowRequest('GET', '/health', {})).toBe(true)
    })
    it('should allow /favicon.ico', () => {
      expect(allowRequest('GET', '/favicon.ico', {})).toBe(true)
    })
    it('should allow /image/ paths', () => {
      expect(allowRequest('GET', '/image/logo.png', {})).toBe(true)
    })
    it('should allow nested /image/ paths', () => {
      expect(allowRequest('GET', '/image/icons/avatar.jpg', {})).toBe(true)
    })
  })

  describe('cross-site rejection', () => {
    it('should reject cross-site POST requests', () => {
      expect(allowRequest('POST', '/add-product', { 'sec-fetch-site': 'cross-site' })).toBe(false)
    })
    it('should reject cross-site same-site requests with non-navigate mode', () => {
      expect(allowRequest('GET', '/api/data', { 
        'sec-fetch-site': 'same-site', 
        'sec-fetch-mode': 'cors'
      })).toBe(false)
    })
    it('should reject cross-site PUT requests', () => {
      expect(allowRequest('PUT', '/product/1/edit', { 'sec-fetch-site': 'cross-site' })).toBe(false)
    })
  })
})
