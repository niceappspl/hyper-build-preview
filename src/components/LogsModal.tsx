import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface LogsModalProps {
  isVisible: boolean;
  onClose: () => void;
  logs: Array<{
    type: 'error' | 'info' | 'warning';
    message: string;
    timestamp: Date;
  }>;
}

const LogsModal: React.FC<LogsModalProps> = ({ isVisible, onClose, logs }) => {
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
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-black/50">
              <h3 className="text-white font-medium flex items-center">
                <FiInfo className="mr-2 text-blue-400" />
                Expo Logs
              </h3>
              <button 
                className="p-1 rounded-full hover:bg-neutral-800 transition-colors"
                onClick={onClose}
              >
                <FiX className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)] bg-black/30">
              {logs.length === 0 ? (
                <div className="text-center text-neutral-400 py-8">
                  No logs available
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        log.type === 'error' ? 'border-red-500/20 bg-red-500/5' :
                        log.type === 'warning' ? 'border-yellow-500/20 bg-yellow-500/5' :
                        'border-blue-500/20 bg-blue-500/5'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-1 rounded-full mr-2 ${
                          log.type === 'error' ? 'text-red-500' :
                          log.type === 'warning' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`}>
                          <FiAlertCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-white">{log.message}</div>
                          <div className="text-xs mt-1 opacity-60">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-black/30 p-4 border-t border-neutral-800">
              <div className="text-xs text-neutral-500 text-center">
                Logs are updated in real-time as your application runs
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogsModal; 