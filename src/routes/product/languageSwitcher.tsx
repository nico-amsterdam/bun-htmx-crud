import { Html } from '@elysiajs/html'
import type { PageType } from './productForm'

export function LanguageSwitcher({ linkTo, page }: { linkTo: string, page: PageType }): JSX.Element {
    const _ = page.locale.t
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
            <option value="en" lang="en" selected={page.locale.lang === 'en'}>English</option>
            <option value="es" lang="es" selected={page.locale.lang === 'es'}>Español</option>
            <option value="fr" lang="fr" selected={page.locale.lang === 'fr'}>Français</option>
            <option value="de" lang="de" selected={page.locale.lang === 'de'}>Deutsch</option>
        </select>)
}
