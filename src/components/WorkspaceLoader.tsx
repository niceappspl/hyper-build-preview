import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkspaceLoaderProps {
  isLoading: boolean;
  buildProgress: number;
  prompt: string;
}

const WorkspaceLoader: React.FC<WorkspaceLoaderProps> = ({ 
  isLoading,
  buildProgress,
  prompt
}) => {
  // Referencja do kontenera konsoli dla automatycznego scrollowania
  const consoleRef = useRef<HTMLDivElement>(null);
  
  // State to track visible log messages
  const [visibleLogs, setVisibleLogs] = useState<number>(0);
  
  // All possible log messages
  const allLogs = useMemo(() => {
    const logs = [
      { type: 'header', text: '// Setting up development environment' },
      { type: 'log', text: 'Initializing iOS simulator for iPhone 15 Pro...' },
      { type: 'log', text: 'Configuring Xcode build tools...' },
      { type: 'log', text: 'Setting up Swift compiler version 5.9...' },
      { type: 'log', text: 'Installing iOS SDK 17.4...' },
      { type: 'log', text: 'Checking device compatibility...' },
      
      { type: 'header', text: '// Preparing Android environment' },
      { type: 'log', text: 'Setting up Android SDK tools...' },
      { type: 'log', text: 'Configuring Pixel 7 emulator...' },
      { type: 'log', text: 'Installing Android Platform Tools 34.0.5...' },
      { type: 'log', text: 'Setting up Gradle 8.2...' },
      { type: 'log', text: 'Configuring device profiles...' },
      
      { type: 'header', text: '// Installing dependencies' },
      { type: 'log', text: 'Installing React Native 0.73.2...' },
      { type: 'log', text: 'Setting up Metro bundler...' },
      { type: 'log', text: 'Installing React Native Navigation...' },
      { type: 'log', text: 'Installing React Native Reanimated...' },
      { type: 'log', text: 'Setting up native modules...' },
      { type: 'log', text: 'Configuring native bindings...' },
      { type: 'log', text: 'Setting up TensorFlow Lite...' },
      { type: 'log', text: 'Installing image processing libraries...' },
      
      { type: 'header', text: '// Configuring build pipeline' },
      { type: 'log', text: 'Setting up CI/CD workflow...' },
      { type: 'log', text: 'Configuring app signing certificates...' },
      { type: 'log', text: 'Generating development provisioning profiles...' },
      { type: 'log', text: 'Setting up Fastlane integration...' },
      { type: 'log', text: 'Creating build scripts...' },
      
      { type: 'success', text: '✓ iOS environment ready' },
      { type: 'success', text: '✓ Android environment ready' },
      { type: 'success', text: '✓ Dependencies installed' },
      { type: 'success', text: '✓ Build pipeline configured' },
      
      { type: 'header', text: '// Preparing workspace' },
      { type: 'log', text: 'Configuring hot reload...' },
      { type: 'log', text: 'Setting up debugging tools...' },
      { type: 'log', text: 'Preparing React DevTools integration...' },
      { type: 'log', text: 'Configuring Flipper for debugging...' },
      { type: 'log', text: 'Setting up source maps...' },
      { type: 'log', text: 'Installing performance monitoring...' },
      { type: 'log', text: 'Setting up crash analytics...' },
    ];
    
    // Add prompt-specific logs if prompt exists
    if (prompt) {
      logs.push(
        { type: 'header', text: '// Creating project based on prompt' },
        { type: 'log', text: `Analyzing: "${prompt.substring(0, 80)}${prompt.length > 80 ? '...' : ''}"` },
        { type: 'log', text: 'Identifying required components...' },
        { type: 'log', text: 'Generating UI components...' },
        { type: 'log', text: 'Creating navigation structure...' },
        { type: 'log', text: 'Setting up state management...' },
        { type: 'log', text: 'Implementing API integrations...' },
        { type: 'log', text: 'Creating data models...' },
        { type: 'log', text: 'Setting up authentication flows...' },
        { type: 'log', text: 'Configuring offline capabilities...' },
        { type: 'log', text: 'Implementing dark/light mode support...' },
        { type: 'log', text: 'Setting up localization...' },
      );
    }
    
    return logs;
  }, [prompt]);
  
  // Increment visible logs based on build progress
  useEffect(() => {
    if (isLoading) {
      // Calculate how many logs should be visible based on progress
      const totalLogs = allLogs.length;
      const logsToShow = Math.ceil((buildProgress / 100) * totalLogs);
      
      // Add logs incrementally with a minimal delay between each
      const timer = setInterval(() => {
        setVisibleLogs(prev => {
          if (prev < logsToShow) {
            return prev + 1;
          } else {
            clearInterval(timer);
            return prev;
          }
        });
      }, 50); // Znacznie szybsza częstotliwość aktualizacji (zmniejszone z 150ms)
      
      return () => clearInterval(timer);
    } else {
      setVisibleLogs(0);
    }
  }, [buildProgress, isLoading, allLogs.length]);
  
  // Blokowanie scrollowania body gdy loader jest aktywny
  useEffect(() => {
    if (isLoading) {
      // Zapisz obecny stan overflow
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Zablokuj scrollowanie
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Przywróć pierwotny stan overflow gdy komponent się odmontuje lub isLoading=false
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLoading]);
  
  // Automatyczne scrollowanie w dół gdy pojawiają się nowe elementy
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [visibleLogs]); // Scrolluj przy zmianie liczby widocznych logów
  
  // Render log message with appropriate styling
  const renderLogMessage = (log: { type: string; text: string }, index: number) => {
    switch (log.type) {
      case 'header':
        return <p key={index} className="mb-2 text-blue-400 font-semibold mt-5">{log.text}</p>;
      case 'success':
        return <p key={index} className="mb-1.5 text-green-400 mt-5">{log.text}</p>;
      default:
        return <p key={index} className="mb-1.5">{log.text}</p>;
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-4xl px-8">
            <motion.div 
              className="mb-10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white mb-3">Preparing your workspace</h2>
              <p className="text-gray-400 text-lg">HyperBuild is generating your app components...</p>
            </motion.div>
            
            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden mb-4">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: "0%" }}
                animate={{ width: `${buildProgress}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </div>
            
            <div className="text-right text-sm text-gray-400 mb-10">
              {Math.round(buildProgress)}% complete
            </div>
            
            <div 
              ref={consoleRef}
              className="bg-[#0a0a0a] border border-[#222] rounded-xl p-6 font-mono text-sm text-gray-400 h-[450px] overflow-auto shadow-2xl"
            >
              <div>
                {allLogs.slice(0, visibleLogs).map((log, index) => renderLogMessage(log, index))}
                <span className="inline-block h-4 w-2 bg-gray-400 animate-blink ml-1"></span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorkspaceLoader; 