import { describe, it, expect } from 'bun:test'
import { createSecretKey } from 'crypto'
import { generateSecureRandomString, getIp, stripMobileDesktopFromUserAgent, calcStateHmac, allowRequest } from 'lib/security'

describe('generateSecureRandomString', () => {
  it('should generate a string of correct length (minimum 24 characters)', () => {
    const result = generateSecureRandomString()
    expect(result.length).toBeGreaterThan(23)
  })

  it('should only contain characters from the allowed alphabet', () => {
    const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789'
    const result = generateSecureRandomString()
    for (const char of result) {
      expect(alphabet.includes(char)).toBe(true)
    }
  })

  it('should exclude confusing characters (l, o, 0, 1)', () => {
    const result = generateSecureRandomString()
    expect(result.includes('l')).toBe(false)
    expect(result.includes('o')).toBe(false)
    expect(result.includes('0')).toBe(false)
    expect(result.includes('1')).toBe(false)
  })

  it('should generate different strings on subsequent calls', () => {
    const result1 = generateSecureRandomString()
    const result2 = generateSecureRandomString()
    expect(result1).not.toBe(result2)
  })
})

describe('getIp', () => {
  it('should return IP from cf-connecting-ip header', () => {
    const headers = { 'cf-connecting-ip': '192.168.1.1' }
    expect(getIp(headers)).toBe('192.168.1.1')
  })

  it('should return empty string when cf-connecting-ip is missing', () => {
    const headers = {}
    expect(getIp(headers)).toBe('')
  })

  it('should return empty string when cf-connecting-ip is undefined', () => {
    const headers = { 'cf-connecting-ip': undefined }
    expect(getIp(headers)).toBe('')
  })

  it('should handle IPv6 addresses', () => {
    const headers = { 'cf-connecting-ip': '2001:db8::1' }
    expect(getIp(headers)).toBe('2001:db8::1')
  })
})

describe('stripMobileDesktopFromUserAgent', () => {
  it('should remove version numbers from Edg', () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    const result = stripMobileDesktopFromUserAgent(ua)
    expect(result).not.toContain('Edg/120.0.0.0')
    expect(result).toContain('Edg')
  })

  it('should remove version numbers from Edg iOS', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 EdgiOS/120.0.0.0 Mobile/15E148 Safari/604.1'
    const result = stripMobileDesktopFromUserAgent(ua)
    expect(result).not.toContain('EdgiOS/120.0.0.0')
    expect(result).toContain('Edg')
  })

  it('should remove Mobile suffix and version', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    const result = stripMobileDesktopFromUserAgent(ua)
    expect(result).not.toContain('Mobile Safari')
    expect(result).not.toContain('Mobile/15E148')
  })

  it('should remove OPR version numbers', () => {
    const ua = 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 OPR/80.0.0.0'
    const result = stripMobileDesktopFromUserAgent(ua)
    expect(result).not.toContain('OPR/80.0.0.0')
    expect(result).toContain('OPR')
  })

  it('should handle undefined input', () => {
    const result = stripMobileDesktopFromUserAgent(undefined)
    expect(result).toBe('')
  })

  it('should handle empty string', () => {
    const result = stripMobileDesktopFromUserAgent('')
    expect(result).toBe('')
  })

  it('should strip OS info from user agent', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
    const result = stripMobileDesktopFromUserAgent(ua)
    expect(result).toBe('Mozilla/5.0')
  })

  it('should strip parenthetical info from UserAgent strings', () => {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    const result = stripMobileDesktopFromUserAgent(ua)
    expect(result).toContain('Mozilla/5.0')
    expect(result).not.toContain('Windows NT 10.0')
    expect(result).not.toContain('iPhone')
  })
})

describe('calcStateHmac', () => {
  it('should generate a 10-character hex string', () => {
    const headers = {
      'cf-connecting-ip': '192.168.1.1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'x-forwarded-proto': 'https',
      'x-forwarded-for': '192.168.1.1'
    }
    const secretKeyObject = createSecretKey(Buffer.from('test-secret-key-32bytes-long!!'))
    const result = calcStateHmac(headers, secretKeyObject)
    expect(result.length).toBe(10)
    expect(result).toMatch(/^[0-9a-f]+$/)
  })

  it('should produce consistent HMAC for same inputs', () => {
    const headers = {
      'cf-connecting-ip': '192.168.1.1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'x-forwarded-proto': 'https',
      'x-forwarded-for': '192.168.1.1'
    }
    const secretKeyObject = createSecretKey(Buffer.from('test-secret-key-32bytes-long!!'))
    const result1 = calcStateHmac(headers, secretKeyObject)
    const result2 = calcStateHmac(headers, secretKeyObject)
    expect(result1).toBe(result2)
  })

  it('should produce different HMAC for different IPs', () => {
    const secretKeyObject = createSecretKey(Buffer.from('test-secret-key-32bytes-long!!'))
    const headers1 = {
      'cf-connecting-ip': '192.168.1.1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'x-forwarded-proto': 'https',
      'x-forwarded-for': '192.168.1.1'
    }
    const headers2 = {
      'cf-connecting-ip': '192.168.1.2',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'x-forwarded-proto': 'https',
      'x-forwarded-for': '192.168.1.2'
    }
    const result1 = calcStateHmac(headers1, secretKeyObject)
    const result2 = calcStateHmac(headers2, secretKeyObject)
    expect(result1).not.toBe(result2)
  })

  it('should handle missing headers gracefully', () => {
    const headers = {}
    const secretKeyObject = createSecretKey(Buffer.from('test-secret-key-32bytes-long!!'))
    const result = calcStateHmac(headers, secretKeyObject)
    expect(result.length).toBe(10)
    expect(result).toMatch(/^[0-9a-f]+$/)
  })
})

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
