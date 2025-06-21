import React, { useEffect, useRef, useState } from 'react';
import snsWebSdk from '@sumsub/websdk';
import Modal from '../Components/UI/Modal'
import { toast } from 'react-toastify';

export default function KYCVerification() {
  const containerRef = useRef(null);
  const sdkInstanceRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to fetch a new access token from your backend
  const getNewAccessToken = async () => {
    const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!userToken) {
      setShowLoginModal(true);
      setLoading(false);
      throw new Error('No user token available');
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/kyc/token`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      throw new Error('Failed to fetch new access token');
    }

    return data.token;
  };

  // NEW: Function to save KYC status to backend
  const saveKycStatus = async (applicantId, statusData) => {
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        console.error('No user token available for saving KYC status');
        return;
      }

      const payload = {
        applicantId,
        statusData,
        timestamp: new Date().toISOString()
      };

      console.log('Saving KYC status to backend:', payload);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/kyc/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        console.log( result);
        toast.success('KYC verification status updated!');
      } else {
        console.error( result);
        toast.error('Failed to update KYC status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating KYC status');
    }
  };

  // Launch the SumSub WebSDK
  const launchWebSdk = async () => {
    try {
      setLoading(true);
      const token = await getNewAccessToken();
      const userToken = localStorage.getItem('token') || sessionStorage.getItem('token')
      const newToken = token || userToken
      const sdk = snsWebSdk
        .init(newToken, getNewAccessToken)
        .withConf({
          lang: 'en',
          theme: 'dark', // or 'dark'
        })
        .withOptions({
          addViewportTag: false,
          adaptIframeHeight: true,
        })
        .on('idCheck.onStepCompleted', (payload) => {
          console.log('Step completed:', payload);
        })
        .on('idCheck.onError', (error) => {
          console.error('SDK error:', error);
          toast.error(`KYC Error: ${error.message || JSON.stringify(error)}`);
        })
        // NEW: Handle applicant loaded event
        .on('idCheck.onApplicantLoaded', (payload) => {
          console.log('SDK message: idCheck.onApplicantLoaded', payload);
          // Store applicant ID for later use
          if (payload.applicantId) {
            sessionStorage.setItem('currentApplicantId', payload.applicantId);
          }
        })
        // NEW: Enhanced handling of status changes
        .on('idCheck.onApplicantStatusChanged', async (payload) => {
          console.log('SDK message: idCheck.onApplicantStatusChanged', payload);
          
          // Extract the applicant ID from session storage or payload
          const applicantId = sessionStorage.getItem('currentApplicantId') || payload.applicantId;
          
          if (applicantId && payload.reviewResult) {
            // Save the complete status data to backend
            await saveKycStatus(applicantId, {
              reviewId: payload.reviewId,
              attemptId: payload.attemptId,
              attemptCnt: payload.attemptCnt,
              levelName: payload.levelName,
              reviewStatus: payload.reviewStatus,
              reviewResult: payload.reviewResult,
              reviewDate: payload.reviewDate,
              createDate: payload.createDate,
              priority: payload.priority,
              reprocessing: payload.reprocessing,
              elapsedSincePendingMs: payload.elapsedSincePendingMs,
              elapsedSinceQueuedMs: payload.elapsedSinceQueuedMs
            });

            // Show user-friendly message based on status
            if (payload.reviewResult.reviewAnswer === 'GREEN') {
              toast.success('KYC Verification Completed Successfully! ✅');
            } else if (payload.reviewResult.reviewAnswer === 'RED') {
              toast.error('KYC Verification Failed. Please try again.');
            } else if (payload.reviewResult.reviewAnswer === 'YELLOW') {
              toast.warning('KYC Verification is under review.');
            }
          }
        })
        .onMessage((type, payload) => {
          console.log('SDK message:', type, payload);
        })
        .build();

      sdk.launch('#sumsub-websdk-container');
      sdkInstanceRef.current = sdk;
      setLoading(false);
    } catch (error) {
      console.error('KYC setup error:', error);
      setLoading(false);
      toast.error(`KYC Setup Error: ${error.message || error}`);
    }
  };

  useEffect(() => {
    launchWebSdk();

    // Cleanup on unmount
    return () => {
      if (sdkInstanceRef.current) {
        sdkInstanceRef.current.destroy();
        sdkInstanceRef.current = null;
      }
      // Clean up session storage
      sessionStorage.removeItem('currentApplicantId');
    };
  }, []);

  const handleLogin = () => {
    // Redirect to login page
    window.location.href = '/login'; // Update with your login route
  };

  const handleHome = () => {
    // Redirect to home page
    window.location.href = '/'; // Update with your home route
  };

  const handleClose = () => {
    setShowLoginModal(false);
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-800 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading KYC verification...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-800 min-h-screen">
      {showLoginModal ? (
        <Modal onClose={handleClose}>
          <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="mb-6">Please login first to complete your KYC verification.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={handleHome}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Home
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </div>
          </div>
        </Modal>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-4 text-white">KYC Verification</h2>
          <div
            ref={containerRef}
            id="sumsub-websdk-container"
            style={{ width: '100%', minHeight: '600px', background: 'white' }}
          ></div>
        </>
      )}
    </div>
  );
}