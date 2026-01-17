// Simple translation function for server-side JSX
type Translations = Record<string, Record<string, string>>

type translateFnType = (key: string, ...args: any[]) => string

export type LocaleType = {
  lang: string
  langQueryParam: string
  t: translateFnType
}

export function translate(lang: string, key: string, args: string[]): string {
  let translation = translations[lang]?.[key] || translations['en'][key] || key;

  // placeholder replacement
  for (let i = 0; i < args.length; i++) {
    translation = translation.replace(new RegExp("\\{" + i + "\\}", 'g'), args[i]);
  }

  return translation;
}

export function newLocale(lang: string): LocaleType {
  const t = function (key: string, ...args: string[]) {
    return translate(lang, key, args)
  }
  const langQueryParam = lang === 'en' ? '' : '?lang=' + lang
  return { lang, t, langQueryParam }
}

const translations: Translations = {
  en: {
    'Welcome to the Bun HTMX CRUD Demo': 'Welcome to the Bun HTMX CRUD Demo',
    'Sign in to continue': 'Sign in to continue',
    'Continue with GitHub': 'Continue with GitHub',
    'Continue with Google': 'Continue with Google',
    'Session expired': 'Session expired',
    'Please login again.': 'Please login again.',
    'Login': 'Login',
    'Bun JSX HTMX CRUD': 'Bun JSX HTMX CRUD',
    'Sign out': 'Sign out',
    'Add product': 'Add product',
    'Search product': 'Search product',
    'Results will update as you type': 'Results will update as you type',
    'Name': 'Name',
    'Description': 'Description',
    'Price': 'Price',
    'Actions': 'Actions',
    'Edit': 'Edit',
    'Save': 'Save',
    'Delete': 'Delete',
    'No products available': 'No products available',
    'No search results found': 'No search results found',
    'Name is required': 'Name is required',
    'Name is too long': 'Name is too long',
    'Description is too long': 'Description is too long',
    'Price is invalid': 'Price is invalid',
    'Missing or incorrect id': 'Missing or incorrect id',
    'Cancel': 'Cancel',
    'Add new product': 'Add new product',
    'Create': 'Create',
    'Could not create \'{0}\'': 'Could not create \'{0}\'',
    '\'{0}\' is changed or removed by another user. Reopen it from the list.': '\'{0}\' is changed or removed by another user. Reopen it from the list.',
    'Product \'{0}\' already exists': 'Product \'{0}\' already exists',
    'Delete product \'{0}\'': 'Delete product \'{0}\'',
    'The action cannot be undone.': 'The action cannot be undone.',
    'Price €': 'Price €',
    'Avatar': 'Avatar',
    'Edit product': 'Edit product',
    'Choose site language': 'Choose site language'
  },
  es: {
    'Welcome to the Bun HTMX CRUD Demo': 'Bienvenido a la Demo Bun HTMX CRUD',
    'Sign in to continue': 'Inicia sesión para continuar',
    'Continue with GitHub': 'Continuar con GitHub',
    'Continue with Google': 'Continuar con Google',
    'Session expired': 'Sesión expirada',
    'Please login again.': 'Por favor inicia sesión nuevamente.',
    'Login': 'Iniciar sesión',
    'Bun JSX HTMX CRUD': 'Bun JSX HTMX CRUD',
    'Sign out': 'Cerrar sesión',
    'Add product': 'Agregar producto',
    'Search product': 'Buscar producto',
    'Results will update as you type': 'Los resultados se actualizarán mientras escribes',
    'Name': 'Nombre',
    'Description': 'Descripción',
    'Price': 'Precio',
    'Actions': 'Acciones',
    'Edit': 'Editar',
    'Save': 'Guardar',
    'Delete': 'Eliminar',
    'No products available': 'No hay productos disponibles',
    'No search results found': 'No se encontraron resultados de búsqueda',
    'Name is required': 'El nombre es requerido',
    'Name is too long': 'El nombre es demasiado largo',
    'Description is too long': 'La descripción es demasiado larga',
    'Price is invalid': 'El precio es inválido',
    'Missing or incorrect id': 'ID faltante o incorrecto',
    'Cancel': 'Cancelar',
    'Add new product': 'Agregar nuevo producto',
    'Create': 'Crear',
    'Could not create \'{0}\'': 'No se pudo crear \'{0}\'',
    '\'{0}\' is changed or removed by another user. Reopen it from the list.': '\'{0}\' ha sido cambiado o eliminado por otro usuario. Ábrelo de nuevo desde la lista.',
    'Product \'{0}\' already exists': 'El producto \'{0}\' ya existe',
    'Delete product \'{0}\'': 'Eliminar producto \'{0}\'',
    'The action cannot be undone.': 'Esta acción no se puede deshacer.',
    'Price €': 'Precio €',
    'Avatar': 'Avatar',
    'Edit product': 'Editar producto',
    'Choose site language': 'Elegir el idioma del sitio'
  },
  fr: {
    'Welcome to the Bun HTMX CRUD Demo': 'Bienvenue à la Démo Bun HTMX CRUD',
    'Sign in to continue': 'Connectez-vous pour continuer',
    'Continue with GitHub': 'Continuer avec GitHub',
    'Continue with Google': 'Continuer avec Google',
    'Session expired': 'Session expirée',
    'Please login again.': 'Veuillez vous reconnecter.',
    'Login': 'Se connecter',
    'Bun JSX HTMX CRUD': 'Bun JSX HTMX CRUD',
    'Sign out': 'Se déconnecter',
    'Add product': 'Ajouter un produit',
    'Search product': 'Rechercher un produit',
    'Results will update as you type': 'Les résultats se mettront à jour au fur et à mesure de votre saisie',
    'Name': 'Nom',
    'Description': 'Description',
    'Price': 'Prix',
    'Actions': 'Actions',
    'Edit': 'Modifier',
    'Save': 'Enregistrer',
    'Delete': 'Supprimer',
    'No products available': 'Aucun produit disponible',
    'No search results found': 'Aucun résultat de recherche trouvé',
    'Name is required': 'Le nom est requis',
    'Name is too long': 'Le nom est trop long',
    'Description is too long': 'La description est trop longue',
    'Price is invalid': 'Le prix est invalide',
    'Missing or incorrect id': 'ID manquant ou incorrect',
    'Cancel': 'Annuler',
    'Add new product': 'Ajouter un nouveau produit',
    'Create': 'Créer',
    'Could not create \'{0}\'': 'Impossible de créer \'{0}\'',
    '\'{0}\' is changed or removed by another user. Reopen it from the list.': '\'{0}\' a été modifié ou supprimé par un autre utilisateur. Rouvrez‑le depuis la liste.',
    'Product \'{0}\' already exists': 'Le produit \'{0}\' existe déjà',
    'Delete product \'{0}\'': 'Supprimer le produit \'{0}\'',
    'The action cannot be undone.': 'Cette action ne peut pas être annulée.',
    'Price €': 'Prix €',
    'Avatar': 'Avatar',
    'Edit product': 'Modifier le produit',
    'Choose site language': 'Choisir la langue du site'
  },
  de: {
    'Welcome to the Bun HTMX CRUD Demo': 'Willkommen zur Bun HTMX CRUD Demo',
    'Sign in to continue': 'Anmelden um fortzufahren',
    'Continue with GitHub': 'Mit GitHub fortfahren',
    'Continue with Google': 'Mit Google fortfahren',
    'Session expired': 'Sitzung abgelaufen',
    'Please login again.': 'Bitte melden Sie sich erneut an.',
    'Login': 'Anmelden',
    'Bun JSX HTMX CRUD': 'Bun JSX HTMX CRUD',
    'Sign out': 'Abmelden',
    'Add product': 'Produkt hinzufügen',
    'Search product': 'Produkt suchen',
    'Results will update as you type': 'Ergebnisse werden beim Tippen aktualisiert',
    'Name': 'Name',
    'Description': 'Beschreibung',
    'Price': 'Preis',
    'Actions': 'Aktionen',
    'Edit': 'Bearbeiten',
    'Save': 'Speichern',
    'Delete': 'Löschen',
    'No products available': 'Keine Produkte verfügbar',
    'No search results found': 'Keine Suchergebnisse gefunden',
    'Name is required': 'Name ist erforderlich',
    'Name is too long': 'Name ist zu lang',
    'Description is too long': 'Beschreibung ist zu lang',
    'Price is invalid': 'Preis ist ungültig',
    'Missing or incorrect id': 'Fehlende oder falsche ID',
    'Cancel': 'Abbrechen',
    'Add new product': 'Neues Produkt hinzufügen',
    'Create': 'Erstellen',
    'Could not create \'{0}\'': 'Konnte \'{0}\' nicht erstellen',
    '\'{0}\' is changed or removed by another user. Reopen it from the list.': '\'{0}\' wurde von einem anderen Benutzer geändert oder entfernt. Öffne es erneut aus der Liste.',
    'Product \'{0}\' already exists': 'Produkt \'{0}\' existiert bereits',
    'Delete product \'{0}\'': 'Produkt \'{0}\' löschen',
    'The action cannot be undone.': 'Diese Aktion kann nicht rückgängig gemacht werden.',
    'Price €': 'Preis €',
    'Avatar': 'Avatar',
    'Edit product': 'Produkt bearbeiten',
    'Choose site language': 'Sprache der Website auswählen'
  }
}
