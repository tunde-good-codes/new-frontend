import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaCalendarAlt, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaShieldAlt,
  FaEdit,
  FaFileAlt,
  FaExclamationTriangle,
  FaGlobe
} from 'react-icons/fa';

const UserData = () => {
  const { user } = useContext(AuthContext);
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(kycData)

  // Fetch KYC data
  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/kyc/me/dashboard`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setKycData(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching KYC data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchKYCData();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'verified':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
      case 'processing':
        return <FaClock className="text-yellow-500" />;
      case 'rejected':
      case 'declined':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaExclamationTriangle className="text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
      case 'verified':
        return 'Verified';
              case 'completed':
        return 'completed';
      case 'pending':
      case 'processing':
        return 'Under Review';
      case 'rejected':
      case 'declined':
        return 'Rejected';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
      case 'verified':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDocumentType = (type) => {
    const types = {
      'PASSPORT': 'Passport',
      'ID_CARD': 'National ID Card',
      'DRIVING_LICENCE': 'Driver\'s License',
      'passport': 'Passport',
      'id-card': 'National ID Card',
      'driver-license': 'Driver\'s License',
      'other': 'Other Document'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#252E75] to-[#1a1f5c] text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, { user?.firstName + " " + user?.lastName || 'User'}!
            </h1>
            <p className="text-blue-100">
              Manage your account and verification status
            </p>
          </div>
          <div className="text-4xl opacity-20">
            <FaUser />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Information */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-[#252E75] flex items-center">
              <FaUser className="mr-3" />
              Account Information
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaUser className="text-[#252E75] mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Full Name</p>
                  <p className="text-lg text-gray-900">
                    {kycData?.user?.name || user?.firstName + " " + user?.lastName || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-[#252E75] mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Email Address</p>
                  <p className="text-lg text-gray-900">
                    {kycData?.user?.email || user?.email || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaPhone className="text-[#252E75] mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone Number</p>
                  <p className="text-lg text-gray-900">{user?.profile?.phone || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-[#252E75] mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-lg text-gray-900">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Not available'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#252E75] mb-6 flex items-center">
            <FaShieldAlt className="mr-3" />
            Quick Actions
          </h3>
          
          <div className="space-y-4">
            <Link 
              to="/kyc-start"
              className="block w-full bg-[#252E75] text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-[#1a1f5c] transition-colors duration-200 flex items-center justify-center"
            >
              <FaIdCard className="mr-2" />
              {kycData?.kyc?.status !== 'not_started' ? 'Update KYC' : 'Verify KYC'}
            </Link>
          </div>
        </div>
      </div>

      {/* KYC Verification Status */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-[#252E75] mb-6 flex items-center">
          <FaShieldAlt className="mr-3" />
          KYC Verification Status
        </h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#252E75]"></div>
            <span className="ml-3 text-gray-600">Loading verification status...</span>
          </div>
        ) : kycData?.kyc ? (
          <div className="space-y-6">
            {/* Main Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  {getStatusIcon(kycData.kyc.status)}
                  <span className="ml-2 font-medium text-gray-900">Status</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(kycData.kyc.status)}`}>
                  {getStatusText(kycData.kyc.status)}
                </span>
              </div>

              {kycData.kyc.level && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaShieldAlt className="text-[#252E75]" />
                    <span className="ml-2 font-medium text-gray-900">KYC Level</span>
                  </div>
                  <p className="text-gray-700 font-medium">{kycData.kyc.level}</p>
                </div>
              )}

              {kycData.kyc.lastUpdated && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="ml-2 font-medium text-gray-900">Verified On</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {new Date(kycData.kyc.lastUpdated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}

              {kycData.kyc.token?.isActive && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <FaClock className="text-blue-500" />
                    <span className="ml-2 font-medium text-gray-900">Token Valid</span>
                  </div>
                  <p className="text-gray-700 text-sm">
                    Until {new Date(kycData.kyc.token.expires).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Documents Section */}
            {kycData.kyc.documents && kycData.kyc.documents.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaFileAlt className="mr-2 text-[#252E75]" />
                  Submitted Documents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kycData.kyc.documents.map((doc, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FaIdCard className="text-[#252E75] mr-2" />
                          <span className="font-medium text-gray-900">
                            {formatDocumentType(doc.type)}
                          </span>
                        </div>
                        {doc.verified ? (
                          <FaCheckCircle className="text-green-500" />
                        ) : (
                          <FaClock className="text-yellow-500" />
                        )}
                      </div>
                      {doc.country && (
                        <div className="flex items-center text-sm text-gray-600">
                          <FaGlobe className="mr-1" />
                          <span>{doc.country}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Review Section */}
            {kycData.kyc.review && kycData.kyc.review.status && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaFileAlt className="mr-2 text-[#252E75]" />
                  Review Status
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Review Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(kycData.kyc.review.status)}`}>
                        {getStatusText(kycData.kyc.review.status)}
                      </span>
                    </div>
                    
                    {kycData.kyc.review.result && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Result</p>
                        <p className="text-gray-900">{kycData.kyc.review.result}</p>
                      </div>
                    )}
                  </div>

                  {kycData.kyc.review.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason</p>
                      <p className="text-red-700">{kycData.kyc.review.rejectionReason}</p>
                    </div>
                  )}

                  {kycData.kyc.review.comment && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">Review Comment</p>
                      <p className="text-blue-700">{kycData.kyc.review.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaExclamationTriangle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No KYC Submission Found</h4>
            <p className="text-gray-600 mb-6">
              Complete your KYC verification to access all features and increase your account security.
            </p>
            <Link 
              to="/kyc-start"
              className="inline-flex items-center px-6 py-3 bg-[#252E75] text-white font-medium rounded-lg hover:bg-[#1a1f5c] transition-colors duration-200"
            >
              <FaIdCard className="mr-2" />
              Start KYC Verification
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserData;