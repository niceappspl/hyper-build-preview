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
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Animated, 
  KeyboardAvoidingView, 
  Platform,
  Image,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function App() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(50)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Available cars (simplified for demo)
  const cars = [
    {
      id: 1,
      name: 'Tesla Model S',
      image: 'https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVzbGElMjBtb2RlbCUyMHN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/800px-Tesla_T_symbol.svg.png'
    },
    {
      id: 2,
      name: 'BMW i8',
      image: 'https://images.unsplash.com/photo-1556800572-1b8aeef2c54f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym13JTIwaTh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/1024px-BMW.svg.png'
    },
    {
      id: 3,
      name: 'Porsche Taycan',
      image: 'https://images.unsplash.com/photo-1614200179396-2bdb77383056?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9yc2NoZSUyMHRheWNhbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Porsche_logo.svg/2560px-Porsche_logo.svg.png'
    }
  ];
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
    
    // Form animations with slight delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]).start();
    }, 500);
  }, []);
  
  const handleLoginPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    
    Keyboard.dismiss();
    
    // Show simple validation
    if (!email) alert('Please enter your email');
    else if (!password) alert('Please enter your password');
    else alert(\`Login successful! Welcome to your \${cars[selectedCarIndex].name}\`);
  };
  
  const handleCarSelect = (index) => {
    setSelectedCarIndex(index);
  };

  return (
    <ImageBackground
      source={{ uri: cars[selectedCarIndex].image }}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.overlay}
      />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          {/* Brand logo */}
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Image
              source={{ uri: cars[selectedCarIndex].logo }}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </Animated.View>
          
          {/* Car selection */}
          <View style={styles.carSelectorContainer}>
            {cars.map((car, index) => (
              <TouchableOpacity
                key={car.id}
                style={[
                  styles.carSelector,
                  selectedCarIndex === index && styles.carSelectorActive
                ]}
                onPress={() => handleCarSelect(index)}
              >
                <Text 
                  style={[
                    styles.carSelectorText,
                    selectedCarIndex === index && styles.carSelectorTextActive
                  ]}
                >
                  {car.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Login form */}
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }]
              }
            ]}
          >
            <BlurView intensity={80} tint="dark" style={styles.formBlur}>
              <View style={styles.formContent}>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>Sign in to continue</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="your.email@example.com"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, { paddingRight: 50 }]}
                      placeholder="Enter your password"
                      placeholderTextColor="rgba(255,255,255,0.5)"
                      secureTextEntry={!isPasswordVisible}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity 
                      style={styles.visibilityToggle}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <Text style={styles.visibilityToggleText}>
                        {isPasswordVisible ? 'Hide' : 'Show'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.optionsRow}>
                  <TouchableOpacity 
                    style={styles.checkboxContainer} 
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <View style={[
                      styles.checkbox, 
                      rememberMe && styles.checkboxChecked
                    ]}>
                      {rememberMe && <View style={styles.checkboxInner} />}
                    </View>
                    <Text style={styles.checkboxLabel}>Remember me</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLoginPress}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={
                        selectedCarIndex === 0 ? ['#e82127', '#bd081c'] : 
                        selectedCarIndex === 1 ? ['#1c69d3', '#0653b6'] : 
                        ['#ed2914', '#d61812']
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.loginButtonGradient}
                    >
                      <Text style={styles.loginButtonText}>START ENGINE</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
                
                {/* Biometric auth option */}
                <View style={styles.biometricContainer}>
                  <View style={styles.biometricDivider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>
                  
                  <TouchableOpacity style={styles.biometricButton}>
                    <View style={styles.biometricCircle}>
                      <Image 
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1251/1251161.png' }} 
                        style={styles.biometricIcon} 
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={styles.biometricText}>Use Fingerprint</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Animated.View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity>
              <Text style={styles.signupText}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandLogo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  carSelectorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  carSelector: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  carSelectorActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  carSelectorText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  carSelectorTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  formBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  formContent: {
    padding: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  visibilityToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  visibilityToggleText: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  checkboxLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  forgotPassword: {
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginBottom: 24,
  },
  loginButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  biometricContainer: {
    alignItems: 'center',
  },
  biometricDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 10,
    fontWeight: '500',
    fontSize: 14,
  },
  biometricButton: {
    alignItems: 'center',
  },
  biometricCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  biometricIcon: {
    width: 24,
    height: 24,
    tintColor: 'white',
  },
  biometricText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  signupText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
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
      const trustedOrigins = [
        window.location.origin, 
        'http://localhost:5173',
        'https://hyperbuild.vercel.app'
      ];
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
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking; screen-wake-lock"
        />
      )}
    </div>
  );
};

export default ExpoPreviewPage; 