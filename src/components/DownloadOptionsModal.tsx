import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiSmartphone } from 'react-icons/fi';
import { FaAndroid, FaApple } from 'react-icons/fa';

interface DownloadOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  prompt: string;
}

const DownloadOptionsModal: React.FC<DownloadOptionsModalProps> = ({ 
  isVisible, 
  onClose, 
  prompt 
}) => {
  const handleDownload = (platform: 'ios' | 'android') => {
    // In a real app, this would initiate the download process
    console.log(`Downloading for ${platform}`, prompt);
    // Simulate download initiation
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="relative bg-[#0a0a0a] rounded-2xl border border-neutral-800 max-w-md w-[90%] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-black/50">
              <h3 className="text-white font-medium flex items-center">
                <FiDownload className="mr-2 text-blue-400" />
                Download Application
              </h3>
              <button 
                className="p-1 rounded-full hover:bg-neutral-800 transition-colors"
                onClick={onClose}
              >
                <FiX className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-neutral-300 text-sm mb-6">
                Choose a platform to download the application for:
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.button 
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload('ios')}
                  className="flex flex-col items-center justify-center p-6 bg-[#131313] rounded-xl hover:bg-[#161616] transition-all border border-neutral-800 group relative"
                >
                  {/* Glow behind button */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <FaApple className="w-10 h-10 mb-3 text-white group-hover:text-blue-300" />
                    <span className="text-sm font-medium">iOS App</span>
                  </div>
                </motion.button>
                
                <motion.button 
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDownload('android')}
                  className="flex flex-col items-center justify-center p-6 bg-[#131313] rounded-xl hover:bg-[#161616] transition-all border border-neutral-800 group relative"
                >
                  {/* Glow behind button */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-green-500/30 to-teal-500/30 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <FaAndroid className="w-10 h-10 mb-3 text-white group-hover:text-green-300" />
                    <span className="text-sm font-medium">Android App</span>
                  </div>
                </motion.button>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4 text-xs text-neutral-400">
                <p className="flex items-start mb-2">
                  <FiSmartphone className="w-4 h-4 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                  <span>The downloaded app will be ready to install on your device. No additional setup required.</span>
                </p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-black/30 p-4 border-t border-neutral-800 flex justify-between items-center">
              <span className="text-xs text-neutral-500">
                v1.0.0
              </span>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
              >
                <FiDownload className="mr-2" />
                Download Both
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DownloadOptionsModal; 