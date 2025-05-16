import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
    en: {
        translation: {
            'Account': 'Account',
            'Home': 'Home',
            'Diagnose': 'Diagnose',
            'My Plants': 'My Plants',
            'Logout': 'Logout',
            'Are you sure you want to logout?': 'Are you sure you want to logout?',
            'Cancel': 'Cancel',
            'Loading profile...': 'Loading profile...',
            'User': 'User',
            'Notifications': 'Notifications',
            'Account & Security': 'Account & Security',
            'Billing & Subscriptions': 'Billing & Subscriptions',
            'Payment Methods': 'Payment Methods',
            'Linked Accounts': 'Linked Accounts',
            'App Appearance': 'App Appearance',
            'Data & Analytics': 'Data & Analytics',
            'Help & Support': 'Help & Support',
            'Try Again': 'Try Again',
            'Upgrade Plan to Unlock More!': 'Upgrade Plan to Unlock More!',
            'Enjoy all the benefits and explore more possibilities': 'Enjoy all the benefits and explore more possibilities',
            'Failed to load account information. Please try again.': 'Failed to load account information. Please try again.',
            'Internet connection is not available': 'Internet connection is not available',
            'Error logging out.': 'Error logging out.',
            'No hay acceso a la cámara o galería': 'No access to camera or gallery',
            'Solicitando permisos...': 'Requesting permissions...'
        }
    },
    es: {
        translation: {
            'Account': 'Cuenta',
            'Home': 'Inicio',
            'Diagnose': 'Diagnóstico',
            'My Plants': 'Mis Plantas',
            'Logout': 'Cerrar sesión',
            'Are you sure you want to logout?': '¿Seguro que deseas cerrar sesión?',
            'Cancel': 'Cancelar',
            'Loading profile...': 'Cargando perfil...',
            'User': 'Usuario',
            'Notifications': 'Notificaciones',
            'Account & Security': 'Cuenta y Seguridad',
            'Billing & Subscriptions': 'Facturación y Suscripciones',
            'Payment Methods': 'Métodos de Pago',
            'Linked Accounts': 'Cuentas Vinculadas',
            'App Appearance': 'Apariencia de la App',
            'Data & Analytics': 'Datos y Analíticas',
            'Help & Support': 'Ayuda y Soporte',
            'Try Again': 'Intentar de nuevo',
            'Upgrade Plan to Unlock More!': '¡Mejora tu plan para desbloquear más!',
            'Enjoy all the benefits and explore more possibilities': 'Disfruta de todos los beneficios y explora más posibilidades',
            'Failed to load account information. Please try again.': 'No se pudo cargar la información de la cuenta. Intenta de nuevo.',
            'Internet connection is not available': 'No hay conexión a internet',
            'Error logging out.': 'Error al cerrar sesión.',
            'No hay acceso a la cámara o galería': 'No hay acceso a la cámara o galería',
            'Solicitando permisos...': 'Solicitando permisos...'
        }
    }
};

const locales = Localization.getLocales();
const languageTag = locales && locales.length > 0 ? locales[0].languageTag : 'es';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: languageTag.split('-')[0], // Use only the language code (e.g., 'en', 'es')
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
export interface ChangeLanguageFunction {
    (lang: string): void;
}

export const changeLanguage: ChangeLanguageFunction = (lang: string): void => {
    i18n.changeLanguage(lang);
}