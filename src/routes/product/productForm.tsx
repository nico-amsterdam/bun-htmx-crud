import { Html } from '@elysiajs/html'
import { ProductType } from "db"

export type DataType = {
  products: ProductType[]
}

export type FormDataType = {
  values: Record<string, string>
  errors: Record<string, string>
}

export type PageType = {
  data: DataType
  form: FormDataType
}

export function ProductFormFields(page: PageType): JSX.Element {
  return (
    <div>
      {page.form.errors.general && (<div class="error">{page.form.errors.general}</div>)}
      <div class="form-group"><label for="edit-name">Name</label><input class="form-control" id="edit-name"
        name="name" required={true} maxlength="20" value={page.form.values.name} autofocus />
        {page.form.errors.name && (<div class="error">{page.form.errors.name}</div>)}
      </div>

      <div class="form-group"><label for="edit-description">Description</label><textarea class="form-control"
        id="edit-description" name="description" maxlength="300" rows="3">{page.form.values.description}</textarea>
        {page.form.errors.description && (<div class="error">{page.form.errors.description}</div>)}
      </div>
      <div class="form-group"><label for="edit-price">Price €</label><input type="number" class="form-control" id="edit-price" name="price" min="0" value={page.form.values.price} />
        {page.form.errors.price && (<div class="error">{page.form.errors.price}</div>)}
      </div>
    </div>
  )
}

export function CancelButton(): JSX.Element {
  return (
    <button type="button" hx-get="/product-list" hx-push-url="true" hx-target="#main" hx-swap="outerHTML" class="btn btn-default">Cancel</button>
  )
}

function newFormData(): FormDataType {
  return { values: {}, errors: {} }
}

export function newPage(): PageType {
  // Page page
  const page: PageType = {
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
  if (Number.isNaN(price) || +price < 0) errors["price"] = "Price is invalid"
  return page
}

export function validateIdAndUpdatePage(page: PageType, id: string): PageType {
  page.form.values["id"] = id
  let errors = page.form.errors
  if (Number.isNaN(id) || +id !== +id) {
    errors["general"] = "Missing or incorrect id"
  }
  return page
}


