import React, { useMemo } from 'react';

interface ExpoSnackPreviewProps {
  snackId: string;
  platform?: 'android' | 'ios' | 'web';
  preview?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

export const ExpoSnackPreview: React.FC<ExpoSnackPreviewProps> = ({
  snackId,
  platform = 'web',
  preview = true,
  theme = 'light',
  className
}) => {
  const iframeUrl = useMemo(() => {
    // Remove any URL parameters if they were accidentally included
    const cleanSnackId = snackId.split('?')[0].split('/').pop() || snackId;
    
    const params = new URLSearchParams({
      platform,
      preview: preview.toString(),
      theme,
      'supportedPlatforms': 'ios,android,web'
    });

    return `https://snack.expo.dev/embedded/${cleanSnackId}?${params.toString()}`;
  }, [snackId, platform, preview, theme]);

  return (
    <div className={`w-full h-[600px] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className || ''}`}>
      <iframe
        src={iframeUrl}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; camera; geolocation; microphone"
      />
    </div>
  );
}; 