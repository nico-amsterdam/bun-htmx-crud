import { Html } from '@elysiajs/html'
import type { LocaleType } from 'i18n/translations'

export function LanguageSwitcher({ linkTo, locale }: { linkTo: string, locale: LocaleType }): JSX.Element {
    const _ = locale.t
    const onChangeScript = `on change
                if my value is 'es' go to url ${linkTo}?lang=es
                else if my value is 'fr' go to url ${linkTo}?lang=fr
                else if my value is 'de' go to url ${linkTo}?lang=de
                otherwise go to url ${linkTo}`

    return (
        <select id="choose-lang" name="language"
            class="form-control language-switcher"
            aria-label={_('Choose site language')}
            data-script={onChangeScript}>
            <option value="en" lang="en" selected={locale.lang === 'en'}>English</option>
            <option value="es" lang="es" selected={locale.lang === 'es'}>Español</option>
            <option value="fr" lang="fr" selected={locale.lang === 'fr'}>Français</option>
            <option value="de" lang="de" selected={locale.lang === 'de'}>Deutsch</option>
        </select>)
}
