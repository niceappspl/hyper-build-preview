import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
  useSandpack,
  SandboxEnvironment
} from "@codesandbox/sandpack-react";
import { AVAILABLE_DEVICE_CONFIGS } from '../config/DeviceConfig';
import { Snack } from 'snack-sdk';
import { SDKVersion } from 'snack-content';

// Niestandardowy komponent dla podglądu PWA
const PWAPreview = ({ projectId }: { projectId?: string }) => {
  const { sandpack } = useSandpack();
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  
  // Pobierz referencję do iframe z sandpacka
  useEffect(() => {
    if (sandpack) {
      // Wyszukujemy iframe w elemencie preview po timeoucie, aby dać czas na renderowanie
      setTimeout(() => {
        const previewElement = document.querySelector('.sp-preview-iframe') as HTMLIFrameElement;
        if (previewElement) {
          iframeRef.current = previewElement;
        }
      }, 500);
    }
  }, [sandpack]);
  
  useEffect(() => {
    // Logika związana z PWA - możemy tutaj dodać logikę do dostarczania manifestu i ikon
    const injectPWACode = async () => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        try {
          const iframeDocument = iframe.contentDocument;
          
          // Dodajemy meta tagi PWA
          if (iframeDocument && iframeDocument.head) {
            // Dodanie meta tagów dla PWA
            const metaTags = [
              { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover' },
              { name: 'theme-color', content: '#4285f4' },
              { name: 'apple-mobile-web-app-capable', content: 'yes' },
              { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
              { name: 'apple-mobile-web-app-title', content: 'Hyper Build PWA' },
            ];
            
            metaTags.forEach(({ name, content }) => {
              const meta = document.createElement('meta');
              meta.name = name;
              meta.content = content;
              iframeDocument.head.appendChild(meta);
            });
            
            // Dodanie linku do manifestu (symulacja)
            const manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            manifestLink.href = '/manifest.json';
            iframeDocument.head.appendChild(manifestLink);
            
            // Symulacja Service Worker - dodanie informacji o statusie
            const swStatusDiv = document.createElement('div');
            swStatusDiv.id = 'sw-status';
            swStatusDiv.style.display = 'none';
            swStatusDiv.setAttribute('data-sw-status', 'registered');
            iframeDocument.body.appendChild(swStatusDiv);
            
            // Dodanie stylu dla Dynamic Island z uwzględnieniem rzeczywistych wymiarów z SVG
            const dynamicIslandStyle = document.createElement('style');
            dynamicIslandStyle.textContent = `
              :root {
                /* Safe area insets oparte na rzeczywistych wymiarach ramki iPhone */
                --safe-area-inset-top: 47px;
                --safe-area-inset-bottom: 34px;
                --safe-area-inset-left: 0px;
                --safe-area-inset-right: 0px;
              }
              
              /* Style zapewniające pełne wykorzystanie ekranu */
              html {
                height: 100%;
                width: 100%;
                overflow: hidden;
              }
              
              /* Obsługa gestów dla całej wysokości */
              body {
                height: 100vh !important;
                margin: 0 !important;
                overflow: hidden !important;
                position: fixed !important;
                width: 100% !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                /* Dodanie paddingu dla Dynamic Island */
                padding-top: var(--safe-area-inset-top) !important;
                padding-bottom: var(--safe-area-inset-bottom) !important;
              }
              
              /* Fullscreen container - główny kontener aplikacji */
              .app-container {
                height: 100% !important;
                width: 100% !important;
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
              }
              
              /* Styl dla headera, aby uwzględniał wyspę */
              .app-header {
                padding-top: max(16px, var(--safe-area-inset-top)) !important;
              }
              
              /* Poprawka dla content, aby wypełniał dostępną przestrzeń */
              .app-content {
                flex: 1 !important;
                overflow-y: auto !important;
                -webkit-overflow-scrolling: touch !important;
              }
              
              /* Poprawka dla stopki, aby uwzględniała safe area */
              .app-footer {
                padding-bottom: max(16px, var(--safe-area-inset-bottom)) !important;
              }
            `;
            iframeDocument.head.appendChild(dynamicIslandStyle);
          }
        } catch (error) {
          console.error('Error accessing iframe content:', error);
        }
      }
    };
    
    // Odczekaj chwilę aby sandbox się zainicjalizował
    setTimeout(injectPWACode, 1000);
  }, [iframeRef]);
  
  return (
    <SandpackPreview
      showOpenInCodeSandbox={false}
      showRefreshButton={false}
      style={{ 
        height: '100%', 
        width: '100%', 
        border: 'none'
      }}
    />
  );
};

