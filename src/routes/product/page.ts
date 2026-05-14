import type { ProductType, BaseProductType } from "db"
import { newLocale } from 'i18n/translations'
import type { LocaleType } from 'i18n/translations'
import type { UserType } from 'routes/auth'

/*
 * Types
 */

type DataType = {
  products: ProductType[]
  pageSize: number
}

type FormFieldsType = keyof BaseProductType

type FormDataType = {
  values: Partial<Record<FormFieldsType, string>>
  errors: Partial<Record<FormFieldsType | 'general', string>>
  csrfToken: string
}

export type PageType = {
  user: UserType | undefined
  data: DataType
  form: FormDataType
  locale: LocaleType
  preload: boolean
}

/*
 * Functions without JSX
 */

function newFormData(): FormDataType {
  return { values: {}, errors: {}, csrfToken: '' }
}

export function newPage(lang: string, preload?: string): PageType {
  const page: PageType = {
    user: undefined,
    data: { products: [], pageSize: 100 },
    form: newFormData(),
    locale: newLocale(lang),
    preload: preload !== 'off' // list loading and search strategy
  }
  return page
}

export function getPageHeaders(page: PageType): string {
  return page.preload ? '' : '{"preload": "off"}'
}

export function getLastProductName(page: PageType): string {
  if (page.data.products.length === 0) {
    return '';
  }
  return page.data.products[Math.min(page.data.products.length, page.data.pageSize) - 1].name
}

export function getQueryString(page: PageType, extraParams: Record<string, string>): string {
  const langQuery: Record<string, string> = page.locale.langQueryParam === '' ? {} : { lang: page.locale.lang };
  const allQueryParams = { ...langQuery, ...extraParams }

  // make query string
  const query = new URLSearchParams(allQueryParams);
  return query.size <= 0 ? '' : '?' + query.toString();
}
