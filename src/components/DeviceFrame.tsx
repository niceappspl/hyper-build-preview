import React from 'react';
import { AVAILABLE_DEVICE_CONFIGS, calculateScaledDimensions } from '../config/DeviceConfig';
import { motion } from 'framer-motion';

interface DeviceFrameProps {
  children: React.ReactNode;
  device?: 'iphone' | 'android';
  scale?: number;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({ 
  children, 
  device = 'iphone',
  scale = 1.0 
}) => {
  // Pobranie konfiguracji urządzenia z konfiguracji
  const deviceConfig = AVAILABLE_DEVICE_CONFIGS[device];
  
  // Obliczenie wymiarów z uwzględnieniem skali
  const {
    deviceWidth,
    deviceHeight,
    contentWidth,
    contentHeight,
    contentTop,
    contentLeft
  } = calculateScaledDimensions(deviceConfig, scale);
  
  // Skalowanie promienia zaokrąglenia rogów
  const cornerRadius = deviceConfig.dimensions.cornerRadius * scale;
  
  return (
    <motion.div 
      className="relative flex items-center justify-center z-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient glow effect behind the device - usunięty */}
      
      {/* Zewnętrzna ramka telefonu */}
      <motion.div 
        className="relative bg-[#111] border-8 border-[#222] shadow-2xl overflow-hidden z-20"
        style={{ 
          width: `${deviceWidth}px`,
          height: `${deviceHeight}px`,
          borderRadius: `${cornerRadius}px`,
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {/* Device frame shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
        
        {/* Dynamic Island (tylko dla iPhone) */}
        {device === 'iphone' && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10">
            <div 
              className="rounded-b-2xl bg-black relative"
              style={{
                width: `${120 * scale}px`,
                height: `${30 * scale}px`,
              }}
            >
              {/* Subtle inner glow for Dynamic Island */}
              <div className="absolute inset-1 rounded-b-2xl bg-gradient-to-r from-[#222]/20 via-[#333]/10 to-[#222]/20"></div>
            </div>
          </div>
        )}
        
        {/* Container na zawartość */}
        <div 
          className="absolute overflow-hidden bg-black"
          style={{
            top: `${contentTop}px`,
            left: `${contentLeft}px`,
            width: `${contentWidth}px`,
            height: `${contentHeight}px`,
            borderRadius: `${cornerRadius * 0.9}px`,
          }}
        >
          {/* Screen reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none"></div>
          
          {/* Actual content */}
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
        </div>
        
        {/* Home Indicator */}
        {device === 'iphone' && (
          <div 
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 rounded-full bg-white/30"
            style={{ width: `${120 * scale}px` }}
          ></div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DeviceFrame; 