// Expo Preview Component - dla podglądu aplikacji React Native
const ExpoPreview = ({ 
  projectId, 
  projectFiles = null
}: { 
  projectId?: string, 
  projectFiles?: { [key: string]: string } | null
}) => {
  const webPreviewRef = useRef<Window | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [snack, setSnack] = useState<any>(null);
  
  // Domyślny kod React Native, używany gdy projectFiles nie jest dostarczone
  const defaultCode = `
import React, { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ImageBackground, 
  StatusBar, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Dostosowanie do wymiarów iframe Expo - iPhone 14 Pro
// Wymiary są dostosowane do ramki, którą widzimy w podglądzie
const { width, height } = Dimensions.get('window');
const DESIGN_WIDTH = 393;  // Szerokość iPhone'a w ramce
const DESIGN_HEIGHT = 852; // Wysokość iPhone'a w ramce
const DYNAMIC_ISLAND_HEIGHT = 0; // Wysokość Dynamic Island

// Funkcja skalująca wymiary w zależności od rzeczywistego rozmiaru ekranu
const scale = (size) => {
  return (width / DESIGN_WIDTH) * size;
};

// Funkcja skalująca marginesy i paddingi
const spacing = (size) => {
  return Math.max(8, scale(size));
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Animated gradient colors for the button
  const primaryGradient = ['#4F46E5', '#7C3AED'];
  
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop' }}
      style={{ 
        flex: 1,
        width: '100%',
        height: '100%'
      }}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />
      
      <SafeAreaView style={{ 
        flex: 1, 
        paddingTop: DYNAMIC_ISLAND_HEIGHT // Uwzględnienie Dynamic Island
      }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={scale(10)}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
            style={{ 
              flex: 1, 
              justifyContent: 'space-between', 
              padding: spacing(20)
            }}
          >
            {/* Logo and App Name */}
            <View style={{ 
              alignItems: 'center', 
              marginTop: spacing(40)
            }}>
              <View style={{
                width: scale(60),
                height: scale(60),
                borderRadius: scale(16),
                backgroundColor: 'rgba(255,255,255,0.15)',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacing(12),
                overflow: 'hidden'
              }}>
                <LinearGradient
                  colors={primaryGradient}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    height: '100%',
                    opacity: 0.8
                  }}
                />
                <Text style={{ 
                  color: 'white', 
                  fontSize: scale(28), 
                  fontWeight: 'bold' 
                }}>F</Text>
              </View>
              
              <Text style={{ 
                color: 'white', 
                fontSize: scale(24), 
                fontWeight: 'bold',
                letterSpacing: 1
              }}>
                FitPulse
              </Text>
              <Text style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: scale(14),
                marginTop: spacing(4)
              }}>
                Train smarter, not harder
              </Text>
            </View>
            
            {/* Login Form */}
            <View style={{ width: '100%' }}>
              <Text style={{ 
                color: 'white', 
                fontSize: scale(20), 
                fontWeight: 'bold',
                marginBottom: spacing(20)
              }}>
                Welcome Back
              </Text>
              
              {/* Email Input */}
              <BlurView
                intensity={30}
                tint="dark"
                style={{
                  borderRadius: scale(12),
                  overflow: 'hidden',
                  marginBottom: spacing(16)
                }}
              >
                <View style={{
                  paddingHorizontal: spacing(16),
                  paddingVertical: spacing(6),
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }}>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.6)', 
                    fontSize: scale(12),
                    marginTop: spacing(4)
                  }}>
                    Email
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="your@email.com"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    style={{
                      color: 'white',
                      fontSize: scale(16),
                      paddingVertical: spacing(6),
                      paddingHorizontal: 0
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </BlurView>
              
              {/* Password Input */}
              <BlurView
                intensity={30}
                tint="dark"
                style={{
                  borderRadius: scale(12),
                  overflow: 'hidden',
                  marginBottom: spacing(8)
                }}
              >
                <View style={{
                  paddingHorizontal: spacing(16),
                  paddingVertical: spacing(6),
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ 
                      color: 'rgba(255,255,255,0.6)', 
                      fontSize: scale(12),
                      marginTop: spacing(4)
                    }}>
                      Password
                    </Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="••••••••"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      secureTextEntry={!isPasswordVisible}
                      style={{
                        color: 'white',
                        fontSize: scale(16),
                        paddingVertical: spacing(6),
                        paddingHorizontal: 0
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    style={{
                      padding: spacing(8)
                    }}
                  >
                    <Text style={{ 
                      color: 'rgba(255,255,255,0.6)', 
                      fontSize: scale(14)
                    }}>
                      {isPasswordVisible ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
              
              {/* Forgot Password */}
              <TouchableOpacity style={{ 
                alignSelf: 'flex-end', 
                marginBottom: spacing(20) 
              }}>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: scale(14)
                }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              
              {/* Login Button */}
              <TouchableOpacity
                style={{
                  borderRadius: scale(12),
                  overflow: 'hidden',
                  marginBottom: spacing(16),
                  elevation: 4,
                  shadowColor: '#4F46E5',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8
                }}
              >
                <LinearGradient
                  colors={primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: spacing(14),
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ 
                    color: 'white', 
                    fontSize: scale(16), 
                    fontWeight: 'bold',
                    letterSpacing: 0.5
                  }}>
                    LOG IN
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              {/* Social Login Options */}
              <View style={{ marginBottom: spacing(16) }}>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  fontSize: scale(14),
                  textAlign: 'center',
                  marginBottom: spacing(12)
                }}>
                  Or continue with
                </Text>
                
                <View style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between'
                }}>
                  {/* Google Button */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginRight: spacing(8),
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: scale(12),
                      paddingVertical: spacing(10),
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.2)'
                    }}
                  >
                    <Text style={{ 
                      color: 'white', 
                      fontSize: scale(14),
                      fontWeight: '500'
                    }}>
                      Google
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Apple Button */}
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginLeft: spacing(8),
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: scale(12),
                      paddingVertical: spacing(10),
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.2)'
                    }}
                  >
                    <Text style={{ 
                      color: 'white', 
                      fontSize: scale(14),
                      fontWeight: '500'
                    }}>
                      Apple
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Sign Up Link */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center',
                marginBottom: spacing(12)
              }}>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: scale(14),
                  marginRight: spacing(4)
                }}>
                  Don't have an account?
                </Text>
                <TouchableOpacity>
                  <Text style={{ 
                    color: primaryGradient[0], 
                    fontSize: scale(14),
                    fontWeight: 'bold'
                  }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}`;

  // Przygotuj pliki do inicjalizacji Snack
  const prepareSnackFiles = useCallback(() => {
    let files: { [key: string]: { type: string, contents: string } } = {};
    
    if (projectFiles && Object.keys(projectFiles).length > 0) {
      // Jeśli przekazano pliki projektu, użyj ich
      Object.entries(projectFiles).forEach(([filePath, content]) => {
        files[filePath] = {
          type: 'CODE',
          contents: content
        };
      });
      
      // Upewnij się, że App.js istnieje - jeśli nie, użyj domyślnego
      if (!files['App.js']) {
        files['App.js'] = {
          type: 'CODE',
          contents: defaultCode
        };
      }
    } else {
      // Użyj domyślnego kodu, jeśli nie przekazano plików
      files['App.js'] = {
        type: 'CODE',
        contents: defaultCode
      };
    }
    
    return files;
  }, [projectFiles, defaultCode]);

  // Funkcja do aktualizacji kodu w symulatorze
  const updateFiles = useCallback(() => {
    if (!snack) return;
    
    try {
      const files = prepareSnackFiles();
      snack.updateFiles(files);
      console.log("Code updated successfully");
    } catch (err) {
      console.error("Error updating code:", err);
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
  }, [snack, prepareSnackFiles]);

  // Reaguj na zmiany w plikach projektu
  useEffect(() => {
    if (snack) {
      updateFiles();
    }
  }, [projectFiles, updateFiles, snack]);

  // Inicjalizacja Snack
  useEffect(() => {
    try {
      const files = prepareSnackFiles();
      
      const newSnack = new Snack({
        name: 'HyperBuild App',
        description: 'Mobile application from HyperBuild',
        sdkVersion: '48.0.0' as unknown as SDKVersion,
        files,
        dependencies: {
          'expo-linear-gradient': {
            version: '~12.3.0'
          },
          'expo-blur': {
            version: '~12.4.1'
          }
        },
        webPreviewRef,
      } as any);
      
      setSnack(newSnack);
      console.log("App preview initialized successfully");
    } catch (err) {
      console.error("Error initializing app preview:", err);
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setLoadFailed(true);
    }
  }, [prepareSnackFiles]);

  // Pobieranie URL do podglądu
  const webPreviewURL = useMemo(() => {
    if (!snack) return '';
    
    try {
      const state = snack.getState();
      console.log("Snack state:", state);
      return state.webPreviewURL || '';
    } catch (err) {
      console.error("Error getting preview URL:", err);
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setLoadFailed(true);
      return '';
    }
  }, [snack]);

  const handleIframeLoad = useCallback(() => {
    console.log("App preview loaded");
    setIsLoading(false);
  }, []);
  
  // Timeout dla ładowania
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading && webPreviewURL) {
        console.log("Loading timeout reached");
        setLoadFailed(true);
        setErrorMessage("Przekroczono czas oczekiwania na załadowanie aplikacji");
      }
    }, 10000); // 10 sekund
    
    return () => clearTimeout(timer);
  }, [isLoading, webPreviewURL]);

  // Czyszczenie
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

  // Widok zastępczy w przypadku błędu
  if (loadFailed || !webPreviewURL) {
  return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-100 text-center">
        <div className="text-lg font-semibold mb-2">Nie udało się załadować aplikacji</div>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-3 p-2 bg-red-50 rounded">
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
          Spróbuj ponownie
                  </button>
        </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
          <div className="text-center">
            <div className="mb-2 text-sm text-gray-600">Ładowanie aplikacji...</div>
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
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
          title="Expo Snack Preview"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation"
        />
      )}
    </div>
  );
};

