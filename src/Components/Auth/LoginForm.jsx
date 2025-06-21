import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../UI/Loader';
import GoogleSignIn from './GoogleSignIn';
import api from '../services/api';
import { toast } from 'react-toastify';
import logo from "../../assets/4bbedcd37744588f6c0f61756721f323bde5935a.png";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, setUser } = useContext(AuthContext);
  const [googleLogedIn, setGoogleLogedIn] = useState(null);
  const [showResendButton, setShowResendButton] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (googleLogedIn) {
      setUser(googleLogedIn);
      localStorage.setItem('user', JSON.stringify(googleLogedIn));
      localStorage.setItem('token', googleLogedIn.token);
      sessionStorage.setItem('token', googleLogedIn.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${googleLogedIn.token}`;
      navigate(googleLogedIn.role === 'admin' ? '/admin' : '/dashboard');
      toast.success('Google login successful! Redirecting...');
    }
  }, [googleLogedIn, setUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        toast.success('Login successful!');
      }
      
    } catch (error) {
      console.error('Login submit error:', error);
      
      // Handle specific error messages
      if (error.message.includes('Please verify your email first')) {
        setShowResendButton(true);
      }
      
      toast.error(error.message || 'Login failed');
    }
  };

  const resendVerification = async () => {
    try {
      await api.post('/auth/resend-verification', { email });
      toast.success('Verification email resent. Please check your inbox.');
      setShowResendButton(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Branding & Information */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-yellow-400 bg-opacity-20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-400 bg-opacity-15 rounded-full animate-pulse"></div>

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <img src={logo} alt="" className='w-60' />
            <p className="text-xl text-blue-200">Secure Exchange for Fiat and Crypto</p>
          </div>

          {/* Main Message */}
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-6 leading-tight">
              Welcome Back to Your Secure Trading Hub
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Access your verified account and continue your secure crypto trading journey with enhanced features and premium tools.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-100">Instant portfolio access</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-100">Real-time market data</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-100">Advanced trading tools</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-100">Secure transaction history</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white border-opacity-20">
            <p className="text-sm text-blue-200 mb-4">Trusted by 50,000+ traders worldwide</p>
            <div className="flex space-x-4 opacity-60">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">SSL</span>
              </div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">2FA</span>
              </div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-xs font-bold">KYC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">PinovX</h1>
          </div>

          {/* Form Card */}
          <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white border-opacity-20">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 outline-none placeholder-gray-400 bg-white"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 outline-none placeholder-gray-400 bg-white"
                  placeholder="••••••••••"
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 cursor-pointer block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="font-medium cursor-pointer text-blue-600 hover:text-blue-700 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Resend Verification Button */}
              {showResendButton && (
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-2">Email verification required</p>
                  <button
                    type="button"
                    onClick={resendVerification}
                    className="text-sm cursor-pointer font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Resend verification email
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center min-h-[56px]"
              >
                {loading ? (
                  <Loader size="small" />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Google Sign In */}
              <GoogleSignIn
                onSuccess={(user) => setGoogleLogedIn(user)}
                onError={(error) => {
                  console.error(error);
                  toast.error('Google login failed');
                }}
              />
            </form>

                      {/* Register Link */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
            <Link
              to="/register"
              className="mt-4 cursor-pointer inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Create new account
            </Link>
          </div>

          </div>



          {/* Security Notice */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-green-800 font-medium">Secure Login</p>
                <p className="text-xs text-green-600 mt-1">Your credentials are encrypted and secure. Access your verified trading account with full features enabled.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;