import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
