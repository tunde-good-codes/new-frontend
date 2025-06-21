import axios from 'axios';
import api from './api';
import { toast } from 'react-toastify';

// services/authService.js

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { 
      email, 
      password 
    });
    
    // Check if response is successful
    if (response.data.success) {
      return {
        user: response.data.user,
        token: response.data.token,
      };
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
    
  } catch (error) {
    console.error('Login API Error:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Login failed';
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other errors
      throw new Error(error.message || 'Something went wrong');
    }
  }
};

export const registerUser = async (userData) => {
  console.log(userData)
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData);
    
    // For email verification flow
   if (response.data.message && response.data.success && !response.data.token) {
      return {
        requiresVerification: true,
        message: response.data.message,
      };
    }
    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error) {
    const message = error.response?.data?.error || 'Registration failed';
    toast.error(message);
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  try {
    // Clear user data from localStorage and sessionStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // If stored
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};



export const resetPassword = async (email, newPassword, token) => {
  try {
    const endpoint = token 
      ? `/auth/resetpassword/${token}` 
      : '/auth/forgotpassword';

    const data = token 
      ? { password: newPassword } 
      : { email };

    const config = {
      headers: {}
    };

    // Include token from localStorage if available
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}${endpoint}`,
      data,
      config
    );

    console.log('Reset Password Response:', response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};


export const updateProfile = async (userId, profileData) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found, please log in again.');
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await api.put(`/auth/updatedetails`, profileData, {
      headers: headers,
    });

    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};


export const registerKYC = async (kycData) => {
  try {
    const response = await api.post('/kyc', kycData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'KYC registration failed');
  }
};

export const getUserKYCTokens = async () => {
  try {
    const response = await api.get('/kyc');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch KYC tokens');
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};