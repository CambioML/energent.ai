import Login from './pages/Login';
import Agent from './pages/Agent';
import Header from './components/Header';
import { Authenticator } from '@aws-amplify/ui-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './i18n';

function App() {
  return (
    <GoogleOAuthProvider 
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}
    >
      <Authenticator.Provider>
        <Router>
          <div className="min-h-screen bg-background">
            <Header />
            <div>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/agent" element={<Agent />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Toaster />
          </div>
        </Router>
      </Authenticator.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
