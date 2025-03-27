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
          redirectSignIn: [localEnv ? 'http://localhost:5173' : 'https://app.energent.ai'],
          redirectSignOut: [localEnv ? 'http://localhost:5173' : 'https://app.energent.ai'],
          responseType: 'token'
        },
        email: true,
      }
    },
  }
});

// Define light theme for Amplify UI components
export const lightTheme = {
  name: 'energent-light-theme',
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
      font: {
        interactive: {
          value: '#000000'
        }
      },
      background: {
        primary: {
          value: '#ffffff'
        },
        secondary: {
          value: '#f9fafb'
        }
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
      tabs: {
        item: {
          _active: {
            color: '{colors.brand.primary.100}',
            borderColor: '{colors.brand.primary.100}'
          },
          _hover: {
            color: '{colors.brand.primary.90}'
          },
          _focus: {
            color: '{colors.brand.primary.100}'
          }
        }
      },
      fieldcontrol: {
        _focus: {
          borderColor: '{colors.brand.primary.90}'
        }
      }
    },
  },
};

// Define dark theme for Amplify UI components
export const darkTheme = {
  name: 'energent-dark-theme',
  tokens: {
    colors: {
      brand: {
        primary: {
          10: '#1e293b',
          20: '#172554',
          40: '#1e40af',
          60: '#2563eb',
          80: '#3b82f6',
          90: '#60a5fa',
          100: '#93c5fd',
        },
      },
      font: {
        interactive: {
          value: '#ffffff'
        }
      },
      background: {
        primary: {
          value: '#111827'
        },
        secondary: {
          value: '#1f2937'
        }
      },
      border: {
        primary: {
          value: '#374151'
        }
      },
      neutral: {
        10: {
          value: '#111827'
        },
        20: {
          value: '#1f2937'
        },
        40: {
          value: '#374151'
        },
        80: {
          value: '#9ca3af'
        },
        90: {
          value: '#d1d5db'
        },
        100: {
          value: '#f3f4f6'
        }
      }
    },
    components: {
      button: {
        primary: {
          backgroundColor: '{colors.brand.primary.60}',
          color: '#ffffff',
          _hover: {
            backgroundColor: '{colors.brand.primary.40}',
          },
        },
      },
      tabs: {
        item: {
          _active: {
            color: '{colors.brand.primary.80}',
            borderColor: '{colors.brand.primary.80}'
          },
          _hover: {
            color: '{colors.brand.primary.60}'
          },
          _focus: {
            color: '{colors.brand.primary.80}'
          }
        }
      },
      fieldcontrol: {
        borderColor: '{colors.border.primary}',
        color: '#ffffff',
        _focus: {
          borderColor: '{colors.brand.primary.60}'
        }
      }
    },
  },
};

// For backward compatibility
export const customTheme = lightTheme;

// For backward compatibility
export const formFields = getFormFields(); 