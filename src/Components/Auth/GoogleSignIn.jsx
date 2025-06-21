import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleSignIn = ({ buttonText = "Continue with Google", onSuccess, onError }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
        token: credentialResponse.credential,
        role: 'user' // Default role
      });

      // Handle successful authentication
      localStorage.setItem('token', response.data.token);
      
      if (onSuccess) {
        onSuccess(response.data.user);
      } else {
        navigate('/dashboard'); 
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    console.error('Google Sign-In Error:', error);
    if (onError) {
      onError(error);
    } else {
      alert('Google login failed. Please try again.');
    }
  };

  return (
    <div className="google-signin-container">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => handleError(new Error('Google login failed'))}
        useOneTap
        text={buttonText}
        shape="rectangular"
        size="medium"
        width="300"
      />
      
      <style>{`
        .google-signin-container {
          margin: 15px 0;
          display: flex;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default GoogleSignIn;