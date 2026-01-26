import type { ProductType, BaseProductType } from "db"
import { newLocale } from 'i18n/translations'
import type { LocaleType } from 'i18n/translations'
import type { UserType } from 'routes/auth'

/*
 * Types
 */

type DataType = {
  products: ProductType[]
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
}

/*
 * Functions without JSX
 */

function newFormData(): FormDataType {
  return { values: {}, errors: {}, csrfToken: '' }
}

export function newPage(lang: string): PageType {
  const page: PageType = {
    user: undefined,
    data: { products: [] },
    form: newFormData(),
    locale: newLocale(lang)
  }
  return page
}
