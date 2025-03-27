import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePostHog } from 'posthog-js/react';
import { Rocket, BrainCircuit } from 'lucide-react';
import { ThemeProvider, CheckboxField, useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";

import { getFormFields } from '@/i18n';
import { customTheme } from '@/config/amplify';
import { Endpoint } from '@/lib/api/endpoints';
import { LocalStorageKey, setLocalStorage } from '@/lib/utils/local-storage';
import keys from '@/i18n/keys';

import '@aws-amplify/ui-react/styles.css';
import '@/config/amplify';

// Custom CSS to override Amplify UI styles
import './Login.css';

const authenticateResource = async (idToken: string) => {
  try {
    const response = await axios.post(
      Endpoint.login,
      {},
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  } catch (err: any) {
    console.log(err);
    return Promise.reject(err.response?.data || err);
  }
};

interface AuthSignInDetails {
  tokens?: {
    idToken: string;
  };
  loginId?: string;
}

interface AuthUser {
  userId: string;
  username?: string;
  signInDetails?: AuthSignInDetails;
}

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]) as { user: AuthUser };
  const posthog = usePostHog();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formFields, setFormFields] = useState(getFormFields());

  // Update form fields and Amplify translations when language changes
  useEffect(() => {
    setFormFields(getFormFields());
  }, [i18n.language]);

  // Handle successful authentication
  const handleAuthSuccess = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user info from the authenticated user
      const userInfo = user.signInDetails?.loginId 
        ? { email: user.signInDetails.loginId } 
        : { email: user.username || '' };
      
      const userName = userInfo.email.split('@')[0];
      
      // Store relevant user info in local storage
      setLocalStorage(LocalStorageKey.UserInfo, JSON.stringify({
        user_name: userName,
        user_email: userInfo.email
      }));
      
      // Get the current session to access tokens
      const { tokens } = await fetchAuthSession();
      
      if (tokens?.idToken) {
        try {
          const authResponse = await authenticateResource(tokens.idToken.toString());
          
          // Store the token
          setLocalStorage(LocalStorageKey.Token, authResponse.token);
          setLocalStorage(LocalStorageKey.UserID, authResponse.user_id);
          
          // Identify user in PostHog
          if (process.env.NODE_ENV === 'development') {
            posthog?.identify(`dev_${authResponse.user_id}`);
          } else {
            posthog?.identify(authResponse.user_id);
          }

          // Set logged in state
          setLocalStorage(LocalStorageKey.LoggedIn, 'true');
          
          // Navigate to the agent page
          setTimeout(() => {
            navigate('/agent');
          }, 1000);
        } catch (err) {
          console.error('Resource authentication error:', err);
          setError('Failed to authenticate with the resource server. Please try again.');
          setLoading(false);
        }
      } else {
        throw new Error('No ID token available');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Failed to authenticate. Please try again.');
      setLoading(false);
    }
  };

  // Call handleAuthSuccess when user changes
  useEffect(() => {
    if (user) {
      handleAuthSuccess();
    }
  }, [user]);

  return (
    <main>
      <section className="relative">
        <div className="relative py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="text-center sm:mx-auto sm:w-10/12 lg:mr-auto lg:mt-0 lg:w-4/5">
              <h1 className="mt-8 text-4xl font-semibold md:text-5xl xl:text-5xl xl:[line-height:1.125]">
                {t(keys.login.titleLine1)}
                <br />
                {t(keys.login.titleLine2)}
              </h1>
              <p className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block">
                {t(keys.login.subtitle)}
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden">
                {t(keys.login.mobileSubtitle)}
              </p>
            </div>
            
            <div className="relative mx-auto mt-8 max-w-xl sm:mt-12">
              {/* Colorful backdrop elements */}
              <div className="absolute inset-0 -top-8 left-1/2 h-56 w-full -translate-x-1/2 [background-image:linear-gradient(to_bottom,transparent_98%,theme(colors.gray.200/75%)_98%),linear-gradient(to_right,transparent_94%,_theme(colors.gray.200/75%)_94%)] [background-size:16px_35px] [mask:radial-gradient(black,transparent_95%)]"></div>
              <div className="absolute inset-x-0 top-2 mx-auto h-1/3 w-2/3 rounded-full bg-blue-300 blur-3xl"></div>
              
              {/* Login Form */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full relative"
              >
                <Card className="border shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-3 mb-6 pt-4">
                      <h2 className="text-2xl font-bold">
                        Energent.ai
                      </h2>
                    </div>
                    
                    {error && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    
                    <ThemeProvider theme={{
                      ...customTheme,
                      tokens: {
                        ...customTheme.tokens,
                        components: {
                          ...customTheme.tokens.components,
                          button: {
                            ...customTheme.tokens.components?.button,
                            primary: {
                              backgroundColor: 'black',
                              _hover: {
                                backgroundColor: '#333',
                              },
                            },
                          },
                        },
                      },
                    }}>
                      <Authenticator
                        initialState="signIn"
                        loginMechanisms={['email']}
                        signUpAttributes={['email']}
                        socialProviders={['google']}
                        formFields={formFields}
                        components={{
                          SignUp: {
                            FormFields() {
                              const { validationErrors } = useAuthenticator();
                              
                              return (
                                <>
                                  <Authenticator.SignUp.FormFields />
                                  
                                  <CheckboxField
                                    errorMessage={validationErrors.acknowledgement as string}
                                    hasError={!!validationErrors.acknowledgement}
                                    name="acknowledgement"
                                    value="yes"
                                    label={
                                      <span>
                                        {t(keys.login.termsAgreement)}{' '}
                                        <a href="https://epsilla.com/tos" target="_blank" className="text-primary hover:underline">
                                          {t(keys.login.termsAndConditions)}
                                        </a>
                                        {' '}{t(keys.login.andRead)}{' '}
                                        <a href="https://epsilla.com/privacy" target="_blank" className="text-primary hover:underline">
                                          {t(keys.login.privacyPolicy)}
                                        </a>
                                      </span>
                                    }
                                  />
                                </>
                              );
                            },
                          },
                        }}
                        services={{
                          async validateCustomSignUp(formData: Record<string, any>) {
                            if (!formData.acknowledgement) {
                              return {
                                acknowledgement: t(keys.login.termsError),
                              };
                            }
                            return undefined;
                          },
                        }}
                        hideSignUp
                      >
                        {({ user }) => (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="w-full">
                              <p>{user?.username}</p>
                              <p>Is signing in...</p>
                            </div>
                          </motion.div>
                        )}
                      </Authenticator>
                    </ThemeProvider>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                    </div>
                    <div className="mt-8 flex justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="text-primary h-5 w-5" />
                        <span className="text-sm text-muted-foreground">{t(keys.login.aiPowered)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Rocket className="text-primary h-5 w-5" />
                        <span className="text-sm text-muted-foreground">{t(keys.login.fastSecure)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {loading && (
                <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center">
                  <Card className="w-[300px]">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-4">
                        <Loading size="lg" />
                        <p className="text-center">{t(keys.login.signingIn)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 