import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top',
  delay = 300 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleMouseEnter = () => {
    const id = window.setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) window.clearTimeout(timeoutId);
    setIsVisible(false);
  };

  // Position styles for the tooltip
  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return { bottom: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' };
      case 'bottom':
        return { top: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { right: 'calc(100% + 5px)', top: '50%', transform: 'translateY(-50%)' };
      case 'right':
        return { left: 'calc(100% + 5px)', top: '50%', transform: 'translateY(-50%)' };
      default:
        return { bottom: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' };
    }
  };

  // Animation variants based on position
  const getAnimationVariants = () => {
    switch (position) {
      case 'top':
        return {
          hidden: { opacity: 0, y: 5 },
          visible: { opacity: 1, y: 0 }
        };
      case 'bottom':
        return {
          hidden: { opacity: 0, y: -5 },
          visible: { opacity: 1, y: 0 }
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: 5 },
          visible: { opacity: 1, x: 0 }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: -5 },
          visible: { opacity: 1, x: 0 }
        };
      default:
        return {
          hidden: { opacity: 0, y: 5 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className="absolute whitespace-nowrap px-2 py-1 bg-black/90 backdrop-blur-sm text-white text-xs rounded shadow-lg border border-neutral-700 z-[99999]"
            style={getPositionStyles()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={getAnimationVariants()}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip; 