interface PreviewScreenProps {
  prompt: string;
  mockType?: string;
  selectedDevice?: string;
  projectId?: string;
  projectFiles?: { [key: string]: string };
}

export interface PreviewScreenRef {
  refreshPreview: () => void;
}

const PreviewScreen = forwardRef<PreviewScreenRef, PreviewScreenProps>(({ 
  prompt, 
  projectId,
  projectFiles
}, ref) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0); // Klucz do wymuszenia rerenderowania
  
  // Precyzyjne wymiary dla iPhone'a - dostosowane do rzeczywistej ramki z SVG
  const iphoneWidth = 393;
  const iphoneHeight = 892;
  const scale = 0.7;
  const deviceWidth = iphoneWidth * scale;
  const deviceHeight = iphoneHeight * scale;
  
  // Dokładne marginesy dla zawartości - dostosowane do ramki SVG
  const contentMarginTop = deviceHeight * 0.055;
  const contentMarginX = deviceWidth * 0.047;
  const contentMarginBottom = deviceHeight * 0.055;
  const contentWidth = deviceWidth - (contentMarginX * 2);
  const contentHeight = deviceHeight - contentMarginTop - contentMarginBottom;
  
  // Funkcja odświeżająca podgląd
  const refreshPreview = () => {
    setIsLoading(true);
    setTimeout(() => {
      setKey(prev => prev + 1); // Wymusz ponowne renderowanie
      setIsLoading(false);
    }, 300);
  };

  // Udostępnij metodę refreshPreview na zewnątrz komponentu
  useImperativeHandle(ref, () => ({
    refreshPreview
  }));

  return (
    <div className="relative transform transition-transform duration-300">
      <div className="relative" style={{ width: `${deviceWidth}px`, height: `${deviceHeight}px` }}>
        {/* Zawartość (uwaga: umieszczamy ją przed ramką, aby była pod nią) */}
        <div 
          className="absolute z-0 overflow-hidden bg-white" 
          style={{ 
            top: `${contentMarginTop}px`, 
            left: `${contentMarginX}px`, 
            width: `${contentWidth}px`, 
            height: `${contentHeight}px`,
            borderRadius: '35px' // Zwiększamy promień zaokrąglenia dla lepszego dopasowania
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-full w-full bg-gray-100">
              <div className="text-gray-800 text-lg">Ładowanie podglądu...</div>
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden" key={key}>
              <ExpoPreview 
                projectId={projectId} 
                projectFiles={projectFiles} 
              />
            </div>
          )}
        </div>

        {/* Ramka iPhone - umieszczona nad zawartością */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <img 
            src="/frames/iphone.svg" 
            alt="iPhone frame" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Home indicator na dole */}
          <div 
            className="absolute bottom-[10px] left-1/2 transform -translate-x-1/2 h-[5px] w-[100px] bg-white/30 rounded-full z-20 pointer-events-none"
          ></div>
      </div>
    </div>
  );
});

export default PreviewScreen;