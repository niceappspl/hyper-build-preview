import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronRight } from 'react-icons/fi';

interface DeviceSelectorProps {
  selectedDevice: 'iphone' | 'android';
  onChange: (device: 'iphone' | 'android') => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ selectedDevice, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeviceChange = (device: 'iphone' | 'android') => {
    onChange(device);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <motion.button 
        whileHover={{ y: -1 }}
        whileTap={{ y: 0 }}
        className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#111] hover:bg-[#181818] rounded-lg text-xs text-white border border-neutral-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedDevice === 'iphone' ? 'iPhone' : 'Android'}</span>
        <FiChevronRight className={`w-2.5 h-2.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </motion.button>
      
      {isOpen && (
        <div 
          className="absolute top-full mt-1 right-0 bg-[#111] border border-neutral-800 rounded-lg shadow-xl w-40 z-[9999] overflow-hidden"
          style={{ filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.4))' }}
        >
          <motion.button 
            className={`w-full text-left px-3 py-1.5 text-xs ${selectedDevice === 'iphone' ? 'bg-blue-500/20 text-white' : 'text-neutral-300 hover:bg-[#181818]'}`}
            onClick={() => handleDeviceChange('iphone')}
          >
            iPhone
          </motion.button>
          <motion.button 
            className={`w-full text-left px-3 py-1.5 text-xs ${selectedDevice === 'android' ? 'bg-blue-500/20 text-white' : 'text-neutral-300 hover:bg-[#181818]'}`}
            onClick={() => handleDeviceChange('android')}
          >
            Android
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default DeviceSelector; 