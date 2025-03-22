import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDownload, FiExternalLink, FiCopy } from 'react-icons/fi';
import SpotifyMock from '../mocks/SpotifyMock';
import Tooltip from './Tooltip';

interface FullScreenPreviewProps {
  isVisible: boolean;
  onClose: () => void;
  deviceType: 'iphone' | 'android';
  mockType: 'default' | 'spotify';
  prompt: string;
}

const FullScreenPreview: React.FC<FullScreenPreviewProps> = ({ 
  isVisible, 
  onClose, 
  deviceType,
  mockType,
  prompt 
}) => {
  // Definiujemy rzeczywiste proporcje iPhone'a
  const iphoneWidth = 393;
  const iphoneHeight = 852;
  
  // Ustalamy skalę dla interfejsu - większa skala dla lepszej widoczności
  const scale = 0.8; 
  const deviceWidth = iphoneWidth * scale;
  const deviceHeight = iphoneHeight * scale;
  
  // Obliczamy marginesy dla zawartości
  const contentMarginX = deviceWidth * 0.05;
  const contentMarginTop = deviceWidth * 0.06;
  const contentMarginBottom = deviceWidth * 0.07;
  const contentWidth = deviceWidth - (contentMarginX * 2);
  const contentHeight = deviceHeight - contentMarginTop - contentMarginBottom;

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
          <motion.div 
            className="relative max-w-7xl w-[95%] h-[90vh] flex flex-col items-center justify-center rounded-2xl overflow-hidden"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Tooltip content="Close Preview" position="left">
              <button 
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 border border-neutral-700 transition-colors z-50"
                onClick={onClose}
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </Tooltip>
            
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
              
              {/* Device Frame */}
              <div className="relative" style={{ width: `${deviceWidth}px`, height: `${deviceHeight}px` }}>
                {/* Phone Frame */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  <img 
                    src="/frames/iphone.svg" 
                    alt="Device frame" 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {/* Phone Content */}
                <div className="absolute z-0 rounded-[30px] overflow-hidden" style={{ 
                  top: `${contentMarginTop}px`, 
                  left: `${contentMarginX}px`, 
                  width: `${contentWidth}px`, 
                  height: `${contentHeight}px`
                }}>
                  {mockType === 'spotify' && (
                    <div className="w-full h-full relative">
                      <SpotifyMock containerStyle={{ position: 'relative', height: '100%', overflow: 'hidden' }} />
                    </div>
                  )}
                </div>
              </div>
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