import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './IOSSimulatorPage.css';

type OrientationType = 'portrait' | 'landscape';

// Początkowy kod PWA React, który można edytować - tylko kod React bez szablonu HTML
const DEFAULT_PWA_HTML = `
// Importy potrzebnych elementów
const { useState, useEffect, useCallback, useMemo } = React;

// Wszystkie komponenty i style są zaimportowane z oddzielnego pliku
// Nie ma potrzeby ich definiować tutaj

// Główny komponent aplikacji - to jest kod, który edytujesz
const App = () => {
  const [orientation, setOrientation] = useState('portrait');
  const [activeTab, setActiveTab] = useState('home');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);
  
  // Generowanie stylów na podstawie orientacji
  const styles = useMemo(() => createStyles(orientation), [orientation]);
  
  // Efekt dla nasłuchiwania orientacji i wiadomości z rodzica
  useEffect(() => {
    function handleOrientationMessage(event) {
      if (event.data && event.data.type === 'orientation-change') {
        setOrientation(event.data.orientation);
      }
    }
    
    window.addEventListener('message', handleOrientationMessage);
    
    // Pokaż powiadomienie po kilku sekundach
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);
    
    return () => {
      window.removeEventListener('message', handleOrientationMessage);
      clearTimeout(timer);
    };
  }, []);
  
  // Obsługa kliknięcia przycisku
  const handleButtonClick = useCallback(() => {
    alert('Akcja została wykonana!');
  }, []);
  
  // Obsługa kliknięcia w zakładkę
  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'messages') {
      setNotificationCount(0);
      setShowNotification(false);
    }
  }, []);
  
  // Style dla powiadomienia
  const notificationStyle = {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    backgroundColor: 'red',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  };
  
  return (
    <div style={styles.pwaContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.pwaWelcome}>
          <div style={styles.welcomeIcon}>
            <LogoIcon />
          </div>
          <h2 style={styles.welcomeTitle}>Witaj w HyperBuild!</h2>
          <p style={styles.welcomeSubtitle}>Twoje centrum projektowania i budowania aplikacji.</p>
        </div>
        
        <div style={styles.pwaFeatures}>
          <FeatureItem 
            icon={<ProjectsIcon />}
            title="Twórz projekty"
            description="Projektuj i buduj aplikacje z łatwością"
          />
          
          <FeatureItem 
            icon={<TasksIcon />}
            title="Zarządzaj zadaniami"
            description="Śledź postęp i organizuj pracę"
          />
          
          <FeatureItem 
            icon={<TimeIcon />}
            title="Oszczędzaj czas"
            description="Automatyzuj powtarzalne zadania"
          />
        </div>
        
        <div style={styles.pwaCta}>
          <Button primary onClick={handleButtonClick}>
            Rozpocznij
          </Button>
          <Button onClick={handleButtonClick}>
            Dowiedz się więcej
          </Button>
        </div>
      </div>
      
      <nav style={styles.pwaNav}>
        <NavItem 
          icon={<HomeIcon active={activeTab === 'home'} />}
          label="Home"
          active={activeTab === 'home'}
          onClick={() => handleTabClick('home')}
        />
        <NavItem 
          icon={<ProfileIcon active={activeTab === 'profile'} />}
          label="Profil"
          active={activeTab === 'profile'}
          onClick={() => handleTabClick('profile')}
        />
        <NavItem 
          icon={<InfoIcon active={activeTab === 'info'} />}
          label="Info"
          active={activeTab === 'info'}
          onClick={() => handleTabClick('info')}
        />
        <NavItem 
          icon={
            <div style={{ position: 'relative' }}>
              {showNotification && notificationCount > 0 && (
                <div style={notificationStyle}>
                  {notificationCount}
                </div>
              )}
              <MessageIcon active={activeTab === 'messages'} />
            </div>
          }
          label="Wiadomości"
          active={activeTab === 'messages'}
          onClick={() => handleTabClick('messages')}
        />
      </nav>
    </div>
  );
};

// Renderowanie komponentu
ReactDOM.render(<App />, document.getElementById('root'));
`;

