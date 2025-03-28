import axios from 'axios';
import Login from './pages/Login';
import Agent from './pages/Agent';
import RecordingReplay from './pages/RecordingReplay';
import Header from './components/Header';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Endpoint } from './lib/api/endpoints';
import { Authenticator } from '@aws-amplify/ui-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { getAnonymousToken, getIdToken, LocalStorageKey, setLocalStorage } from './lib/utils/local-storage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import './i18n';

function AppContent() {
  // Axios interceptors
  axios.interceptors.request.use(
    (config) => {
      if (config.url?.includes(Endpoint.login)) {
        return config;
      }

      const token = getIdToken();
      config.headers['Authorization'] = 'Bearer ' + token || getAnonymousToken();

      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Token refresh logic
  const refresh = async () => {
    try {
      const response = await axios.get(Endpoint.refresh);
      if (response.data?.token) {
        setLocalStorage(LocalStorageKey.Token, response.data.token);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  // Initial token refresh
  useEffect(() => {
    if (getIdToken()) {
      refresh();
    }
  }, []);

  // Periodic token refresh
  useEffect(() => {
    const delay = setInterval(() => {
      if (getIdToken()) {
        refresh();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(delay);
  }, []);

  // Storage event listener for cross-tab authentication
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LocalStorageKey.LoggedIn) {
        // Log user out in other windows
        if (event.newValue === 'false') {
          location.replace(location.origin);
        }
        // Log user in other windows
        if ((!event.oldValue || event.oldValue === 'false') && event.newValue === 'true') {
          location.reload();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/history/:conversationId" element={<RecordingReplay />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
        <Authenticator.Provider>
          <Router>
            <AppContent />
          </Router>
        </Authenticator.Provider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
