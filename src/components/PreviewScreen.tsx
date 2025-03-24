import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { snackService } from '../services';
import { motion } from 'framer-motion';
import { FiRefreshCw } from 'react-icons/fi';

interface PreviewScreenProps {
  prompt: string;
  mockType?: 'default';
  selectedDevice?: 'iphone' | 'android';
  projectId?: string;
  snackUrl?: string;
}

export interface PreviewScreenRef {
  refreshPreview: () => void;
}

const PreviewScreen = forwardRef<PreviewScreenRef, PreviewScreenProps>(({ 
  prompt, 
  mockType = 'default',
  selectedDevice = 'iphone',
  projectId,
  snackUrl: initialSnackUrl
}, ref) => {
  const [snackUrl, setSnackUrl] = useState<string | undefined>(initialSnackUrl);
  const [isLoading, setIsLoading] = useState<boolean>(!initialSnackUrl && !!projectId);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);

  const iphoneWidth = 393;
  const iphoneHeight = 852;
  const scale = 0.7;
  const deviceWidth = iphoneWidth * scale;
  const deviceHeight = iphoneHeight * scale;
  
  const contentMarginTop = deviceWidth * 0.06;
  const contentMarginX = deviceWidth * 0.05;
  const contentMarginBottom = deviceWidth * 0.07;
  const contentWidth = deviceWidth - (contentMarginX * 2);
  const contentHeight = deviceHeight - contentMarginTop - contentMarginBottom;

  useEffect(() => {
    if (initialSnackUrl !== snackUrl) {
      setSnackUrl(initialSnackUrl);
      setKey(prev => prev + 1);
    }
  }, [initialSnackUrl]);

  const fetchSnackUrl = async () => {
    if (!projectId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Pobieramy lub tworzymy nowy Snack
      const snackData = await snackService.getSnackUrl(projectId);
      if (snackData && snackData.snackUrl) {
        setSnackUrl(snackData.snackUrl);
        setKey(prev => prev + 1);
      } else {
        const newSnackData = await snackService.createSnack(projectId);
        if (newSnackData && newSnackData.snackUrl) {
          setSnackUrl(newSnackData.snackUrl);
          setKey(prev => prev + 1);
        } else {
          setError('Nie można utworzyć podglądu aplikacji');
        }
      }
    } catch (error) {
      console.error('Error fetching snack URL:', error);
      setError('Wystąpił błąd podczas ładowania podglądu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialSnackUrl && projectId) {
      fetchSnackUrl();
    }
  }, [projectId, initialSnackUrl]);
  
  const refreshPreview = async () => {
    setKey(prev => prev + 1);
    if (projectId) {
      await fetchSnackUrl();
    }
  };

  useImperativeHandle(ref, () => ({
    refreshPreview
  }));

  const getEmbedUrl = () => {
    if (!snackUrl) {
      console.log('No snackUrl provided');
      return '';
    }
    
    try {
      console.log('Original Snack URL:', snackUrl);
      
      // Parse the URL and get all parameters
      const url = new URL(snackUrl);
      const params = new URLSearchParams(url.search);
      
      // Get the actual Snack ID - try different methods
      let snackId;
      
      // 1. Try to get from snack parameter
      const snackParam = params.get('snack');
      if (snackParam) {
        snackId = snackParam.split('?')[0];
      }
      
      // 2. Try to get from pathname
      if (!snackId) {
        const pathParts = url.pathname.split('/');
        snackId = pathParts[pathParts.length - 1];
      }
      
      console.log('Using Snack ID:', snackId);
      
      if (!snackId) {
        console.error('Failed to extract Snack ID');
        return '';
      }

      // Create embed URL with essential parameters
      const embedParams = new URLSearchParams({
        'platform': selectedDevice,
        'preview': 'true',
        'theme': 'dark',
        'supportedPlatforms': 'ios,android,web'
      });

      // Add runtime version if available
      const runtimeVersion = params.get('runtime-version');
      if (runtimeVersion) {
        embedParams.set('runtime-version', runtimeVersion);
      }

      // Use the embedded format
      const embedUrl = `https://snack.expo.dev/embedded/${snackId}?${embedParams.toString()}`;
      console.log('Generated embed URL:', embedUrl);
      
      return embedUrl;
    } catch (error) {
      console.error('Error generating Snack URL:', error);
      setError('Błąd podczas generowania URL podglądu');
      return '';
    }
  };

  const handleIframeLoad = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    console.log('Iframe loaded:', event);
    const iframe = event.target as HTMLIFrameElement;
    console.log('Iframe src:', iframe.src);
    
    // Sprawdź czy iframe załadował się poprawnie
    if (iframe.contentWindow) {
      setIsLoading(false);
      setError(null);
    } else {
      setError('Nie można załadować podglądu. Spróbuj odświeżyć.');
      setIsLoading(false);
    }
  };

  const handleIframeError = (event: React.SyntheticEvent<HTMLIFrameElement>) => {
    console.error('Iframe error:', event);
    const iframe = event.target as HTMLIFrameElement;
    console.error('Failed URL:', iframe.src);
    
    setError('Nie można załadować podglądu. Spróbuj odświeżyć.');
    setIsLoading(false);
  };

  // Dodaj efekt do monitorowania zmian URL-a
  useEffect(() => {
    if (snackUrl) {
      console.log('Snack URL changed:', snackUrl);
      const embedUrl = getEmbedUrl();
      console.log('Generated embed URL:', embedUrl);
    }
  }, [snackUrl, key]);

  return (
    <div className="relative transform transition-transform duration-300">
      <div className="relative" style={{ width: `${deviceWidth}px`, height: `${deviceHeight}px` }}>
        <div className="absolute inset-0 pointer-events-none z-10">
          <img 
            src="/frames/iphone.svg" 
            alt="iPhone frame" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="absolute z-0 rounded-[30px] overflow-hidden bg-black" style={{ 
          top: `${contentMarginTop}px`, 
          left: `${contentMarginX}px`, 
          width: `${contentWidth}px`, 
          height: `${contentHeight}px`
        }}>
          {isLoading ? (
            <div className="flex justify-center items-center h-full w-full">
              <div className="animate-spin h-10 w-10 border-2 border-neutral-600 rounded-full border-t-neutral-200"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center h-full w-full p-4 text-center">
              <div className="text-red-500 mb-2 text-sm">⚠️ {error}</div>
              <div className="text-xs text-neutral-400 mb-2">URL: {snackUrl}</div>
              {projectId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded-md text-xs"
                  onClick={refreshPreview}
                >
                  Spróbuj ponownie
                </motion.button>
              )}
            </div>
          ) : snackUrl ? (
            <>
              <iframe
                key={key}
                ref={iframeRef}
                src={getEmbedUrl()}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                className="bg-black"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
              {/* Debug info */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-xs text-neutral-400 p-1">
                ID: {snackUrl.split('/').pop()?.split('?')[0]}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full w-full text-center p-4">
              <div className="text-neutral-400 text-sm">
                Brak podglądu aplikacji.<br/>
                Najpierw dodaj lub wybierz projekt.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default PreviewScreen; 