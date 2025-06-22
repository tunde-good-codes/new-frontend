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
    console.error('KYC ErrorBoundary caught:', error, errorInfo);
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
  const initializedRef = useRef(false);
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

    if (!res.ok) throw new Error('Failed to fetch access token');
    return (await res.json()).token;
  };

  const saveKycStatus = async (applicantId, statusData) => {
    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) return;

      await fetch(`${import.meta.env.VITE_API_URL}/kyc/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          applicantId,
          statusData,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to save KYC status:', error);
    }
  };

  const launchWebSdk = async () => {
    try {
      setLoading(true);
      setInitError(null);

      // 1. Ensure container exists and is visible
      await new Promise(resolve => {
        const checkContainer = () => {
          if (containerRef.current && document.contains(containerRef.current)) {
            resolve();
          } else {
            requestAnimationFrame(checkContainer);
          }
        };
        checkContainer();
      });

      // 2. Force container visibility (production-safe)
      Object.assign(containerRef.current.style, {
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      });

      // 3. Initialize SDK
      const token = await getNewAccessToken();
      const sdk = snsWebSdk
        .init(token, getNewAccessToken)
        .withConf({ lang: 'en', theme: 'dark' })
        .withOptions({ addViewportTag: false, adaptIframeHeight: true })
        .on('idCheck.onError', (error) => {
          toast.error(`KYC Error: ${error.message || 'Unknown error'}`);
        })
        .on('idCheck.onApplicantLoaded', (payload) => {
          if (payload.applicantId) {
            sessionStorage.setItem('currentApplicantId', payload.applicantId);
          }
        })
        .on('idCheck.onApplicantStatusChanged', async (payload) => {
          if (payload.reviewResult) {
            await saveKycStatus(
              payload.applicantId,
              payload
            );
            // Handle status toasts here
          }
        })
        .build();

      sdk.launch(containerRef.current);
      sdkInstanceRef.current = sdk;
      setLoading(false);
    } catch (error) {
      console.error('KYC initialization failed:', error);
      setInitError(error.message);
      setLoading(false);
    }
  };

  // Initialization effect with cleanup
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      await launchWebSdk();
    };

    // Start initialization on next tick
    const timer = setTimeout(init, 0);

    return () => {
      clearTimeout(timer);
      if (sdkInstanceRef.current) {
        sdkInstanceRef.current.destroy();
      }
      sessionStorage.removeItem('currentApplicantId');
    };
  }, []);

  // UI Handlers
  const handleRetry = () => launchWebSdk();
  const handleLogin = () => window.location.assign('/login');
  const handleHome = () => window.location.assign('/');

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
          <p className="mb-4">Error: {initError}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry KYC Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="p-4 bg-blue-800 min-h-screen">
        {showLoginModal ? (
          <Modal onClose={() => setShowLoginModal(false)}>
            <div className="bg-white p-6 rounded-lg max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">Login Required</h2>
              <div className="flex justify-end space-x-3">
                <button onClick={handleHome} className="px-4 py-2 border rounded-md">
                  Home
                </button>
                <button 
                  onClick={handleLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
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
              style={{
                width: '100%',
                minHeight: '600px',
                background: 'white'
              }}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}