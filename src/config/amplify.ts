import { Amplify } from 'aws-amplify';
import { getFormFields } from '../i18n';

// Check if we're in development mode
const localEnv = import.meta.env.DEV;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USERPOOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_APPCLIENT_ID,
      loginWith: {
        oauth: {
          domain: 'epsilla.auth.us-east-1.amazoncognito.com',
          scopes: ['email', 'profile', 'openid'],
          redirectSignIn: [localEnv ? 'http://localhost:5173' : 'https://cloud-test.epsilla.com'],
          redirectSignOut: [localEnv ? 'http://localhost:5173' : 'https://cloud-test.epsilla.com'],
          responseType: 'token'
        },
        email: true,
      }
    },
  }
});

// Define custom theme for Amplify UI components
export const customTheme = {
  name: 'energent-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#f0f9ff',
          20: '#e0f2fe',
          40: '#bae6fd',
          60: '#7dd3fc',
          80: '#38bdf8',
          90: '#0ea5e9',
          100: '#0284c7',
        },
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: '{colors.brand.primary.90}',
          _hover: {
            backgroundColor: '{colors.brand.primary.100}',
          },
        },
      },
    },
  },
};

// For backward compatibility
export const formFields = getFormFields(); 