import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Snack } from 'snack-sdk';
import { SDKVersion } from 'snack-content';

/**
 * Expo Preview Page for Custom Code Rendering
 * 
 * This page is designed to render React Native code passed via URL or API
 * It uses the Snack SDK to create a live preview of the code
 *
 * Usage:
 * 1. Direct URL with code parameter: /expo-preview?code=console.log('Hello')
 * 2. API endpoint usage: POST to your backend and redirect to this page
 */
const ExpoPreviewPage: React.FC = () => {
  const location = useLocation();
  const webPreviewRef = useRef<Window | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snack, setSnack] = useState<any>(null);
  const [customCode, setCustomCode] = useState<string | null>(null);
  const [dependencies, setDependencies] = useState<Record<string, { version: string }>>({
    'expo-linear-gradient': { version: '~12.3.0' },
    'expo-blur': { version: '~12.4.1' }
  });
  
  // Default code for React Native
  const defaultCode = `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>HyperBuild Preview</Text>
      <Text style={styles.subtitle}>Pass your code via URL or API to see it here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  text: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
});`;

  // Parse URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Check for code parameter in URL (base64 encoded or plain)
    const codeParam = searchParams.get('code');
    if (codeParam) {
      try {
        // Try to decode if it's base64 encoded
        const decodedCode = atob(codeParam);
        setCustomCode(decodedCode);
        console.log("Decoded code from URL parameter");
      } catch (e) {
        // If not base64, use directly
        setCustomCode(codeParam);
        console.log("Using raw code from URL parameter");
      }
    }
    
    // Check for dependencies parameter (JSON format)
    const depsParam = searchParams.get('dependencies');
    if (depsParam) {
      try {
        const parsedDeps = JSON.parse(depsParam);
        setDependencies(prev => ({
          ...prev,
          ...parsedDeps
        }));
        console.log("Added custom dependencies:", parsedDeps);
      } catch (error) {
        console.error("Failed to parse dependencies from URL:", error);
      }
    }
    
    // Optional: You can also check for a projectId parameter
    const projectId = searchParams.get('projectId');
    if (projectId) {
      console.log("Project ID provided:", projectId);
      // You could potentially load code from an API using this ID
      // fetchCodeFromApi(projectId);
    }
  }, [location, dependencies]);

  // Prepare files for Snack initialization
  const prepareSnackFiles = useCallback(() => {
    let files: { [key: string]: { type: string, contents: string } } = {};
    
    // Use custom code if provided, otherwise use default
    const appCode = customCode || defaultCode;
    
    files['App.js'] = {
      type: 'CODE',
      contents: appCode
    };
    
    return files;
  }, [customCode, defaultCode]);

  // Initialize Snack
  useEffect(() => {
    try {
      const files = prepareSnackFiles();
      
      const newSnack = new Snack({
        name: 'HyperBuild App',
        description: 'Mobile application from HyperBuild',
        sdkVersion: '48.0.0' as unknown as SDKVersion,
        files,
        dependencies,
        webPreviewRef,
      } as any);
      
      setSnack(newSnack);
      console.log("App preview initialized successfully");
    } catch (err) {
      console.error("Error initializing app preview:", err);
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setLoadFailed(true);
    }
  }, [prepareSnackFiles, dependencies]);

  // Get preview URL
  const webPreviewURL = useMemo(() => {
    if (!snack) return '';
    
    try {
      const state = snack.getState();
      const url = state.webPreviewURL || '';
      console.log("Preview URL:", url);
      return url;
    } catch (err) {
      console.error("Error getting preview URL:", err);
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setLoadFailed(true);
      return '';
    }
  }, [snack]);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    console.log("Preview loaded successfully");
  }, []);

  // Method to update code (can be called from parent components or via window message)
  const updateCode = useCallback((newCode: string) => {
    setCustomCode(newCode);
    
    // If snack is already initialized, update it directly for faster preview
    if (snack) {
      try {
        snack.updateFiles({
          'App.js': {
            type: 'CODE',
            contents: newCode
          }
        });
        console.log("Code updated successfully");
      } catch (err) {
        console.error("Error updating code:", err);
      }
    }
  }, [snack]);

  // Listen for postMessage API calls
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from trusted domains
      const trustedOrigins = [window.location.origin, 'http://localhost:3000'];
      if (!trustedOrigins.includes(event.origin)) return;
      
      const { type, code, dependencies: deps } = event.data || {};
      
      if (type === 'UPDATE_CODE' && code) {
        updateCode(code);
        console.log("Code updated via postMessage API");
      }
      
      if (type === 'UPDATE_DEPENDENCIES' && deps) {
        setDependencies(prev => ({
          ...prev,
          ...deps
        }));
        console.log("Dependencies updated via postMessage API");
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Expose API methods globally for direct JS access
    (window as any).expoPreview = {
      updateCode,
      updateDependencies: (deps: Record<string, { version: string }>) => {
        setDependencies(prev => ({...prev, ...deps}));
      }
    };
    
    return () => {
      window.removeEventListener('message', handleMessage);
      delete (window as any).expoPreview;
    };
  }, [updateCode]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (snack) {
        try {
          snack.setOnline(false);
        } catch (err) {
          console.error("Error cleaning up snack:", err);
        }
      }
    };
  }, [snack]);

  // If there's an error, show a minimal error message
  if (loadFailed || !webPreviewURL) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="text-lg font-semibold mb-2">Failed to load Expo preview</div>
        {errorMessage && (
          <div className="text-red-400 text-sm mb-3 max-w-md overflow-auto">
            {errorMessage}
          </div>
        )}
        <button
          className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded"
          onClick={() => {
            setLoadFailed(false);
            setIsLoading(true);
            setErrorMessage(null);
            
            try {
              if (snack) {
                snack.setOnline(true);
              }
            } catch (err) {
              console.error("Error resetting snack:", err);
            }
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center">
            <div className="mb-2 text-sm text-gray-400">Loading preview...</div>
            <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
      
      {webPreviewURL && (
        <iframe
          ref={(c) => {
            if (c) webPreviewRef.current = c.contentWindow;
            else webPreviewRef.current = null;
          }}
          src={webPreviewURL}
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          title="Expo Preview"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
        />
      )}
    </div>
  );
};

export default ExpoPreviewPage; 