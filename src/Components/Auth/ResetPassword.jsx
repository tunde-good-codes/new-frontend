import React, { useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Loader from '../UI/Loader';
import { toast } from 'react-toastify';
import logo from "../../assets/4bbedcd37744588f6c0f61756721f323bde5935a.png";
import api from '../services/api';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPass, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (password !== confirmPassword) {
    toast.error('Passwords do not match');
    setLoading(false);
    return;
  }

  try {
    const result = await resetPass(null, password, token);
    
    if (result.success) {
      toast.success('Password has been reset successfully!');
      
      // Store token and user data
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${result.token}`;
      
      // Update auth context
      setUser(result.user);
      
      // Redirect based on role
      const redirectPath = result.user.role === 'admin' ? '/admin' : '/dashboard';
      navigate(redirectPath);
    } else {
      toast.error(result.message || 'Password reset failed');
    }
  } catch (err) {
    toast.error(err.message || 'An error occurred');
  } finally {
    setLoading(false);
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
              Set New Password
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Create a new secure password for your account to regain full access to our trading platform.
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
              <span className="text-blue-100">Strong password encryption</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-100">Immediate access restoration</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-blue-100">Full account security</span>
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

      {/* Right Side - Form */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Password</h2>
              <p className="text-gray-600">Enter and confirm your new password</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 outline-none placeholder-gray-400 bg-white"
                  placeholder="••••••••••"
                  required
                  minLength="6"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-500/20 outline-none placeholder-gray-400 bg-white"
                  placeholder="••••••••••"
                  required
                  minLength="6"
                />
              </div>

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reset Password
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Remember your password?</span>
                </div>
              </div>
              <Link
                to="/login"
                className="mt-4 cursor-pointer inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Back to Login
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
                <p className="text-sm text-green-800 font-medium">Password Requirements</p>
                <p className="text-xs text-green-600 mt-1">Minimum 6 characters. Use a combination of letters, numbers, and symbols for better security.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;