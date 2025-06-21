import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from './contexts/AuthContext';

const OrderForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // State for form data
  const [formData, setFormData] = useState({
    currencyToSend: 'CAD',
    currencyToReceive: '',
    amountToSend: '',
    destinationCountry: '',
    recipientName: '',
    recipientAccount: '',
    transferMethod: 'Bank Transfer',
    purpose: '',
    notes: '',
    document: null
  });
  
  const [receivingCurrencies, setReceivingCurrencies] = useState([]);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);

  // Check KYC status on component mount
  useEffect(() => {
    if (!user) {
      toast.warning('Please login to access this feature');
      navigate('/login');
      return;
    }

    // Check KYC status - adjust this logic based on your user object structure
    // console.log(user)
    // const isKYCVerified = user.kyc && 
    //   user.kyc.status === 'verified' && 
    //   (user.kyc.review?.result === 'GREEN' || user.kyc.frontendReview?.reviewAnswer === 'GREEN');

    // if (!isKYCVerified) {
    //   toast.warning('Please complete KYC verification to access this feature');
    //   navigate('/kyc-start');
    // }
  }, [user, navigate]);

  // Update receiving currencies when sending currency changes
  useEffect(() => {
    if (formData.currencyToSend === 'CAD') {
      setReceivingCurrencies(['INR', 'NGN', 'USD', 'GBP', 'AUD', 'GHC', 'USDT', 'BTC', 'ETH', 'BNB', 'USDC']);
    } else if (formData.currencyToSend === 'AUD') {
      setReceivingCurrencies(['USDT', 'BTC', 'ETH', 'BNB', 'USDC']);
    }
    // Reset receiving currency when sending currency changes
    setFormData(prev => ({ ...prev, currencyToReceive: '' }));
  }, [formData.currencyToSend]);

  // Get auth token helper
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  // Get auth headers helper
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, document: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.currencyToReceive) {
        toast.error('Please select a currency to receive');
        return;
      }
      
      if (!formData.amountToSend || parseFloat(formData.amountToSend) <= 0) {
        toast.error('Please enter a valid amount to send');
        return;
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/create`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders()
        }
      });
      
      setOrderId(response.data.orderId);
      setShowOTPModal(true);
      toast.success(response.data.message);

    } catch (err) {
      console.error('Order creation error:', err);
      const errorMessage = err.response?.data?.message || 'Error submitting order';
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (err.response?.status === 403) {
        // KYC not verified
        navigate('/kyc-start');
      } else if (err.response?.status === 401) {
        // Unauthorized
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifyingOTP(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/verify-otp`, {
        orderId,
        otp
      }, {
        headers: getAuthHeaders()
      });

      toast.success(response.data.message);
      setShowOTPModal(false);
      setOtp('');
      navigate('/');

    } catch (err) {
      console.error('OTP verification error:', err);
      const errorMessage = err.response?.data?.message || 'Error verifying OTP';
      toast.error(errorMessage);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (!orderId) {
      toast.error('Order ID not found');
      return;
    }

    setIsResendingOTP(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/orders/resend-otp`, {
        orderId
      }, {
        headers: getAuthHeaders()
      });

      toast.success(response.data.message);
      setOtp(''); // Clear current OTP input

    } catch (err) {
      console.error('Resend OTP error:', err);
      const errorMessage = err.response?.data?.message || 'Error resending OTP';
      toast.error(errorMessage);
    } finally {
      setIsResendingOTP(false);
    }
  };

  const handleCloseModal = () => {
    setShowOTPModal(false);
    setOtp('');
    setOrderId(null);
  };

  // Don't render form if user is not available or not KYC verified
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-[#252E75]">
    <div className="container mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Order Request Form</h1>
        <p className="text-blue-100 text-lg">Secure and fast international money transfers</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl shadow-xl border border-blue-300 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Transfer Details</h2>
            <p className="text-blue-100 mt-1">Please fill in all required information</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 bg-white">
            {/* User Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={user?.firstName + " " + user?.lastName || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Currency Selection Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Currency Selection
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Currency to Send <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currencyToSend"
                    value={formData.currencyToSend}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="CAD">CAD - Canadian Dollar</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Currency to Receive <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="currencyToReceive"
                    value={formData.currencyToReceive}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="">Select receiving currency</option>
                    {receivingCurrencies.map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Amount Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Transfer Amount
              </h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Amount to Send <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="amountToSend"
                    value={formData.amountToSend}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pl-12"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                    $
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Recipient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recipient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    placeholder="Enter recipient's full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Recipient Account/Wallet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="recipientAccount"
                    value={formData.recipientAccount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                    placeholder="Bank account, mobile money, or wallet"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Destination Country</label>
                <input
                  type="text"
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., India, Nigeria, Philippines"
                />
              </div>
            </div>

            {/* Transfer Details Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Transfer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Transfer Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="transferMethod"
                    value={formData.transferMethod}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Mobile Money">Mobile Money</option>
                    <option value="Crypto Wallet">Crypto Wallet</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Purpose of Transfer</label>
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Family support, Education, Business"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Additional Information
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Notes/Instructions</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows="4"
                    placeholder="Any special instructions or additional notes..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Upload Supporting Document</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span className="text-sm text-gray-700 font-medium">Click to upload document</span>
                        <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Notice</p>
                    <p>Fields marked with <span className="text-red-500">*</span> are required. By submitting this form, you agree to our terms and conditions for international money transfers.</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Order Request...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    Submit Order Request
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in-0 zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                OTP Verification
              </h2>
            </div>
            
            <div className="p-6">
              <p className="mb-6 text-gray-700 text-center">
                We've sent a 6-digit verification code to your registered email address. Please enter it below to confirm your order.
              </p>
              
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="000000"
                    maxLength="6"
                    required
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex space-x-2">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-0.5 ${
                            i < otp.length ? 'bg-blue-500' : 'bg-gray-300'
                          } transition-colors`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:from-blue-300 disabled:to-blue-400 disabled:cursor-not-allowed transition-all duration-200"
                    disabled={isVerifyingOTP || otp.length !== 6}
                  >
                    {isVerifyingOTP ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 disabled:text-blue-300 disabled:cursor-not-allowed transition-colors"
                    disabled={isResendingOTP}
                  >
                    {isResendingOTP ? 'Resending...' : 'Resend OTP'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    disabled={isVerifyingOTP}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);


};

export default OrderForm;