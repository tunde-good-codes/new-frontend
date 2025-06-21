import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  loginUser,
  registerUser,
  logoutUser,
  resetPassword,
} from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const checkAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // Check if both exist and are valid
    if (!token || !userStr || userStr === 'undefined' || token === 'undefined') {
      return false;
    }
    
    // Try to parse user data
    let user;
    try {
      user = JSON.parse(userStr);
    } catch (parseError) {
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return false;
    }
    
    // Validate user data
    if (!user || !user._id) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return false;
    }
    
    // Set auth header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    return true;
    
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

  useEffect(() => {
 checkAuth();
    setLoading(false);
  }, []);


const login = async (email, password) => {
  try {
    setLoading(true);
    setError(null); // Clear previous errors
    
    const { user: loggedInUser, token } = await loginUser(email, password);
    
    // Validate received data
    if (!loggedInUser || !token) {
      throw new Error('Invalid response from server');
    }
    
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
    return { success: true };
    
  } catch (err) {
    console.error('Login context error:', err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};

const register = async (userData) => {
  try {
    setLoading(true);
    const result = await registerUser(userData);

    if (result.requiresVerification) {
      return {
        success: true,
        requiresVerification: true,
        email: userData.email,
        message: result.message,
      };
    }


    return { success: true };
  } catch (err) {
    setError(err.message);
    return { success: false, message: err.message };
  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      navigate('/login');
      window.location.reload(); // Reload the page to reset the state
    } catch (err) {
      setError(err.message);
    }
  };

const resetPass = async (email, newPassword, token) => {
  try {
    setLoading(true);
    const response = await resetPassword(email, newPassword, token);
        if (!token) {
      return { 
        success: true,
        message: 'Password reset link has been sent to your email'
      };
    }
    return {
      success: true,
      token: response.token,
      user: response.user
    };
  } catch (err) {
    return { 
      success: false, 
      message: err.message 
    };
  } finally {
    setLoading(false);
  }
};

  // Update the profile data
  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/auth/updatedetails', profileData);  // PUT request to update user profile
      const updatedUser = response.data.data;

      // Update the user in the context
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));  // Update user in local storage

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        login,
        register,
        logout,
        resetPass,
        updateUserProfile,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};