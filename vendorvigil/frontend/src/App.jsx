import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ThemeToggle from './components/ui/ThemeToggle';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import VendorDetails from './pages/VendorDetails';
import LandingPage from './pages/LandingPage';

// Wrapper so we can use useLocation inside Router
const AppContent = () => {
  const location = useLocation();
  // The landing page has its own inline toggle in the nav
  const showFloatingToggle = location.pathname !== '/';

  return (
    <>
      <Toaster position="top-right" />
      {showFloatingToggle && <ThemeToggle />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/vendor/:id" element={<VendorDetails />} />
        </Route>
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
