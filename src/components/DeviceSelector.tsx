import React from 'react';
import { motion } from 'framer-motion';
import { FiSmartphone } from 'react-icons/fi';

interface DeviceSelectorProps {
  selectedDevice: 'iphone' | 'android';
  onChange: (device: 'iphone' | 'android') => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ selectedDevice, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <motion.button 
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs border ${
          selectedDevice === 'iphone' 
            ? 'bg-blue-500/30 text-white border-blue-500/50' 
            : 'bg-[#111] hover:bg-[#181818] text-neutral-300 border-neutral-800'
        }`}
        onClick={() => onChange('iphone')}
        aria-pressed={selectedDevice === 'iphone'}
      >
        <FiSmartphone className="mr-1.5 text-blue-400" /> iPhone
      </motion.button>
      
      <motion.button 
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        className={`flex items-center px-2.5 py-1.5 rounded-lg text-xs border ${
          selectedDevice === 'android' 
            ? 'bg-green-500/30 text-white border-green-500/50' 
            : 'bg-[#111] hover:bg-[#181818] text-neutral-300 border-neutral-800'
        }`}
        onClick={() => onChange('android')}
        aria-pressed={selectedDevice === 'android'}
      >
        <FiSmartphone className="mr-1.5 text-green-400" /> Android
      </motion.button>
    </div>
  );
};

export default DeviceSelector; 