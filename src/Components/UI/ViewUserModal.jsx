import React, { useState } from 'react';
import { FiX, FiEye, FiEdit, FiTrash2, FiMail, FiPhone, FiUser, FiCalendar, FiShield, FiCheck, FiAlertTriangle } from 'react-icons/fi';

// View User Modal
export const ViewUserModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  const getKycConfig = (status) => {
    const configs = {
      verified: { color: 'text-green-700', bgColor: 'bg-green-50', icon: <FiCheck size={16} />, label: 'Verified' },
      pending: { color: 'text-yellow-700', bgColor: 'bg-yellow-50', icon: <FiAlertTriangle size={16} />, label: 'Pending' },
      under_review: { color: 'text-yellow-700', bgColor: 'bg-yellow-50', icon: <FiAlertTriangle size={16} />, label: 'Under Review' },
      initiated: { color: 'text-yellow-700', bgColor: 'bg-yellow-50', icon: <FiAlertTriangle size={16} />, label: 'Initiated' },
      rejected: { color: 'text-red-700', bgColor: 'bg-red-50', icon: <FiX size={16} />, label: 'Rejected' },
      not_started: { color: 'text-gray-700', bgColor: 'bg-gray-50', icon: <FiAlertTriangle size={16} />, label: 'Not Started' }
    };
    return configs[status] || configs.not_started;
  };

  const kycStatus = user.kyc?.status || 'not_started';
  const kycConfig = getKycConfig(kycStatus);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
              <FiEye className="text-blue-500" />
              <span>User Details</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* User Profile */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=6366f1&color=white&size=80`}
                alt={user.name || user.email}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-bold text-gray-800">{user.name || user.email.split('@')[0]}</h3>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start space-x-2">
                <FiMail size={16} />
                <span>{user.email}</span>
              </p>
              {user.phoneNumber && (
                <p className="text-gray-600 flex items-center justify-center sm:justify-start space-x-2 mt-1">
                  <FiPhone size={16} />
                  <span>{user.phoneNumber}</span>
                </p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <FiUser />
                <span>Role</span>
              </h4>
              <p className="text-gray-600 capitalize">{user.role || 'user'}</p>
            </div>

            <div className={`${kycConfig.bgColor} rounded-2xl p-4`}>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <FiShield />
                <span>KYC Status</span>
              </h4>
              <div className={`flex items-center space-x-2 ${kycConfig.color}`}>
                {kycConfig.icon}
                <span className="font-medium">{kycConfig.label}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                <FiCalendar />
                <span>Joined</span>
              </h4>
              <p className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-700 mb-2">Last Active</h4>
              <p className="text-gray-600">{user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          {/* KYC Details */}
          {user.kyc && (
            <div className="bg-blue-50 rounded-2xl p-4">
              <h4 className="font-semibold text-gray-700 mb-3">KYC Information</h4>
              <div className="space-y-2 text-sm">
                {user.kyc.verifiedAt && (
                  <p><span className="font-medium">Verified:</span> {new Date(user.kyc.verifiedAt).toLocaleDateString()}</p>
                )}
                {user.kyc.submittedAt && (
                  <p><span className="font-medium">Submitted:</span> {new Date(user.kyc.submittedAt).toLocaleDateString()}</p>
                )}
                {user.kyc.rejectionReason && (
                  <p><span className="font-medium">Rejection Reason:</span> {user.kyc.rejectionReason}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Edit User Modal
export const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    role: user?.role || 'user'
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(user._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-3">
              <FiEdit className="text-green-500" />
              <span>Edit User</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete User Modal
export const DeleteUserModal = ({ user, isOpen, onClose, onDelete }) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(user._id);
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-red-600 flex items-center space-x-3">
              <FiTrash2 />
              <span>Delete User</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Are you sure?</h3>
            <p className="text-gray-600">
              This will permanently delete <strong>{user.name || user.email}</strong> and all associated data. 
              This action cannot be undone.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete User'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};