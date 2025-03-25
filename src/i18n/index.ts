import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { I18n } from 'aws-amplify/utils';
import { translations } from '@aws-amplify/ui-react';
import enTranslations from './translations/en.json';
import zhTranslations from './translations/zh.json';

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Set up i18next
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      zh: {
        translation: zhTranslations
      }
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

// Configure Amplify I18n with default translations
I18n.putVocabularies(translations);

// Function to get all translations at once with current language
const getCurrentTranslations = () => {
  return {
    email: i18n.t('login.email'),
    password: i18n.t('login.password'),
    enterEmail: i18n.t('login.enterEmail'),
    enterPassword: i18n.t('login.enterPassword'),
    confirmPassword: i18n.t('login.confirmPassword'),
    signIn: i18n.t('login.signIn'),
    signUp: i18n.t('login.signUp'),
    signInButton: i18n.t('login.signInButton'),
    forgotPassword: i18n.t('login.forgotPassword'),
    signInWithGoogle: i18n.t('login.signInWithGoogle')
  };
};

// Get form fields configuration with current translations
export const getFormFields = () => {
  const translations = getCurrentTranslations();
  
  return {
    signIn: {
      username: {
        placeholder: translations.enterEmail,
        label: translations.email,
        isRequired: true,
      },
      password: {
        placeholder: translations.enterPassword,
        label: translations.password,
        isRequired: true,
      },
    },
    signUp: {
      email: {
        placeholder: translations.enterEmail,
        label: translations.email,
        isRequired: true,
      },
      password: {
        placeholder: translations.enterPassword,
        label: translations.password,
        isRequired: true,
      },
      confirm_password: {
        placeholder: translations.confirmPassword,
        label: translations.confirmPassword,
        isRequired: true,
      },
    },
  };
};

export default i18n; 