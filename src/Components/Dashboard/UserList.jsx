import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiEye,
  FiTrash2,
  FiMail,
  FiPhone,
  FiShield,
  FiUser,
  FiCheck,
  FiX,
  FiClock,
  FiAlertCircle,
  FiDownload,
  FiRefreshCw,
  FiGrid,
  FiList
} from 'react-icons/fi';
import api from '../services/api';
import moment from 'moment';
import { ViewUserModal, EditUserModal, DeleteUserModal } from '../UI/ViewUserModal';
import UserCard from '../UI/UserCard';

// Mock Loader component
const Loader = ({ size = "medium" }) => (
  <div className={`flex items-center justify-center ${size === 'large' ? 'h-32' : 'h-16'}`}>
    <div className="relative">
      <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
  </div>
);

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredUser, setHoveredUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get('/kyc/users/');
        setUsers(response.data.data);
        setStats(response.data.statistics);
      } catch (err) {
        setError(err.response?.data?.message ||
          err.message ||
          'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('MMM D, YYYY');
  };

  // Format last active time
  const formatLastActive = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).fromNow();
  };

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'verified' && user.kyc?.status === 'verified') ||
      (filterStatus === 'pending' && (user.kyc?.status === 'pending' || user.kyc?.status === 'under_review' || user.kyc?.status === 'initiated')) ||
      (filterStatus === 'rejected' && user.kyc?.status === 'rejected') ||
      (filterStatus === 'not_verified' && (!user.kyc || user.kyc?.status === 'not_started'));
    return matchesSearch && matchesFilter;
  });


  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveUser = async (userId, userData) => {
    try {
      await api.put(`/kyc/users/${userId}`, userData);
      // Refresh user list
      const response = await api.get('/kyc/users/');
      setUsers(response.data.data);
      setStats(response.data.statistics);
    } catch (error) {
      throw error;
    }
  };


  const handleDeleteConfirm = async (userId) => {
    try {
      await api.delete(`/kyc/users/${userId}`);
      // Refresh user list
      const response = await api.get('/kyc/users/');
      setUsers(response.data.data);
      setStats(response.data.statistics);
    } catch (error) {
      throw error;
    }
  };




  // Get KYC status configuration
  const getKycConfig = (status) => {
    const configs = {
      verified: {
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        icon: <FiCheck size={14} />,
        label: 'Verified'
      },
      pending: {
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        icon: <FiClock size={14} />,
        label: 'Pending'
      },
      under_review: {
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        icon: <FiClock size={14} />,
        label: 'Under Review'
      },
      initiated: {
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        icon: <FiClock size={14} />,
        label: 'Initiated'
      },
      rejected: {
        color: 'from-red-500 to-pink-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        icon: <FiX size={14} />,
        label: 'Rejected'
      },
      not_started: {
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        icon: <FiAlertCircle size={14} />,
        label: 'Not Started'
      },
      expired: {
        color: 'from-red-500 to-pink-600',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        icon: <FiX size={14} />,
        label: 'Expired'
      },
      on_hold: {
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        icon: <FiClock size={14} />,
        label: 'On Hold'
      }
    };
    return configs[status] || configs.not_started;
  };

  const getRoleConfig = (role) => {
    return role === 'admin'
      ? { color: 'from-purple-500 to-indigo-600', icon: <FiShield size={14} /> }
      : { color: 'from-blue-500 to-cyan-600', icon: <FiUser size={14} /> };
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent flex items-center space-x-3">
              <FiUsers className="text-blue-500" size={32} />
              <span>User Management</span>
            </h1>
            <p className="text-slate-600 mt-2">Manage and monitor all user accounts</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <FiDownload size={18} />
              <span>Export</span>
            </button>

            <button
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all duration-300"
              onClick={() => {
                setLoading(true);
                api.get('/kyc/users/')
                  .then(response => {
                    setUsers(response.data.data);
                    setStats(response.data.statistics);
                  })
                  .catch(err => {
                    setError(err.response?.data?.message ||
                      err.message ||
                      'Failed to fetch users');
                  })
                  .finally(() => setLoading(false));
              }}
            >
              <FiRefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">

            {/* Search */}
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/50 border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="not_verified">Not Verified</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/50 rounded-2xl p-1 border border-white/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 hover:bg-white/50'
                    }`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'table' ? 'bg-blue-500 text-white shadow-lg' : 'text-slate-600 hover:bg-white/50'
                    }`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12">
              <Loader size="large" />
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center space-x-4">
                <FiAlertCircle className="text-red-500" size={24} />
                <div>
                  <h3 className="font-semibold text-red-800">Error Loading Users</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <FiUsers className="mx-auto text-slate-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">No Users Found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="p-8">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 lg:gap-8">
                  {filteredUsers.map((user) => (
                    <UserCard key={user._id} user={user} getKycConfig={getKycConfig} getRoleConfig={getRoleConfig} setHoveredUser={setHoveredUser} formatDate={formatDate} formatLastActive={formatLastActive} hoveredUser={hoveredUser} handleDeleteUser={handleDeleteUser} handleEditUser={handleEditUser} handleViewUser={handleViewUser} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-4 px-3 lg:px-6 font-semibold text-slate-700">User</th>
                          <th className="text-left py-4 px-3 lg:px-6 font-semibold text-slate-700 hidden sm:table-cell">Role</th>
                          <th className="text-left py-4 px-3 lg:px-6 font-semibold text-slate-700">KYC Status</th>
                          <th className="text-left py-4 px-3 lg:px-6 font-semibold text-slate-700 hidden md:table-cell">Phone</th>
                          <th className="text-center py-4 px-3 lg:px-6 font-semibold text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user, index) => {
                          const kycStatus = user.kyc?.status || 'not_started';
                          const kycConfig = getKycConfig(kycStatus);
                          const roleConfig = getRoleConfig(user.role);

                          return (
                            <tr
                              key={user._id}
                              className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors duration-200"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="py-4 px-3 lg:px-6">
                                <div className="flex items-center space-x-3 lg:space-x-4">
                                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden shadow-md">
                                    <img
                                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=6366f1&color=white&size=48`}
                                      alt={user.name || user.email}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">{user.name || user.email.split('@')[0]}</p>
                                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-3 lg:px-6 hidden sm:table-cell">
                                <div className={`inline-flex items-center space-x-1 px-2 lg:px-3 py-1 rounded-full bg-gradient-to-r ${roleConfig.color} text-white text-xs lg:text-sm font-medium`}>
                                  {roleConfig.icon}
                                  <span className="capitalize hidden lg:inline">{user.role || 'user'}</span>
                                </div>
                              </td>
                              <td className="py-4 px-3 lg:px-6">
                                <div className={`inline-flex items-center space-x-1 px-2 lg:px-3 py-1 rounded-full ${kycConfig.bgColor} ${kycConfig.textColor} text-xs lg:text-sm font-medium`}>
                                  {kycConfig.icon}
                                  <span className="hidden sm:inline">{kycConfig.label}</span>
                                </div>
                              </td>
                              <td className="py-4 px-3 lg:px-6 text-slate-600 hidden md:table-cell">
                                {user?.profile?.phone || '-'}
                              </td>
                              <td className="py-4 px-3 lg:px-6">
                                <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                                  <button
                                    onClick={() => handleViewUser(user)}
                                    className="p-1.5 lg:p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors duration-200"
                                  >
                                    <FiEye size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleEditUser(user)}
                                    className="p-1.5 lg:p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
                                  >
                                    <FiEdit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user)}
                                    className="p-1.5 lg:p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              { label: 'Total Users', value: stats.totalUsers, color: 'from-blue-500 to-purple-600' },
              { label: 'Verified', value: stats.kycStatusCounts.verified, color: 'from-green-500 to-emerald-600' },
              { label: 'Pending', value: stats.kycStatusCounts.pending + stats.kycStatusCounts.under_review + stats.kycStatusCounts.initiated, color: 'from-yellow-500 to-orange-500' },
              { label: 'Rejected', value: stats.kycStatusCounts.rejected, color: 'from-red-500 to-pink-600' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-4 lg:p-6 shadow-lg">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3 lg:mb-4 shadow-lg`}>
                  <FiUsers className="text-white" size={20} />
                </div>
                <p className="text-xl lg:text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        <ViewUserModal
          user={selectedUser}
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
        />

        <EditUserModal
          user={selectedUser}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveUser}
        />

        <DeleteUserModal
          user={selectedUser}
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default UserList;