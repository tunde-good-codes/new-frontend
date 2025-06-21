import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaSave,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserEdit,
  FaLock,
  FaInfoCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProfileUpdate = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (user) {
      const data = {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        address: user.profile?.address || '',
      };
      setFormData(data);
      setInitialData(data);
    }
  }, [user]);


  useEffect(() => {
    if( message) {
      toast.success(message);
      setMessage('');
    }
    return () => {
      setMessage('');
    }
  }, [message]);
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError('');
    }
    return () => {
      setError('');
    }
  },[message, error]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    const changed = Object.keys(formData).some(
      key => formData[key] !== initialData[key]
    );
    setIsDirty(changed);
    
    if (message) setMessage('');
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!isDirty) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        profile: {
          phone: formData.phone,
          address: formData.address,
        },
      };

      const result = await updateUserProfile(profileData);
      if (result.success) {
        setMessage('Profile updated successfully!');
        setIsDirty(false);
        setInitialData(formData);
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setIsDirty(false);
    setError('');
    setMessage('');
  };


  const inputFields = [
    {
      id: 'firstName',
      label: 'First Name',
      type: 'text',
      icon: FaUser,
      placeholder: 'Enter your first name',
      required: true,
      maxLength: 30,
      description: 'Your legal first name (max 30 characters)'
    },
    {
      id: 'lastName',
      label: 'Last Name',
      type: 'text',
      icon: FaUser,
      placeholder: 'Enter your last name',
      required: true,
      maxLength: 30,
      description: 'Your legal last name (max 30 characters)'
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'email',
      icon: FaEnvelope,
      placeholder: 'Enter your email address',
      required: true,
      description: 'We\'ll use this for account notifications',
      pattern: "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$"
    },
    {
      id: 'phone',
      label: 'Phone Number',
      type: 'tel',
      icon: FaPhone,
      placeholder: 'Enter your phone number',
      required: false,
      maxLength: 20,
      description: 'Optional (max 20 characters)'
    },
    {
      id: 'address',
      label: 'Address',
      type: 'text',
      icon: FaMapMarkerAlt,
      placeholder: 'Enter your address',
      required: false,
      maxLength: 200,
      description: 'Optional (max 200 characters)'
    }
  ];

  // Calculate profile completion percentage
  const completedFields = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phone,
    formData.address
  ].filter(value => value.trim() !== '').length;

  const completionPercentage = (completedFields / 5) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                  <FaUserEdit className="mr-3" />
                  Update Profile
                </h1>
                <p className="text-blue-100">
                  Keep your information up-to-date and secure
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex items-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaLock className="text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inputFields.map((field) => {
                  const IconComponent = field.icon;
                  return (
                    <div key={field.id} className="space-y-2">
                      <label 
                        htmlFor={field.id} 
                        className="block text-sm font-medium text-gray-700"
                      >
                        <div className="flex items-center">
                          <IconComponent className="mr-2 text-blue-600" />
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                      </label>
                      
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type={field.type}
                          id={field.id}
                          name={field.id}
                          value={formData[field.id]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required={field.required}
                          maxLength={field.maxLength}
                          pattern={field.pattern}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                   transition duration-150 ease-in-out sm:text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IconComponent className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <p className="mt-1 text-xs text-gray-500 flex items-center">
                        <FaInfoCircle className="mr-1 text-gray-400" />
                        {field.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Profile Completion Indicator */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Profile Completion</h4>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {completedFields}/5 fields completed
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-6 border-t border-gray-200">
                <div className="mt-4 sm:mt-0">
                  {isDirty && (
                    <span className="flex items-center text-yellow-600 text-sm">
                      <FaExclamationTriangle className="mr-1" />
                      You have unsaved changes
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={!isDirty || loading}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md 
                             hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
                             disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Reset
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!isDirty || loading}
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md 
                             hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                             disabled:opacity-50 disabled:cursor-not-allowed transition
                             flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FaSave />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <FaExclamationTriangle className="flex-shrink-0 h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Your personal information is encrypted and securely stored. We recommend keeping your profile 
                  information up-to-date for better account security and faster verification processes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;