import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiExternalLink, FiCopy } from 'react-icons/fi';
import Tooltip from './Tooltip';
import PreviewScreen from './PreviewScreen';

interface FullScreenPreviewProps {
  isVisible: boolean;
  onClose: () => void;
  deviceType: 'iphone' | 'android';
  mockType: 'default' | 'spotify';
  prompt: string;
  projectId?: string;
  snackUrl?: string;
}

const FullScreenPreview: React.FC<FullScreenPreviewProps> = ({ 
  isVisible, 
  onClose, 
  deviceType,
  mockType,
  prompt,
  projectId,
  snackUrl
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close button - umieszczamy na najwyższym poziomie, poza kontenerem */}
          <motion.button 
            className="fixed top-6 right-6 p-3 rounded-full bg-black/70 hover:bg-black/90 border border-neutral-700 transition-colors z-[10001] text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClose}
            aria-label="Close preview"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="w-6 h-6" />
          </motion.button>
          
          <motion.div 
            className="relative max-w-7xl w-[95%] h-[90vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tools panel */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-40">
              <Tooltip content="Download Screenshot" position="right">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 border border-neutral-700 text-white flex items-center justify-center"
                >
                  <FiDownload className="w-5 h-5" />
                </motion.button>
              </Tooltip>
              
              <Tooltip content="Open External Preview" position="right">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 border border-neutral-700 text-white flex items-center justify-center"
                >
                  <FiExternalLink className="w-5 h-5" />
                </motion.button>
              </Tooltip>
              
              <Tooltip content="Copy Share Link" position="right">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-black/50 hover:bg-black/70 border border-neutral-700 text-white flex items-center justify-center"
                >
                  <FiCopy className="w-5 h-5" />
                </motion.button>
              </Tooltip>
            </div>
            
            {/* Fancy background effects */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Gradient backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent"></div>
              
              {/* Gradient orbs - subtle glow */}
              <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/20 to-blue-700/20 rounded-full blur-[120px] opacity-30"></div>
              <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/20 to-cyan-500/20 rounded-full blur-[120px] opacity-30"></div>
              
              {/* Grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>
            
            {/* Device Preview - Centered */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative z-10"
            >
              {/* Glow effect behind the device */}
              <div className="absolute -inset-12 bg-gradient-to-b from-blue-500/10 to-purple-500/10 rounded-[100px] blur-2xl opacity-50"></div>
              
              {/* Używamy komponentu PreviewScreen zamiast bezpośredniego renderowania */}
              <PreviewScreen 
                prompt={prompt} 
                mockType="default" 
                selectedDevice={deviceType}
                projectId={projectId}
                snackUrl={snackUrl}
              />
            </motion.div>
            
            {/* Caption */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-neutral-400 text-sm">
              {deviceType === 'iphone' ? 'iPhone' : 'Android'} Preview | {prompt}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenPreview; 