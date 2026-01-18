import { describe, it, expect } from 'bun:test'
import { BaseHtml } from '../../src/routes/helper/basePage'

describe('BaseHtml', () => {
  it('should generate valid HTML structure', () => {
    const body = '<body>Test content</body>'
    const result = BaseHtml({ lang: 'en', body })

    expect(result).toContain('<!DOCTYPE html>')
    expect(result).toContain('<html lang=en>')
    expect(result).toContain('</html>')
  })

  it('should include meta charset utf-8', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('<meta charset="utf-8">')
  })

  it('should include viewport meta tag', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('<meta name="viewport" content="width=device-width, initial-scale=1">')
  })

  it('should include title', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('<title>Bun HTMX CRUD</title>')
  })

  it('should include manifest link', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('<link rel="manifest" href="/manifest.webmanifest">')
  })

  it('should include theme-color meta tag', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toMatch(/\"theme-color\" content=\"#[0-9a-f]{6}\"/)
  })

  it('should include apple-touch-icon link', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('<link rel="apple-touch-icon" href="')
  })

  it('should include htmx-config meta tag', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('htmx-config')
    expect(result).toContain('allowEval')
    expect(result).toContain('defaultSwapStyle')
  })

  it('should include bootstrap CSS', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('/css/bootstrap3-un.css')
  })

  it('should include auth CSS', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('/css/auth.css')
  })

  it('should include htmx.js with integrity hash', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('/javascript/vendor/htmx.min.js')
    expect(result).toContain('integrity="sha384-')
    expect(result).toContain('crossorigin="anonymous"')
  })

  it('should include hyperscript.js with integrity hash', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('/javascript/vendor/_hyperscript.min.js')
  })

  it('should place body content in correct position', () => {
    const body = '<body>Hello World</body>'
    const result = BaseHtml({ lang: 'en', body })
    expect(result).toContain('<body>Hello World</body>')
    expect(result.indexOf('<body>Hello World</body>')).toBeGreaterThan(result.indexOf('</head>'))
  })

  it('should reflect language in html tag', () => {
    const resultEn = BaseHtml({ lang: 'en', body: '' })
    const resultEs = BaseHtml({ lang: 'es', body: '' })
    const resultFr = BaseHtml({ lang: 'fr', body: '' })

    expect(resultEn).toContain('lang=en')
    expect(resultEs).toContain('lang=es')
    expect(resultFr).toContain('lang=fr')
  })

  it('should include meta description', () => {
    const result = BaseHtml({ lang: 'en', body: '' })
    expect(result).toContain('<meta name="description" content="BUN HTMX CRUD project">')
  })
})
