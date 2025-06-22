import React, { useEffect, useRef, useState } from 'react';
import snsWebSdk from '@sumsub/websdk';
import Modal from '../Components/UI/Modal';
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
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      throw new Error('Failed to fetch new access token');
    }

    return data.token;
  };

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
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/kyc/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result);
        toast.success('KYC verification status updated!');
      } else {
        console.error(result);
        toast.error('Failed to update KYC status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating KYC status');
    }
  };

  const launchWebSdk = async () => {
    try {
      setLoading(true);
      const token = await getNewAccessToken();

      if (!containerRef.current) {
        console.error('KYC container not found in DOM');
        toast.error('KYC container not available. Please refresh.');
        setLoading(false);
        return;
      }

      const sdk = snsWebSdk
        .init(token, getNewAccessToken)
        .withConf({
          lang: 'en',
          theme: 'dark',
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
        .on('idCheck.onApplicantLoaded', (payload) => {
          console.log('Applicant Loaded:', payload);
          if (payload.applicantId) {
            sessionStorage.setItem('currentApplicantId', payload.applicantId);
          }
        })
        .on('idCheck.onApplicantStatusChanged', async (payload) => {
          console.log('Status Changed:', payload);
          const applicantId = sessionStorage.getItem('currentApplicantId') || payload.applicantId;

          if (applicantId && payload.reviewResult) {
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
              elapsedSinceQueuedMs: payload.elapsedSinceQueuedMs,
            });

            const answer = payload.reviewResult.reviewAnswer;
            if (answer === 'GREEN') toast.success('KYC Completed ✅');
            else if (answer === 'RED') toast.error('KYC Failed ❌');
            else if (answer === 'YELLOW') toast.warning('KYC Under Review ⚠️');
          }
        })
        .onMessage((type, payload) => {
          console.log('SDK message:', type, payload);
        })
        .build();

      sdk.launch(containerRef.current);
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

    return () => {
      if (sdkInstanceRef.current) {
        sdkInstanceRef.current.destroy();
        sdkInstanceRef.current = null;
      }
      sessionStorage.removeItem('currentApplicantId');
    };
  }, []);

  const handleLogin = () => (window.location.href = '/login');
  const handleHome = () => (window.location.href = '/');
  const handleClose = () => setShowLoginModal(false);

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
              <button onClick={handleClose} className="px-4 py-2 border rounded-md hover:bg-gray-50">Close</button>
              <button onClick={handleHome} className="px-4 py-2 border rounded-md hover:bg-gray-50">Home</button>
              <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Login</button>
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
