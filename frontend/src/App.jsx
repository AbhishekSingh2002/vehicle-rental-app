import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  Outlet, 
  useLocation
} from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ToastContainer } from 'react-toastify';

// Import toastify styles
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import ModernLayout from './components/layout/ModernLayout';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Route Component - Redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    // Redirect to login with the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public Only Route - Redirects to home if already authenticated
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isAuthenticated()) {
    // Redirect to the home page or the previous location
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // IMPORTANT: Render nested routes via Outlet
  return <Outlet />;
};

// Layout Wrapper
const LayoutWrapper = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or a proper loading component
  }
  
  return (
    <ModernLayout>
      <Outlet />
    </ModernLayout>
  );
};

const history = createBrowserHistory({ window });

// Configure future flags for React Router v7
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

const App = () => {
  return (
    <Router
      history={history}
      future={routerConfig.future}
    >
      <AuthProvider>
        <BookingProvider>
          <ToastContainer 
            position="top-right" 
            autoClose={5000} 
            hideProgressBar={false} 
            newestOnTop 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
          />
          <Routes>
            {/* Public Routes - Only accessible when not logged in */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            
            {/* Main layout with protected routes */}
            <Route element={
              <ProtectedRoute>
                <LayoutWrapper>
                  <Outlet />
                </LayoutWrapper>
              </ProtectedRoute>
            }>
              <Route index element={<HomePage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/book" element={<BookingPage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
            </Route>
            
            {/* Catch all other routes - redirect to home */}
            <Route 
              path="*" 
              element={<Navigate to="/" replace />} 
            />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;