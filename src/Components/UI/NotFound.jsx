import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#252E75] to-[#42c842] p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center animate-fade-in">
        <h1 className="text-9xl font-bold text-[#252E75] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#252E75] mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-[#42c842] mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-[#252E75] text-white rounded-lg hover:bg-[#42c842] transition-colors duration-300"
          >
            <FaHome className="mr-2" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-6 py-3 bg-[#42c842] text-[#252E75] rounded-lg hover:bg-[#25C866] transition-colors duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
