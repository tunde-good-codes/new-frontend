import {  FileText, Hash, Copy, Eye, X, User, Mail, Shield, AlertCircle } from 'lucide-react';

const KYCDetailModal = ({ isOpen, onClose, kycData }) => {
  if (!isOpen || !kycData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'pending':
      case 'in_review':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected':
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000d3] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">KYC Details</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              User Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <p className="font-medium text-gray-900">{kycData.user?.firstName + ' ' + kycData.user?.lastName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium text-gray-900">{kycData.user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* KYC Status */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Verification Status
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Overall Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(kycData.kyc?.status)}`}>
                  {kycData.kyc?.status?.replace('_', ' ').toUpperCase() || 'NOT STARTED'}
                </span>
              </div>
              <div>
                <label className="text-sm text-gray-600">Level</label>
                <p className="font-medium text-gray-900">{kycData.kyc?.levelName || 'N/A'}</p>
              </div>
              {kycData.kyc?.lastUpdated && (
                <div>
                  <label className="text-sm text-gray-600">Verified At</label>
                  <p className="font-medium text-gray-900">
                    {new Date(kycData.kyc.lastUpdated).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Verification Token */}
          {kycData.kyc?.token && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                
                Verification Token
              </h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <code className="bg-white px-3 py-2 rounded-lg border text-sm font-mono overflow-x-scroll">
                    {kycData.kyc.token.token}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(kycData.kyc.token.token)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Copy token"
                  >
                    <Copy className="w-4 h-4 text-blue-600" />
                  </button>
                </div>
                <div className="text-sm text-blue-600">
                  Valid: {kycData.kyc.token.isActive ? 'Yes' : 'No'}
                  {kycData.kyc.token.expires && (
                    <span className="ml-2">
                      (Expires: {new Date(kycData.kyc.token.expires).toLocaleDateString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          {kycData.kyc?.documents && kycData.kyc.documents.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Submitted Documents
              </h4>
              <div className="space-y-3">
                {kycData.kyc.documents.map((doc, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{doc.type}</p>
                        <p className="text-sm text-gray-600">Country: {doc.country}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Information */}
          {kycData.kyc?.review && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Review Details
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Review Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ml-2 ${getStatusColor(kycData.kyc.review.status)}`}>
                    {kycData.kyc.review.status?.toUpperCase() || 'N/A'}
                  </span>
                </div>
                {kycData.kyc.review.result && (
                  <div>
                    <label className="text-sm text-gray-600">Result</label>
                    <p className="font-medium text-gray-900">{kycData.kyc.review.result}</p>
                  </div>
                )}
                {kycData.kyc.review.rejectionReason && (
                  <div>
                    <label className="text-sm text-gray-600">Rejection Reason</label>
                    <p className="font-medium text-red-600">{kycData.kyc.review.rejectionReason}</p>
                  </div>
                )}
                {kycData.kyc.review.comment && (
                  <div>
                    <label className="text-sm text-gray-600">Comment</label>
                    <p className="font-medium text-gray-900">{kycData.kyc.review.comment}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default KYCDetailModal;