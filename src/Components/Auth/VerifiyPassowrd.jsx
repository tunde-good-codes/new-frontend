import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);

const hasRequested = useRef(false);

useEffect(() => {
  const verifyEmail = async () => {
    if (hasRequested.current) return;
    hasRequested.current = true;

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`
      );
      if (res.data.success) {
        setVerified(true);
        toast.success("Email verified successfully!");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  verifyEmail();
}, [token, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        {loading ? (
          <div className="text-blue-600 font-semibold animate-pulse">Verifying...</div>
        ) : error ? (
          <div className="text-red-600 font-semibold">{error}</div>
        ) : verified ? (
          <div className="text-green-600 font-semibold">
            Email verified! Redirecting to homepage...
          </div>
        ) : (
          <div className="text-gray-700">Invalid or expired verification link.</div>
        )}
      </div>
    </div>
  );
}
