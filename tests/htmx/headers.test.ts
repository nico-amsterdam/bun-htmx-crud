import { describe, it, expect } from 'bun:test'
import { HttpHeader, isHtmxEnabled } from '../../src/htmx/index'

describe('isHtmxEnabled', () => {
  it('should return true when HX-Request header is "true"', () => {
    const request = new Request('http://example.com', {
      headers: { 'HX-Request': 'true' }
    })
    expect(isHtmxEnabled(request)).toBe(true)
  })

  it('should return false when HX-Request header is "false"', () => {
    const request = new Request('http://example.com', {
      headers: { 'HX-Request': 'false' }
    })
    expect(isHtmxEnabled(request)).toBe(false)
  })

  it('should return false when HX-Request header is missing', () => {
    const request = new Request('http://example.com', {
      headers: {}
    })
    expect(isHtmxEnabled(request)).toBe(false)
  })

  it('should return false for empty HX-Request header', () => {
    const request = new Request('http://example.com', {
      headers: { 'HX-Request': '' }
    })
    expect(isHtmxEnabled(request)).toBe(false)
  })

  it('should return false for case-sensitive "true" (not "True" or "TRUE")', () => {
    const request = new Request('http://example.com', {
      headers: { 'HX-Request': 'True' }
    })
    expect(isHtmxEnabled(request)).toBe(false)
  })
})
