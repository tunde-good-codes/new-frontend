import React, { useEffect, useRef, useState } from 'react';
import snsWebSdk from '@sumsub/websdk';
import Modal from '../Components/UI/Modal';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-blue-800 min-h-screen flex items-center justify-center">
          <div className="text-white bg-red-500 p-4 rounded">
            KYC verification failed to load. Please refresh the page.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function KYCVerification() {
  const containerRef = useRef(null);
  const sdkInstanceRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);

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
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/kyc/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload)
      });


      if (response.ok) {
        toast.success('KYC verification status updated!');
      } else {
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
      setInitError(null);

      // Ensure container exists
      if (!containerRef.current) {
        throw new Error('Container element not found');
      }

      const token = await getNewAccessToken();
      const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      const newToken = token || userToken;

      console.log('Before SDK init - container exists?', !!containerRef.current);

      const sdk = snsWebSdk
        .init(newToken, getNewAccessToken)
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
          console.log('SDK message: idCheck.onApplicantLoaded', payload);
          if (payload.applicantId) {
            sessionStorage.setItem('currentApplicantId', payload.applicantId);
          }
        })
        .on('idCheck.onApplicantStatusChanged', async (payload) => {
          console.log('SDK message: idCheck.onApplicantStatusChanged', payload);
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
              elapsedSinceQueuedMs: payload.elapsedSinceQueuedMs
            });

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

      console.log('After SDK init - before launch');
      sdk.launch(containerRef.current); // Use ref directly instead of selector
      sdkInstanceRef.current = sdk;
      console.log('After SDK launch');
      setLoading(false);
    } catch (error) {
      console.error('KYC setup error:', error);
      setLoading(false);
      setInitError(error.message);
      toast.error(`KYC Setup Error: ${error.message || error}`);
    }
  };

  useEffect(() => {
    const initSdk = async () => {
      await launchWebSdk();
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      initSdk();
    });

    return () => {
      if (sdkInstanceRef.current) {
        sdkInstanceRef.current.destroy();
        sdkInstanceRef.current = null;
      }
      sessionStorage.removeItem('currentApplicantId');
    };
  }, []);

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  const handleClose = () => {
    setShowLoginModal(false);
  };

  const handleRetry = () => {
    launchWebSdk();
  };

  if (loading) {
    return (
      <div className="p-4 bg-blue-800 min-h-screen flex items-center justify-center">
        <div className="text-white">Loading KYC verification...</div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="p-4 bg-blue-800 min-h-screen flex items-center justify-center">
        <div className="text-white bg-red-500 p-4 rounded max-w-md text-center">
          <p className="mb-4">Failed to initialize KYC verification: {initError}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
              className="sumsub-container"
              style={{
                width: '100%',
                minHeight: '600px',
                background: 'white',
                display: 'block'
              }}
            ></div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}