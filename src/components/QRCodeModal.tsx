import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { FiX, FiDownload, FiSmartphone, FiInfo } from 'react-icons/fi';
import PreviewScreen from './PreviewScreen';

interface QRCodeModalProps {
  isVisible: boolean;
  onClose: () => void;
  deviceType: 'iphone' | 'android';
  mockType: 'default' | 'spotify';
  prompt: string;
  snackUrl?: string;
  qrCodeUrl?: string;
  projectId?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ 
  isVisible, 
  onClose, 
  deviceType,
  mockType,
  prompt,
  snackUrl,
  qrCodeUrl,
  projectId
}) => {
  // Generate a preview URL or use the provided snackUrl
  const previewUrl = snackUrl || 'https://snack.expo.dev/your-project';
  
  // Use the provided QR code URL or the preview URL for the QR code
  const qrCodeValue = qrCodeUrl || previewUrl;

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
            className="relative bg-[#0a0a0a] rounded-2xl border border-neutral-800 max-w-4xl w-[90%] max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-black/50">
              <h3 className="text-white font-medium flex items-center">
                <FiSmartphone className="mr-2 text-blue-400" />
                Run on Device
              </h3>
              <button 
                className="p-1 rounded-full hover:bg-neutral-800 transition-colors"
                onClick={onClose}
              >
                <FiX className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 flex flex-col md:flex-row gap-8 items-center justify-center">
              {/* Phone Preview */}
              <div className="relative">
                {/* Subtle glow behind device */}
                <div className="absolute -inset-4 bg-gradient-to-b from-blue-500/10 to-purple-500/10 rounded-[40px] blur-xl opacity-70"></div>
                
                {/* Używamy komponentu PreviewScreen zamiast bezpośredniego renderowania */}
                <div className="scale-75">
                  <PreviewScreen 
                    prompt={prompt} 
                    mockType="default" 
                    selectedDevice={deviceType}
                    projectId={projectId}
                    snackUrl={snackUrl}
                  />
                </div>
              </div>
              
              {/* QR Code Section */}
              <div className="flex flex-col items-center p-4 bg-[#111] rounded-xl border border-neutral-800 max-w-sm">
                <h4 className="text-white font-medium mb-4">Scan to open on your device</h4>
                
                <div className="bg-white p-3 rounded-lg mb-4">
                  <QRCodeSVG 
                    value={qrCodeValue}
                    size={180}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"H"}
                    includeMargin={false}
                  />
                </div>
                
                <div className="text-xs text-neutral-400 mb-5 text-center">
                  Scan this QR code with your mobile device <br />to open this app in Expo Go
                </div>
                
                {snackUrl && (
                  <div className="text-xs text-blue-400 mb-5 text-center">
                    <a href={snackUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Or open in browser: {snackUrl.split('/').pop()}
                    </a>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    <FiDownload className="mr-2" />
                    Download QR
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                  >
                    <FiInfo className="mr-2" />
                    How to Run
                  </motion.button>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-black/30 p-4 border-t border-neutral-800 text-center text-xs text-neutral-500">
              Note: You need to have the Expo Go app installed on your device to view this preview
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal; 