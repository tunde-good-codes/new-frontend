import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from './Components/Auth/LoginForm';
import RegisterForm from './Components/Auth/RegisterForm';
import ForgotPassword from './Components/Auth/ForgotPassword';
import ResetPassword from './Components/Auth/ResetPassword';
import UserDashboard from './Components/Dashboard/UserDashboard';
import AdminDashboard from './Components/Dashboard/AdminDashboard';
import PrivateRoute from './Components/UI/PrivateRoute';
import AdminRoute from './Components/UI/AdminRoute';
import NotFound from './Components/UI/NotFound';
import { AuthProvider } from './Components/contexts/AuthContext';
import { ThemeProvider } from './Components/contexts/ThemeContext';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import KYCVerification from './Components/KYCVerification';
import { GoogleOAuthProvider } from '@react-oauth/google';
import OrderTable from './Components/OrderTable';
import VerifiyPassowrd from './Components/Auth/VerifiyPassowrd';

// Define a component that checks the location and conditionally renders Navbar
function NavbarCondition() {
  const location = useLocation();  // Use location hook to get current URL path

  // Check if the current URL is related to the dashboard or admin routes
  const isDashboardOrAdmin = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');

  // Conditionally render Navbar
  return !isDashboardOrAdmin ? <AuthProvider>  <Navbar />  </AuthProvider>: null;
}

function FooterCondition() {
  const location = useLocation();  // Use location hook to get current URL path

  // Check if the current URL is related to the dashboard or admin routes
  const isDashboardOrAdmin = location.pathname.includes('/dashboard') || location.pathname.includes('/admin');

  // Conditionally render Navbar
  return !isDashboardOrAdmin ? <Footer /> : null;
}

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <NavbarCondition />
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/order-table" element={<OrderTable />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifiyPassowrd />} />

              {/* Private Routes */}
              <Route path="/dashboard" element={<PrivateRoute />}>
                <Route index element={<UserDashboard />} />
              </Route>
                <Route path="/kyc-start" element={<KYCVerification />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>

            <FooterCondition />
          </div>
        </AuthProvider>
      </ThemeProvider>
        </GoogleOAuthProvider>
    </Router>
  );
}

export default App;
