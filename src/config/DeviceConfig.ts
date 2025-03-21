/**
 * DeviceConfig.ts
 * 
 * Ten plik zawiera konfigurację wymiarów urządzeń mobilnych oraz metadane
 * potrzebne do poprawnego renderowania mockupów aplikacji.
 */

interface DeviceDimensions {
  width: number;      // Szerokość urządzenia w px
  height: number;     // Wysokość urządzenia w px
  safeAreaTop: number;    // Bezpieczny obszar z góry (dla wyspy/notcha)
  safeAreaBottom: number; // Bezpieczny obszar z dołu (dla home indicator)
  safeAreaSides: number;  // Bezpieczny obszar po bokach
  cornerRadius: number;   // Promień zaokrąglenia rogów ekranu
}

export interface DeviceConfig {
  dimensions: DeviceDimensions;
  devicePixelRatio: number;  // Device Pixel Ratio (DPR)
  displayName: string;       // Nazwa wyświetlana w UI
  framePath?: string;        // Ścieżka do pliku SVG z ramką urządzenia
  viewportSize: {            // Dokładny rozmiar viewportu
    width: number;
    height: number;
  };
  screenSize: {              // Fizyczny rozmiar ekranu w pikselach
    width: number;
    height: number;
  };
}

// Konfiguracja dla iPhone 14 Pro / 15 Pro z dokładnymi wymiarami
export const IPHONE_14_PRO_CONFIG: DeviceConfig = {
  dimensions: {
    width: 393,
    height: 852,
    safeAreaTop: 59,      // Zoptymalizowane dla Dynamic Island
    safeAreaBottom: 34,   // Home Indicator
    safeAreaSides: 19,
    cornerRadius: 47
  },
  devicePixelRatio: 3,    // DPR dla iPhone'a 14 Pro / 15 Pro
  displayName: 'iPhone 14 Pro / 15 Pro',
  framePath: '/frames/iphone.svg',
  viewportSize: {
    width: 393,
    height: 852
  },
  screenSize: {
    width: 1179,   // 393 * 3 (DPR)
    height: 2556   // 852 * 3 (DPR)
  }
};

// Konfiguracja dla wysokich urządzeń Android
export const ANDROID_CONFIG: DeviceConfig = {
  dimensions: {
    width: 393,
    height: 851,
    safeAreaTop: 32,
    safeAreaBottom: 32,
    safeAreaSides: 16,
    cornerRadius: 30
  },
  devicePixelRatio: 2.75,
  displayName: 'Android (Generic)',
  framePath: '/frames/android.svg',
  viewportSize: {
    width: 393,
    height: 851
  },
  screenSize: {
    width: 1080,   // Przykładowa wartość dla urządzeń Android
    height: 2340
  }
};

// Funkcje pomocnicze do obliczania wymiarów w zależności od skali
export const calculateScaledDimensions = (
  deviceConfig: DeviceConfig, 
  scale: number = 1.0
): {
  deviceWidth: number;
  deviceHeight: number;
  contentWidth: number;
  contentHeight: number;
  contentTop: number;
  contentLeft: number;
} => {
  const { width, height, safeAreaTop, safeAreaBottom, safeAreaSides } = deviceConfig.dimensions;
  
  // Skaluj wymiary urządzenia
  const deviceWidth = width * scale;
  const deviceHeight = height * scale;
  
  // Skaluj bezpieczne obszary
  const scaledSafeAreaTop = safeAreaTop * scale;
  const scaledSafeAreaBottom = safeAreaBottom * scale;
  const scaledSafeAreaSides = safeAreaSides * scale;
  
  // Oblicz wymiary i pozycję zawartości
  const contentWidth = deviceWidth - (scaledSafeAreaSides * 2);
  const contentHeight = deviceHeight - scaledSafeAreaTop - scaledSafeAreaBottom;
  const contentTop = scaledSafeAreaTop;
  const contentLeft = scaledSafeAreaSides;
  
  return {
    deviceWidth,
    deviceHeight,
    contentWidth,
    contentHeight,
    contentTop,
    contentLeft
  };
};

// Domyślne urządzenie
export const DEFAULT_DEVICE_CONFIG = IPHONE_14_PRO_CONFIG;

// Dostępne urządzenia do wyboru w UI
export const AVAILABLE_DEVICE_CONFIGS: Record<string, DeviceConfig> = {
  iphone: IPHONE_14_PRO_CONFIG,
  android: ANDROID_CONFIG
}; 