import { describe, it, expect } from 'bun:test'
import { translate, newLocale } from '../../src/i18n/translations'

describe('translate', () => {
  describe('basic translations', () => {
    it('should translate to English', () => {
      expect(translate('en', 'Login', [])).toBe('Login')
      expect(translate('en', 'Sign out', [])).toBe('Sign out')
      expect(translate('en', 'Name', [])).toBe('Name')
    })

    it('should translate to Spanish', () => {
      expect(translate('es', 'Login', [])).toBe('Iniciar sesión')
      expect(translate('es', 'Sign out', [])).toBe('Cerrar sesión')
      expect(translate('es', 'Name', [])).toBe('Nombre')
    })

    it('should translate to French', () => {
      expect(translate('fr', 'Login', [])).toBe('Se connecter')
      expect(translate('fr', 'Sign out', [])).toBe('Se déconnecter')
      expect(translate('fr', 'Name', [])).toBe('Nom')
    })

    it('should translate to German', () => {
      expect(translate('de', 'Login', [])).toBe('Anmelden')
      expect(translate('de', 'Sign out', [])).toBe('Abmelden')
      expect(translate('de', 'Name', [])).toBe('Name')
    })
  })

  describe('placeholder replacement', () => {
    it('should replace single placeholder {0}', () => {
      expect(translate('en', "Could not create '{0}'", ['Widget'])).toBe("Could not create 'Widget'")
      expect(translate('es', "Could not create '{0}'", ['Widget'])).toBe("No se pudo crear 'Widget'")
      expect(translate('fr', "Could not create '{0}'", ['Widget'])).toBe("Impossible de créer 'Widget'")
      expect(translate('de', "Could not create '{0}'", ['Widget'])).toBe("Konnte 'Widget' nicht erstellen")
    })

    it('should replace multiple placeholders {0}, {1}', () => {
      const result = translate('en', "Product '{0}' already exists", ['Test Product'])
      expect(result).toBe("Product 'Test Product' already exists")
    })

    it('should replace same placeholder multiple times', () => {
      const result = translate('en', "'{0}' is changed or removed by another user. Reopen it from the list.", ['Widget'])
      expect(result).toBe("'Widget' is changed or removed by another user. Reopen it from the list.")
    })

    it('should handle empty args array', () => {
      const result = translate('en', 'Login', [])
      expect(result).toBe('Login')
    })

    it('should handle no args passed', () => {
      const result = translate('en', 'Login', [])
      expect(result).toBe('Login')
    })
  })

  describe('fallback behavior', () => {
    it('should fallback to English when translation key exists in English but not in target language', () => {
      expect(translate('es', 'NonExistentKey', [])).toBe('NonExistentKey')
    })

    it('should fallback to key when translation does not exist in any language', () => {
      expect(translate('en', 'TotallyFakeKey12345', [])).toBe('TotallyFakeKey12345')
      expect(translate('es', 'TotallyFakeKey12345', [])).toBe('TotallyFakeKey12345')
    })

    it('should handle unknown language by falling back to English', () => {
      expect(translate('zh', 'Login', [])).toBe('Login')
    })

    it('should handle empty string language by falling back to English', () => {
      expect(translate('', 'Login', [])).toBe('Login')
    })
  })
})

describe('newLocale', () => {
  describe('return structure', () => {
    it('should return object with lang, t, and langQueryParam properties', () => {
      const locale = newLocale('en')
      expect(locale).toHaveProperty('lang', 'en')
      expect(locale).toHaveProperty('langQueryParam')
      expect(typeof locale.t).toBe('function')
    })

    it('should return a working translation function', () => {
      const locale = newLocale('es')
      expect(locale.t('Login')).toBe('Iniciar sesión')
      expect(locale.t('Name')).toBe('Nombre')
    })
  })

  describe('langQueryParam', () => {
    it('should return empty string for English', () => {
      expect(newLocale('en').langQueryParam).toBe('')
    })

    it('should return ?lang=es for Spanish', () => {
      expect(newLocale('es').langQueryParam).toBe('?lang=es')
    })

    it('should return ?lang=fr for French', () => {
      expect(newLocale('fr').langQueryParam).toBe('?lang=fr')
    })

    it('should return ?lang=de for German', () => {
      expect(newLocale('de').langQueryParam).toBe('?lang=de')
    })

    it('should return ?lang=unknown for unknown language', () => {
      expect(newLocale('zh').langQueryParam).toBe('?lang=zh')
    })
  })

  describe('locale translation function with placeholders', () => {
    it('should work with placeholder replacement', () => {
      const locale = newLocale('en')
      expect(locale.t("Could not create '{0}'", 'Test')).toBe("Could not create 'Test'")
    })

    it('should pass multiple arguments for multiple placeholders', () => {
      const locale = newLocale('en')
      expect(locale.t("Could not create '{0}'", 'Test')).toBe("Could not create 'Test'")
    })

    it('should handle multiple arguments correctly', () => {
      const locale = newLocale('en')
      expect(locale.t('Test {0} {1}', 'arg1', 'arg2')).toBe('Test arg1 arg2')
    })
  })
})