function MobilePWASimulator() {
  const [orientation, setOrientation] = useState<OrientationType>('portrait');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [codeValue, setCodeValue] = useState<string>(DEFAULT_PWA_HTML);
  
  // Wymiary iPhone SVG i ekranu
  const svgDimensions = {
    portrait: {
      width: 1294,   // Szerokość SVG iPhone
      height: 2656,  // Wysokość SVG iPhone
      screenWidth: 1243, // Szerokość ekranu wewnątrz ramki
      screenHeight: 2620, // Wysokość ekranu wewnątrz ramki
      screenOffsetX: 25,  // Odsunięcie ekranu od lewej krawędzi
      screenOffsetY: 18,  // Odsunięcie ekranu od górnej krawędzi
    },
    landscape: {
      width: 2656,   // Wysokość SVG iPhone (obrócone)
      height: 1294,  // Szerokość SVG iPhone (obrócone)
      screenWidth: 2620, // Wysokość ekranu wewnątrz ramki (obrócone)
      screenHeight: 1243, // Szerokość ekranu wewnątrz ramki (obrócone)
      screenOffsetX: 18,  // Odsunięcie ekranu od lewej krawędzi (obrócone)
      screenOffsetY: 25,  // Odsunięcie ekranu od górnej krawędzi (obrócone)
    }
  };

  // Właściwości wyspy (Dynamic Island)
  const dynamicIsland = {
    width: 126,
    height: 37,
    topOffset: 12,
  };
  
  // Oblicz współczynnik skalowania, aby iPhone mieścił się na ekranie
  const calculateScale = () => {
    // Bazowy współczynnik skalowania, dostosowany do typowej wysokości ekranu
    const baseScale = 0.2;
    
    // Można dodać dynamiczne dostosowanie w zależności od rozmiaru okna przeglądarki
    return baseScale;
  };
  
  const scale = calculateScale();
  
  // Oblicz wymiary urządzenia po skalowaniu
  const deviceDimensions = {
    portrait: {
      width: svgDimensions.portrait.width * scale,
      height: svgDimensions.portrait.height * scale,
      screenWidth: svgDimensions.portrait.screenWidth * scale,
      screenHeight: svgDimensions.portrait.screenHeight * scale,
      screenOffsetX: svgDimensions.portrait.screenOffsetX * scale,
      screenOffsetY: svgDimensions.portrait.screenOffsetY * scale,
      dynamicIslandWidth: dynamicIsland.width * scale,
      dynamicIslandHeight: dynamicIsland.height * scale,
      dynamicIslandTopOffset: dynamicIsland.topOffset * scale,
    },
    landscape: {
      width: svgDimensions.landscape.width * scale,
      height: svgDimensions.landscape.height * scale,
      screenWidth: svgDimensions.landscape.screenWidth * scale,
      screenHeight: svgDimensions.landscape.screenHeight * scale,
      screenOffsetX: svgDimensions.landscape.screenOffsetX * scale,
      screenOffsetY: svgDimensions.landscape.screenOffsetY * scale,
      dynamicIslandWidth: dynamicIsland.height * scale, // zamienione w orientacji poziomej
      dynamicIslandHeight: dynamicIsland.width * scale, // zamienione w orientacji poziomej
      dynamicIslandTopOffset: dynamicIsland.topOffset * scale,
    }
  };
  
  // Wymiary CSS viewportu dla aplikacji mobilnej
  const viewportDimensions = {
    width: 393,    // szerokość viewportu CSS
    height: 852,   // wysokość viewportu CSS
  };
  
  // Nasłuchiwanie zmian rozmiaru okna
  useEffect(() => {
    const handleResize = () => {
      // Możesz dodać tutaj logikę dynamicznego dostosowania skali
      // np. wywołując setScale(calculateScale())
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Funkcja aktualizująca zawartość iframe
  const updateIframeContent = (htmlContent: string) => {
    if (iframeRef.current) {
      setIsLoading(true);
      
      try {
        const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`
            <!DOCTYPE html>
            <html lang="pl">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
              <meta name="apple-mobile-web-app-capable" content="yes">
              <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
              <title>HyperBuild PWA</title>
              <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
              <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
              <style>
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                  -webkit-tap-highlight-color: transparent;
                }
                
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  background-color: white;
                  height: 100vh;
                  width: 100%;
                  overflow: hidden;
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                }
                
                #root {
                  height: 100%;
                  width: 100%;
                }

                /* Style dla Dynamic Island */
                .safe-area-top {
                  padding-top: env(safe-area-inset-top, ${dynamicIsland.height + dynamicIsland.topOffset}px);
                }

                @supports(padding: max(0px)) {
                  .safe-area-top {
                    padding-top: max(env(safe-area-inset-top), ${dynamicIsland.height + dynamicIsland.topOffset}px);
                  }
                }
              </style>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                // Definicje tematu, stylów i komponentów pomocniczych
                const theme = {
                  colors: {
                    primary: '#4f46e5',
                    primaryHover: '#4338ca',
                    secondary: '#f3f4f6',
                    secondaryHover: '#e5e7eb',
                    text: {
                      primary: '#111827',
                      secondary: '#6b7280',
                      tertiary: '#9ca3af',
                      inverse: '#ffffff'
                    },
                    background: {
                      main: '#ffffff',
                      accent: '#f9fafb',
                      card: '#ffffff'
                    },
                    border: '#e5e7eb'
                  },
                  spacing: {
                    xs: '0.25rem',
                    sm: '0.5rem',
                    md: '1rem',
                    lg: '1.5rem',
                    xl: '2rem'
                  },
                  borderRadius: {
                    sm: '6px',
                    md: '8px',
                    lg: '12px',
                    full: '9999px'
                  },
                  fontSize: {
                    xs: '0.7rem',
                    sm: '0.85rem',
                    md: '0.95rem',
                    lg: '1rem',
                    xl: '1.25rem',
                    xxl: '1.5rem'
                  },
                  shadow: {
                    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    md: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                };

                // Funkcja tworząca style
                const createStyles = (orientation) => {
                  const isLandscape = orientation === 'landscape';
                  
                  // Obliczamy odpowiednie odstępy dla Dynamic Island
                  const dynamicIslandPadding = isLandscape ? 0 : (${dynamicIsland.height} * 0.4 + ${dynamicIsland.topOffset}) + 'px';
                  
                  return {
                    container: {
                      height: '100%',
                      width: '100%',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                      margin: 0,
                      padding: 0,
                      boxSizing: 'border-box',
                      backgroundColor: theme.colors.background.main,
                      overflow: 'hidden'
                    },
                    pwaContainer: {
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      width: '100%',
                      backgroundColor: theme.colors.background.main,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0
                    },
                    contentWrapper: {
                      flex: 1,
                      overflow: 'auto',
                      paddingBottom: isLandscape ? '50px' : '60px',
                      paddingTop: dynamicIslandPadding,
                      WebkitOverflowScrolling: 'touch'
                    },
                    pwaWelcome: {
                      padding: \`\${theme.spacing.xl} \${theme.spacing.md} \${theme.spacing.lg}\`,
                      textAlign: 'center',
                      backgroundColor: theme.colors.background.accent
                    },
                    welcomeTitle: {
                      fontSize: theme.fontSize.xxl,
                      fontWeight: 600,
                      margin: '0 0 0.5rem',
                      color: theme.colors.text.primary
                    },
                    welcomeSubtitle: {
                      fontSize: theme.fontSize.md,
                      margin: 0,
                      color: theme.colors.text.secondary
                    },
                    welcomeIcon: {
                      margin: \`0 auto \${theme.spacing.md}\`,
                      width: '48px',
                      height: '48px'
                    },
                    pwaFeatures: {
                      padding: isLandscape ? theme.spacing.md : \`\${theme.spacing.lg} \${theme.spacing.md}\`,
                      display: 'grid',
                      gridTemplateColumns: isLandscape ? 'repeat(3, 1fr)' : '1fr',
                      gap: isLandscape ? theme.spacing.sm : theme.spacing.md
                    },
                    featureItem: {
                      backgroundColor: theme.colors.background.card,
                      padding: theme.spacing.md,
                      borderRadius: theme.borderRadius.md,
                      boxShadow: theme.shadow.sm,
                      transition: theme.transition
                    },
                    featureIcon: {
                      marginBottom: theme.spacing.sm,
                      width: '24px',
                      height: '24px'
                    },
                    featureTitle: {
                      margin: \`0 0 \${theme.spacing.xs}\`,
                      fontSize: theme.fontSize.lg,
                      fontWeight: 600,
                      color: theme.colors.text.primary
                    },
                    featureDescription: {
                      margin: 0,
                      fontSize: theme.fontSize.sm,
                      color: theme.colors.text.secondary,
                      lineHeight: 1.5
                    },
                    pwaCta: {
                      padding: \`\${theme.spacing.lg} \${theme.spacing.md}\`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: theme.spacing.sm
                    },
                    primaryButton: {
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.text.inverse,
                      border: 'none',
                      padding: \`\${theme.spacing.sm} \${theme.spacing.md}\`,
                      borderRadius: theme.borderRadius.sm,
                      fontWeight: 500,
                      fontSize: theme.fontSize.md,
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                      transition: theme.transition
                    },
                    secondaryButton: {
                      backgroundColor: theme.colors.secondary,
                      color: theme.colors.text.secondary,
                      border: \`1px solid \${theme.colors.border}\`,
                      padding: \`\${theme.spacing.sm} \${theme.spacing.md}\`,
                      borderRadius: theme.borderRadius.sm,
                      fontWeight: 500,
                      fontSize: theme.fontSize.md,
                      cursor: 'pointer',
                      WebkitTapHighlightColor: 'transparent',
                      transition: theme.transition
                    },
                    pwaNav: {
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      padding: \`\${theme.spacing.sm} 0\`,
                      backgroundColor: theme.colors.background.main,
                      borderTop: \`1px solid \${theme.colors.border}\`,
                      position: 'fixed',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      height: isLandscape ? '50px' : '60px',
                      boxSizing: 'border-box',
                      paddingLeft: '24px',
                      paddingRight: '24px'
                    },
                    navItem: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: theme.fontSize.xs,
                      color: theme.colors.text.tertiary,
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer',
                      flex: '1 0 auto',
                      maxWidth: '25%',
                      paddingTop: '6px',
                      paddingBottom: '2px'
                    },
                    navItemActive: {
                      color: theme.colors.primary
                    },
                    navIcon: {
                      marginBottom: theme.spacing.xs,
                      width: '22px',
                      height: '22px'
                    }
                  };
                };
                
                // Komponenty SVG
                const LogoIcon = () => (
                  <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="16" fill="#4F46E5"/>
                    <path d="M32 16L44 28L32 40L20 28L32 16Z" fill="white"/>
                    <path d="M32 24L38 30L32 36L26 30L32 24Z" fill="#4F46E5"/>
                  </svg>
                );
                
                const ProjectsIcon = () => (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4F46E5" strokeWidth="2"/>
                    <path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2"/>
                    <path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2"/>
                  </svg>
                );
                
                const TasksIcon = () => (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3Z" stroke="#4F46E5" strokeWidth="2"/>
                    <path d="M9 7H15" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 11H15" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M9 15H13" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                );
                
                const TimeIcon = () => (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4F46E5" strokeWidth="2"/>
                    <path d="M12 6V12L16 14" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                );
                
                // Komponenty nawigacji
                const HomeIcon = ({ active }) => (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                );
                
                const ProfileIcon = ({ active }) => (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                );
                
                const InfoIcon = ({ active }) => (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                );
                
                const MessageIcon = ({ active }) => (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 7L12 13L21 7" stroke={active ? "#4F46E5" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                );
                
                // Komponent cechy/funkcji z animacją najechania
                const FeatureItem = ({ icon, title, description }) => {
                  const [isHovered, setIsHovered] = useState(false);
                  const styles = useMemo(() => createStyles('portrait'), []);
                  
                  return (
                    <div 
                      style={{
                        ...styles.featureItem,
                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                        boxShadow: isHovered ? theme.shadow.md : theme.shadow.sm
                      }}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div style={styles.featureIcon}>{icon}</div>
                      <h3 style={styles.featureTitle}>{title}</h3>
                      <p style={styles.featureDescription}>{description}</p>
                    </div>
                  );
                };
                
                // Komponent przycisku
                const Button = ({ children, primary = false, onClick }) => {
                  const [isHovered, setIsHovered] = useState(false);
                  const [isActive, setIsActive] = useState(false);
                  const styles = useMemo(() => createStyles('portrait'), []);
                  
                  const buttonStyle = {
                    ...(primary ? styles.primaryButton : styles.secondaryButton),
                    backgroundColor: primary 
                      ? (isHovered ? theme.colors.primaryHover : theme.colors.primary)
                      : (isHovered ? theme.colors.secondaryHover : theme.colors.secondary),
                    transform: isActive ? 'scale(0.98)' : 'scale(1)'
                  };
                  
                  return (
                    <button 
                      style={buttonStyle}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      onMouseDown={() => setIsActive(true)}
                      onMouseUp={() => setIsActive(false)}
                      onTouchStart={() => setIsActive(true)}
                      onTouchEnd={() => setIsActive(false)}
                      onClick={onClick}
                    >
                      {children}
                    </button>
                  );
                };
                
                // Komponent przycisku w nawigacji z animacją
                const NavItem = ({ icon, label, active, onClick }) => {
                  const [isPressed, setIsPressed] = useState(false);
                  const styles = useMemo(() => createStyles('portrait'), []);
                  
                  return (
                    <div 
                      style={{
                        ...styles.navItem,
                        ...(active ? styles.navItemActive : {}),
                        transform: isPressed ? 'scale(0.95)' : 'scale(1)'
                      }} 
                      onClick={onClick}
                      onTouchStart={() => setIsPressed(true)}
                      onTouchEnd={() => setIsPressed(false)}
                      onMouseDown={() => setIsPressed(true)}
                      onMouseUp={() => setIsPressed(false)}
                    >
                      {icon}
                      <span>{label}</span>
                    </div>
                  );
                };
                
                // Kod aplikacji - to jest to, co widoczne w edytorze
                ${htmlContent}
              </script>
            </body>
            </html>
          `);
          iframeDoc.close();
          
          // Po pełnym załadowaniu iframe
          iframeRef.current.onload = () => {
            setIsLoading(false);
            
            // Ustawiamy orientację po załadowaniu
            setTimeout(() => {
              try {
                if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage({
                    type: 'orientation-change',
                    orientation: orientation,
                    deviceSpecs: {
                      width: viewportDimensions.width,
                      height: viewportDimensions.height,
                      dynamicIsland: {
                        width: dynamicIsland.width,
                        height: dynamicIsland.height,
                        topOffset: dynamicIsland.topOffset
                      }
                    }
                  }, '*');
                }
              } catch (error) {
                console.error('Błąd inicjalizacji orientacji:', error);
              }
            }, 100);
          };
        }
      } catch (error) {
        console.error('Błąd ładowania iframe:', error);
        setIsLoading(false);
      }
    }
  };
  
  // Ładowanie iframe podczas inicjalizacji i po zmianie kodu
  useEffect(() => {
    updateIframeContent(codeValue);
  }, [codeValue, orientation]);
  
  // Zmiana orientacji
  const handleOrientationChange = (newOrientation: OrientationType) => {
    setOrientation(newOrientation);
  };
  
  // Obsługa zmian w kodzie
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeValue(e.target.value);
  };
  
  // Odświeżenie podglądu
  const refreshPreview = () => {
    updateIframeContent(codeValue);
  };

  return (
    <div className="simulator-page">
      <h1 className="page-title">Symulator Aplikacji Mobilnych React (iPhone 15 Pro)</h1>
      
      <div className="simulator-layout">
        {/* Lewa strona - symulator iPhone */}
        <div className="simulator-section">
          <div className="control-options">
            <div className="orientation-selector">
              <button
                className={orientation === 'portrait' ? 'active' : ''}
                onClick={() => handleOrientationChange('portrait')}
                title="Orientacja pionowa"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="7" y="4" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="10" y1="18" x2="14" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                className={orientation === 'landscape' ? 'active' : ''}
                onClick={() => handleOrientationChange('landscape')}
                title="Orientacja pozioma"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="7" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="18" y1="14" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            <button 
              onClick={refreshPreview}
              className="refresh-button"
              title="Odśwież podgląd"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 9.00001C19.9828 7.5668 19.1209 6.28542 17.9845 5.27543C16.8482 4.26545 15.4748 3.55976 13.9917 3.22427C12.5086 2.88879 10.9693 2.93436 9.50481 3.35685C8.04034 3.77935 6.70486 4.56467 5.64 5.64001L1 10M23 14L18.36 18.36C17.2951 19.4354 15.9596 20.2207 14.4951 20.6432C13.0307 21.0657 11.4914 21.1113 10.0083 20.7758C8.52515 20.4403 7.15181 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="device-frame-container">
            <div 
              className={`device-frame ios ${orientation}`}
              style={{
                width: deviceDimensions[orientation].width + 'px',
                height: deviceDimensions[orientation].height + 'px',
                position: 'relative'
              }}
            >
              {/* Ramka iPhone */}
              <img 
                src="/frames/iphone.svg" 
                alt="iPhone frame" 
                className="device-image"
                style={{ 
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 10,
                  objectFit: 'contain',
                  filter: "drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.12))"
                }}
              />
              
              {/* Ekran aplikacji */}
              <div 
                className="device-screen" 
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  top: deviceDimensions[orientation].screenOffsetY + 'px',
                  left: deviceDimensions[orientation].screenOffsetX + 'px',
                  width: deviceDimensions[orientation].screenWidth + 'px',
                  height: deviceDimensions[orientation].screenHeight + 'px',
                  borderRadius: (30 * scale) + 'px',
                  overflow: 'hidden',
                  backgroundColor: 'white'
                }}
              >
                {/* Dynamic Island - tylko w orientacji portretowej */}
                {orientation === 'portrait' && (
                  <div className="dynamic-island"
                    style={{
                      position: 'absolute',
                      top: deviceDimensions.portrait.dynamicIslandTopOffset + 'px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: deviceDimensions.portrait.dynamicIslandWidth + 'px',
                      height: deviceDimensions.portrait.dynamicIslandHeight + 'px',
                      backgroundColor: 'black',
                      borderRadius: (20 * scale) + 'px',
                      zIndex: 100
                    }}
                  />
                )}
                
                {isLoading ? (
                  <div className="loading-screen">
                    <div className="loading-spinner"></div>
                    <p>Ładowanie aplikacji...</p>
                  </div>
                ) : null}
                <iframe 
                  ref={iframeRef}
                  className="pwa-iframe"
                  title="PWA Preview"
                  frameBorder="0"
                  scrolling="yes"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                    border: 'none'
                  }}
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            </div>
          </div>
          
          {/* Informacja o wymiarach */}
          <div className="device-info">
            <p>Viewport: {viewportDimensions.width}×{viewportDimensions.height}px</p>
            <p>SVG: {svgDimensions.portrait.width}×{svgDimensions.portrait.height}px</p>
            <p>Skala: {Math.round(scale * 100)}%</p>
          </div>
        </div>
        
        {/* Prawa strona - edytor kodu */}
        <div className="code-editor-section">
          <div className="editor-header">
            <h2>Edytor Kodu React</h2>
            <div className="editor-controls">
              <button 
                onClick={refreshPreview}
                className="apply-button"
              >
                Zastosuj zmiany
              </button>
            </div>
          </div>
          <textarea 
            className="code-editor"
            value={codeValue}
            onChange={handleCodeChange}
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
}

export default MobilePWASimulator;