import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiInfo, FiServer, FiCloud, FiCloudOff, FiPackage, FiDownload } from 'react-icons/fi';

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
  const [activeTab, setActiveTab] = useState<'logs' | 'pwa'>('logs');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Symulowane informacje o PWA
  const pwaInfo = {
    serviceWorker: {
      status: 'active',
      version: '1.0.0',
      lastUpdated: new Date().toLocaleString(),
      cacheSize: '2.4 MB'
    },
    manifest: {
      name: 'Hyper Build PWA',
      shortName: 'HBPWA',
      icons: 2,
      themeColor: '#4285f4',
      display: 'standalone'
    },
    storage: {
      persistent: true,
      quota: '50 MB',
      used: '3.2 MB'
    },
    appInstalled: true,
    caching: {
      strategy: 'network-first',
      assets: 24,
      totalCached: '1.8 MB'
    }
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
            className="relative bg-[#0a0a0a] rounded-2xl border border-neutral-800 max-w-4xl w-[90%] max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tabs */}
            <div className="flex border-b border-neutral-800 bg-black/50">
              <button
                className={`px-4 py-3 text-sm flex items-center ${
                  activeTab === 'logs' 
                    ? 'text-white border-b-2 border-blue-500 font-medium' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                onClick={() => setActiveTab('logs')}
              >
                <FiInfo className="mr-2" />
                Expo Logs
              </button>
              <button
                className={`px-4 py-3 text-sm flex items-center ${
                  activeTab === 'pwa' 
                    ? 'text-white border-b-2 border-blue-500 font-medium' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                onClick={() => setActiveTab('pwa')}
              >
                <FiServer className="mr-2" />
                PWA Status
              </button>
              <div className="ml-auto flex items-center pr-2">
                <button 
                  className="p-1 rounded-full hover:bg-neutral-800 transition-colors"
                  onClick={onClose}
                >
                  <FiX className="w-5 h-5 text-neutral-400" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] bg-black/30">
              {activeTab === 'logs' ? (
                // Logs content
                <div className="p-4">
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
              ) : (
                // PWA status content
                <div className="p-6">
                  {/* Online status indicator */}
                  <div className="mb-6 flex justify-center">
                    <div className={`px-4 py-2 rounded-full flex items-center ${
                      isOnline 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {isOnline ? (
                        <>
                          <FiCloud className="mr-2" />
                          <span>Online - PWA is fully functional</span>
                        </>
                      ) : (
                        <>
                          <FiCloudOff className="mr-2" />
                          <span>Offline - Cached assets available</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Service Worker Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#111] rounded-xl border border-neutral-800 p-4">
                      <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                        <FiServer className="w-4 h-4 mr-2 text-blue-400" />
                        Service Worker
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Status:</span>
                          <span className="text-green-500">Active</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Version:</span>
                          <span className="text-white">{pwaInfo.serviceWorker.version}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Last Updated:</span>
                          <span className="text-white">{pwaInfo.serviceWorker.lastUpdated}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Cache Size:</span>
                          <span className="text-white">{pwaInfo.serviceWorker.cacheSize}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Manifest Info */}
                    <div className="bg-[#111] rounded-xl border border-neutral-800 p-4">
                      <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                        <FiPackage className="w-4 h-4 mr-2 text-purple-400" />
                        Web Manifest
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Name:</span>
                          <span className="text-white">{pwaInfo.manifest.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Short Name:</span>
                          <span className="text-white">{pwaInfo.manifest.shortName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Icons:</span>
                          <span className="text-white">{pwaInfo.manifest.icons} icons</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-400">Display:</span>
                          <span className="text-white">{pwaInfo.manifest.display}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Installation Status */}
                  <div className="bg-[#111] rounded-xl border border-neutral-800 p-4 mb-4">
                    <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                      <FiDownload className="w-4 h-4 mr-2 text-cyan-400" />
                      App Installation
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Status:</span>
                        <span className="text-green-500">Ready to install</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-400">Install Method:</span>
                        <span className="text-white">Browser prompt or Add to Home Screen</span>
                      </div>
                      <div className="text-xs text-neutral-500 mt-2 p-2 bg-black/50 rounded-md">
                        To test PWA installation, use Chrome or Safari mobile and select "Add to Home Screen"
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-black/30 p-4 border-t border-neutral-800">
              <div className="text-xs text-neutral-500 text-center">
                {activeTab === 'logs' 
                  ? 'Logs are updated in real-time as your application runs'
                  : 'PWA status information helps debug service worker and offline functionality'}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogsModal; 