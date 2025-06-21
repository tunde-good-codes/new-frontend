import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle, FileText, Calendar, Hash, Copy, Eye, X, User, Mail, Shield, AlertCircle } from 'lucide-react';
import KYCDetailModal from '../UI/KYCDetailModal';
import { toast } from 'react-toastify';


const SavedKYCToken = () => {
  
  // Mock Loader component
  const Loader = ({ size }) => (
    <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${
      size === 'large' ? 'w-12 h-12' : 'w-8 h-8'
    }`}></div>
  );
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedToken, setCopiedToken] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [selectedKyc, setSelectedKyc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/kyc/me/dashboard`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setKycData(data.data);
        } else {
          setError('Failed to load KYC data');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch KYC data');
      } finally {
        setLoading(false);
      }
    };

    fetchKYCData();
  }, []);

  const copyToken = async (token) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(''), 10000);
      toast.success("Token copied to clipboard!")
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      verified: {
        icon: CheckCircle,
        bgClass: 'bg-gradient-to-r from-emerald-50 to-green-50',
        textClass: 'text-emerald-700',
        iconClass: 'text-emerald-600',
        borderClass: 'border-emerald-200',
        pulseClass: '',
        label: 'Verified'
      },
      completed: {
        icon: CheckCircle,
        bgClass: 'bg-gradient-to-r from-emerald-50 to-green-50',
        textClass: 'text-emerald-700',
        iconClass: 'text-emerald-600',
        borderClass: 'border-emerald-200',
        pulseClass: '',
        label: 'Completed'
      },
      pending: {
        icon: Clock,
        bgClass: 'bg-gradient-to-r from-amber-50 to-yellow-50',
        textClass: 'text-amber-700',
        iconClass: 'text-amber-600',
        borderClass: 'border-amber-200',
        pulseClass: 'animate-pulse',
        label: 'Under Review'
      },
      in_review: {
        icon: Clock,
        bgClass: 'bg-gradient-to-r from-amber-50 to-yellow-50',
        textClass: 'text-amber-700',
        iconClass: 'text-amber-600',
        borderClass: 'border-amber-200',
        pulseClass: 'animate-pulse',
        label: 'In Review'
      },
      rejected: {
        icon: XCircle,
        bgClass: 'bg-gradient-to-r from-red-50 to-rose-50',
        textClass: 'text-red-700',
        iconClass: 'text-red-600',
        borderClass: 'border-red-200',
        pulseClass: '',
        label: 'Rejected'
      },
      failed: {
        icon: XCircle,
        bgClass: 'bg-gradient-to-r from-red-50 to-rose-50',
        textClass: 'text-red-700',
        iconClass: 'text-red-600',
        borderClass: 'border-red-200',
        pulseClass: '',
        label: 'Failed'
      },
      not_started: {
        icon: Clock,
        bgClass: 'bg-gradient-to-r from-gray-50 to-slate-50',
        textClass: 'text-gray-700',
        iconClass: 'text-gray-600',
        borderClass: 'border-gray-200',
        pulseClass: '',
        label: 'Not Started'
      }
    };

    return statusConfig[status] || statusConfig.not_started;
  };

  const StatusBadge = ({ status }) => {
    const config = getStatusInfo(status);
    const IconComponent = config.icon;

    return (
      <div className={`inline-flex items-center px-3 py-1.5 rounded-full border ${config.bgClass} ${config.borderClass} ${config.pulseClass}`}>
        <IconComponent className={`w-4 h-4 mr-1.5 ${config.iconClass}`} />
        <span className={`text-sm font-medium ${config.textClass}`}>
          {config.label}
        </span>
      </div>
    );
  };

  const handleViewDetails = () => {
    setSelectedKyc(kycData);
    setIsModalOpen(true);
  };

  const DocumentCard = () => {
    if (!kycData) return null;
    
    const config = getStatusInfo(kycData.kyc?.status);
    const token = kycData.kyc.token?.token;

    return (
      <div className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${config.borderClass} overflow-hidden`}>
        <div className={`h-2 ${config.bgClass.replace('from-', 'from-').replace('to-', 'to-')}`}></div>
        
        <div className="p-6">
          {token && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 overflow-x-scroll">
                <Hash className="w-5 h-5 text-gray-400" />
                <span className="font-mono text-lg font-semibold text-gray-900 tracking-wide ">
                  {token}
                </span>
              </div>
              <button
                onClick={() => copyToken(token)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors group/copy"
                title="Copy token"
              >
                <Copy className={`w-4 h-4 transition-colors ${
                  copiedToken === token 
                    ? 'text-green-600' 
                    : 'text-gray-400 group-hover/copy:text-gray-600'
                }`} />
              </button>
            </div>
          )}

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-gray-600">
              <FileText className="w-4 h-4 mr-2" />
              <span className="capitalize font-medium">
                KYC Verification
              </span>
            </div>
            
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="font-medium">Level:</span> {kycData.kyc?.levelName || 'N/A'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <StatusBadge status={kycData.kyc?.status || 'not_started'} />
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {kycData.kyc?.lastUpdated 
                ? new Date(kycData.kyc.lastUpdated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'N/A'}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-3xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                KYC Verification
              </h3>
              <p className="text-indigo-100">
                Track your document verification status
              </p>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table' 
                    ? 'bg-white text-indigo-600 shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'cards' 
                    ? 'bg-white text-indigo-600 shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader size="large" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
              </div>
              <p className="mt-4 text-gray-500 animate-pulse">Loading your KYC data...</p>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-center">
                <XCircle className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h4 className="text-red-800 font-semibold">Error Loading KYC Data</h4>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          ) : !kycData ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-700 mb-2">No KYC Data</h4>
              <p className="text-gray-500 max-w-md mx-auto">
                No KYC verification data found. Please start your verification process.
              </p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DocumentCard />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Token
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Verified On
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    <tr className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {kycData.kyc?.token?.token ? (
                          <div className="flex items-center space-x-2 ">
                            <span className="font-mono overflow-x-scroll w-[150px] text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                              {kycData.kyc?.token?.token}
                            </span>
                            <button
                              onClick={() => copyToken(kycData?.kyc?.token?.token)}
                              className="p-1 rounded hover:bg-gray-200 transition-colors"
                              title="Copy token"
                            >
                              <Copy className={`w-3 h-3 ${
                                copiedToken === kycData?.kyc?.token?.token ? 'text-green-600' : 'text-gray-400'
                              }`} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No token</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900 font-medium">
                            KYC Verification
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {kycData.kyc?.levelName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={kycData.kyc?.status || 'not_started'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {kycData.kyc?.lastUpdated 
                            ? new Date(kycData.kyc.lastUpdated).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={handleViewDetails}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {copiedToken && (
            <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Token copied!
              </div>
            </div>
          )}
        </div>
      </div>

      <KYCDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        kycData={selectedKyc}
      />
    </div>
  );
};

export default SavedKYCToken;