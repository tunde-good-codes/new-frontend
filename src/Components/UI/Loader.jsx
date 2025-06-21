import React from 'react';

const Loader = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-4 border-t-transparent border-[#25C866] rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;
