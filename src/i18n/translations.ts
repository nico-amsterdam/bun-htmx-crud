import { STANDARD_LANGUAGE } from 'i18n/lang'

/*
 * Types
 */

type Translations = Record<string, Record<string, string>>

type translateFnType = (key: string, ...args: any[]) => string

export type LocaleType = {
  lang: string
  langQueryParam: string
  t: translateFnType
}

/*
 * Functions
 */

export function translate(lang: string, key: string, args: string[]): string {
  let translation = translations[lang]?.[key] || translations[STANDARD_LANGUAGE][key] || key;

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
  const langQueryParam = lang === STANDARD_LANGUAGE ? '' : '?lang=' + lang
  return { lang, t, langQueryParam }
}

/*
 * Variables
 */

const translations: Translations = {
  // Technically the English to English translation is not needed,
  // but it serves as the primary set for translations in other languages.
  en: {
    'Welcome to the HTMX CRUD Demo': 'Welcome to the HTMX CRUD Demo',
    'Sign in to continue': 'Sign in to continue',
    'Continue with GitHub': 'Continue with GitHub',
    'Continue with Google': 'Continue with Google',
    'Session expired': 'Session expired',
    'Please login again.': 'Please login again.',
    'Login': 'Login',
    'HTMX CRUD Demo': 'HTMX CRUD Demo',
    'Sign out': 'Sign out',
    'Add product': 'Add product',
    'Filter products': 'Filter products',
    'Filter by product name\'s starting letters': 'Filter by product name\'s starting letters',
    'Results will update as you type': 'Results will update as you type',
    'Name': 'Name',
    'Description': 'Description',
    'Price': 'Price',
    'Actions': 'Actions',
    'Edit': 'Edit',
    'Save': 'Save',
    'Delete': 'Delete',
    'Refresh': 'Refresh',
    'No products available': 'No products available',
    'No matching products found': 'No matching products found',
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
    'Choose site language': 'Choose site language',
    'Network error': 'Network error',
    'Offline? Check your connection': 'Offline? Check your connection',
    'Dark mode switch': 'Dark mode switch',
    'Skip to main content': 'Skip to main content'
  },
  es: {
    'Welcome to the HTMX CRUD Demo': 'Bienvenido a la Demo HTMX CRUD',
    'Sign in to continue': 'Inicia sesión para continuar',
    'Continue with GitHub': 'Continuar con GitHub',
    'Continue with Google': 'Continuar con Google',
    'Session expired': 'Sesión expirada',
    'Please login again.': 'Por favor inicia sesión nuevamente.',
    'Login': 'Iniciar sesión',
    'HTMX CRUD Demo': 'HTMX CRUD Demo',
    'Sign out': 'Cerrar sesión',
    'Add product': 'Agregar producto',
    'Filter products': 'Filtrar productos',
    'Filter by product name\'s starting letters': 'Filtrar por las letras iniciales del nombre del producto',
    'Results will update as you type': 'Los resultados se actualizarán mientras escribes',
    'Name': 'Nombre',
    'Description': 'Descripción',
    'Price': 'Precio',
    'Actions': 'Acciones',
    'Edit': 'Editar',
    'Save': 'Guardar',
    'Delete': 'Eliminar',
    'Refresh': 'Actualizar',
    'No products available': 'No hay productos disponibles',
    'No matching products found': 'No se encontraron productos coincidentes',
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
    'Choose site language': 'Elegir el idioma del sitio',
    'Network error': 'Error de red',
    'Offline? Check your connection': '¿Sin conexión? Revisa tu conexión',
    'Dark mode switch': 'Interruptor de modo oscuro',
    'Skip to main content': 'Saltar al contenido principal'
  },
  fr: {
    'Welcome to the HTMX CRUD Demo': 'Bienvenue à la Démo HTMX CRUD',
    'Sign in to continue': 'Connectez-vous pour continuer',
    'Continue with GitHub': 'Continuer avec GitHub',
    'Continue with Google': 'Continuer avec Google',
    'Session expired': 'Session expirée',
    'Please login again.': 'Veuillez vous reconnecter.',
    'Login': 'Se connecter',
    'HTMX CRUD Demo': 'Démo HTMX CRUD',
    'Sign out': 'Se déconnecter',
    'Add product': 'Ajouter un produit',
    'Filter products': 'Filtrer les produits',
    'Filter by product name\'s starting letters': 'Filtrer par les premières lettres du nom du produit',
    'Results will update as you type': 'Les résultats se mettront à jour au fur et à mesure de votre saisie',
    'Name': 'Nom',
    'Description': 'Description',
    'Price': 'Prix',
    'Actions': 'Actions',
    'Edit': 'Modifier',
    'Save': 'Enregistrer',
    'Delete': 'Supprimer',
    'Refresh': 'Actualiser',
    'No products available': 'Aucun produit disponible',
    'No matching products found': 'Aucun produit correspondant trouvé',
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
    'Choose site language': 'Choisir la langue du site',
    'Network error': 'Erreur réseau',
    'Offline? Check your connection': 'Hors ligne? Vérifiez votre connexion',
    'Dark mode switch': 'Commutateur de mode sombre',
    'Skip to main content': 'Passer au contenu principal'
  },
  de: {
    'Welcome to the HTMX CRUD Demo': 'Willkommen zur HTMX CRUD Demo',
    'Sign in to continue': 'Anmelden um fortzufahren',
    'Continue with GitHub': 'Mit GitHub fortfahren',
    'Continue with Google': 'Mit Google fortfahren',
    'Session expired': 'Sitzung abgelaufen',
    'Please login again.': 'Bitte melden Sie sich erneut an.',
    'Login': 'Anmelden',
    'HTMX CRUD Demo': 'HTMX CRUD Demo',
    'Sign out': 'Abmelden',
    'Add product': 'Produkt hinzufügen',
    'Filter products': 'Produkte filtern',
    'Filter by product name\'s starting letters': 'Nach den Anfangsbuchstaben des Produktnamens filtern',
    'Results will update as you type': 'Ergebnisse werden beim Tippen aktualisiert',
    'Name': 'Name',
    'Description': 'Beschreibung',
    'Price': 'Preis',
    'Actions': 'Aktionen',
    'Edit': 'Bearbeiten',
    'Save': 'Speichern',
    'Delete': 'Löschen',
    'Refresh': 'Aktualisieren',
    'No products available': 'Keine Produkte verfügbar',
    'No matching products found': 'Keine passenden Produkte gefunden',
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
    'Choose site language': 'Sprache der Website auswählen',
    'Network error': 'Netzwerkfehler',
    'Offline? Check your connection': 'Offline? Prüfen Sie Ihre Verbindung',
    'Dark mode switch': 'Schalter für den Dunkelmodus',
    'Skip to main content': 'Zum Hauptinhalt springen'
  }
}
