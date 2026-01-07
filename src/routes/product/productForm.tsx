import { Html } from '@elysiajs/html'
import { ProductType, BaseProductType } from "db"
import type { User } from '../auth'

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
  user: User | undefined
  data: DataType
  form: FormDataType
}

export function ProductFormFields(page: PageType): JSX.Element {
  return (
    <div>
      <input type="hidden" name="csrf" id="csrf" value={page.form.csrfToken} />
      {page.form.errors.general && (<div class="error">{page.form.errors.general}</div>)}
      <div class="form-group"><label for="edit-name">Name</label><input class="form-control" id="edit-name"
        name="name" required={true} maxlength="20" value={page.form.values.name} autofocus />
        {page.form.errors.name && (<div class="error">{page.form.errors.name}</div>)}
      </div>
      <div class="form-group"><label for="edit-description">Description</label><textarea class="form-control"
        id="edit-description" name="description" maxlength="300" rows="3">{page.form.values.description}</textarea>
        {page.form.errors.description && (<div class="error">{page.form.errors.description}</div>)}
      </div>
      <div class="form-group"><label for="edit-price">Price €</label><input type="number" class="form-control" id="edit-price" name="price" min="0" step="0.01" value={page.form.values.price} />
        {page.form.errors.price && (<div class="error">{page.form.errors.price}</div>)}
      </div>
    </div>
  )
}

export function CancelButton(): JSX.Element {
  return (
    <button type="button" hx-get="/product-list" hx-push-url="true" hx-target="#main" class="btn btn-default">Cancel</button>
  )
}

function newFormData(): FormDataType {
  return { values: {}, errors: {}, csrfToken: '' }
}

export function newPage(): PageType {
  const page: PageType = {
    user: undefined,
    data: { products: [] },
    form: newFormData()
  }
  return page
}

export function validateFormAndCreatePage(name: string, description: string, price: string): PageType {
  const page = newPage()
  page.form.values = {
      name: name
    , description: description
    , price: price
  }

  name = name.trim()
  description = description.trimEnd()
  let errors = page.form.errors
  if (name.length == 0) errors["name"] = "Name is required"
  if (name.length > 20) errors["name"] = "Name is too long"
  if (description.length > 300) errors["description"] = "Description is too long"
  if (!Number.isFinite(+price) || +price < 0) errors["price"] = "Price is invalid"
  return page
}

export function validateIdAndUpdatePage(page: PageType, id: string): PageType {
  page.form.values.id = id
  let errors = page.form.errors
  if (id === null || !Number.isFinite(+id)) {
    errors["general"] = "Missing or incorrect id"
  }
  return page
}


