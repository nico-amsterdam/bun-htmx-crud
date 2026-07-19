import { Html } from '@elysiajs/html'
import type { LocaleType } from 'i18n/translations'

export function LanguageSwitcher({ linkTo, locale }: { linkTo: string, locale: LocaleType }): JSX.Element {
    const _ = locale.t

    return (
        <select id="choose-lang" name="language"
            class="form-control language-switcher"
            aria-label={_('Choose site language')}
            hx-ext="language-switcher"
            data-base-url={linkTo}>
            <option value="en" lang="en" selected={locale.lang === 'en'}>English</option>
            <option value="es" lang="es" selected={locale.lang === 'es'}>Español</option>
            <option value="fr" lang="fr" selected={locale.lang === 'fr'}>Français</option>
            <option value="de" lang="de" selected={locale.lang === 'de'}>Deutsch</option>
        </select>)
}
