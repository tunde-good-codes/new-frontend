import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const Notification = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-[#42c842] border-[#25C866] text-white',
    error: 'bg-[#FF5C8D] border-[#FF3E4A] text-white',
    warning: 'bg-[#FBBF24] border-[#D97706] text-[#252E75]',
    info: 'bg-[#3B82F6] border-[#2563EB] text-white',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`fixed top-4 right-4 z-50 border rounded-lg px-6 py-4 ${bgColor[type]} shadow-lg max-w-sm`}
        >
          <div className="flex items-center justify-between">
            <span className="block sm:inline">{message}</span>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose();
              }}
              className="ml-2 text-lg text-white hover:text-gray-300"
            >
              <IoClose />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification;
