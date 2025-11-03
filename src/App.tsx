import { useNavigate, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage/LoginPage';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotFoundPage } from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboardWrapper /></ProtectedRoute>} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function LoginPageWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Redirect to admin if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }
  
  const handleLoginSuccess = () => {
    const from = (location.state as any)?.from?.pathname || '/admin';
    navigate(from);
  };

  return <LoginPage onLoginSuccess={handleLoginSuccess} />;
}

function AdminDashboardWrapper() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <AdminDashboard onLogout={handleLogout} />;
}

export default App;