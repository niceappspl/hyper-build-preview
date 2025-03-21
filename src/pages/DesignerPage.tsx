import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ChatInterface from '../components/ChatInterface';
import DeviceSelector from '../components/DeviceSelector';
import { FiUser, FiServer, FiZap, FiKey, FiSettings, FiCode, FiSmartphone, FiDownload, FiFolder, FiFile, 
         FiChevronRight, FiSearch, FiCopy, FiRefreshCw, FiPlus, FiTrash2, FiSave, FiPlay, FiMaximize, FiLayout } from 'react-icons/fi';
import { SiSupabase, SiFirebase, SiReact, SiJavascript, SiTypescript, SiCss3 } from 'react-icons/si';
import { FaDatabase } from 'react-icons/fa';
import SpotifyMock from '../mocks/SpotifyMock';
import { motion } from 'framer-motion';

interface LocationState {
  prompt: string;
  isPublic: boolean;
}

const DesignerPage: React.FC = () => {
  const location = useLocation();
  const { prompt: initialPrompt, isPublic } = (location.state as LocationState) || { prompt: '', isPublic: false };
  const [currentPrompt, setCurrentPrompt] = useState(initialPrompt);
  const [selectedDevice, setSelectedDevice] = useState<'iphone' | 'android'>('iphone');
  const [activeTab, setActiveTab] = useState<'assistant' | 'backend' | 'code'>('assistant');
  const [selectedFile, setSelectedFile] = useState('App.js');
  const [expandedFolders, setExpandedFolders] = useState(['src', 'components']);
  const [mockType, setMockType] = useState<'default' | 'spotify'>('spotify');
  const [showDeviceOptions, setShowDeviceOptions] = useState(false);
  const [viewMode, setViewMode] = useState<'app' | 'code' | 'split'>('app');
  const deviceSelectorRef = useRef<HTMLDivElement>(null);

  const handleChatMessage = (message: string) => {
    console.log('Received message:', message);
    setCurrentPrompt(message);
    if (message.toLowerCase().includes('spotify')) {
      setMockType('spotify');
    }
  };

  const toggleFolder = (folder: string) => {
    if (expandedFolders.includes(folder)) {
      setExpandedFolders(expandedFolders.filter(f => f !== folder));
    } else {
      setExpandedFolders([...expandedFolders, folder]);
    }
  };

  const fileStructure = [
    { name: 'public', type: 'folder', children: [
      { name: 'index.html', type: 'file', icon: <span className="text-orange-400">&#9679;</span> },
      { name: 'manifest.json', type: 'file', icon: <span className="text-gray-400">&#9679;</span> },
    ]},
    { name: 'src', type: 'folder', children: [
      { name: 'App.js', type: 'file', icon: <SiReact className="text-blue-400 w-3 h-3" /> },
      { name: 'index.js', type: 'file', icon: <SiJavascript className="text-yellow-400 w-3 h-3" /> },
      { name: 'styles.css', type: 'file', icon: <SiCss3 className="text-blue-500 w-3 h-3" /> },
      { name: 'components', type: 'folder', children: [
        { name: 'Header.js', type: 'file', icon: <SiReact className="text-blue-400 w-3 h-3" /> },
        { name: 'Button.js', type: 'file', icon: <SiReact className="text-blue-400 w-3 h-3" /> },
        { name: 'Card.js', type: 'file', icon: <SiReact className="text-blue-400 w-3 h-3" /> },
      ]},
      { name: 'utils', type: 'folder', children: [
        { name: 'helpers.js', type: 'file', icon: <SiJavascript className="text-yellow-400 w-3 h-3" /> },
        { name: 'api.js', type: 'file', icon: <SiJavascript className="text-yellow-400 w-3 h-3" /> },
      ]},
    ]},
    { name: 'package.json', type: 'file', icon: <span className="text-gray-400">&#9679;</span> },
    { name: 'README.md', type: 'file', icon: <span className="text-gray-400">&#9679;</span> },
  ];

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item) => {
      if (item.type === 'folder') {
        const isExpanded = expandedFolders.includes(item.name);
        return (
          <div key={item.name}>
            <div 
              className={`flex items-center px-2.5 py-1 rounded-md hover:bg-neutral-900 cursor-pointer group ${level > 0 ? `ml-${level * 2}` : ''}`}
              onClick={() => toggleFolder(item.name)}
              style={{ marginLeft: level * 10 }}
            >
              <FiChevronRight className={`w-3 h-3 mr-1.5 text-neutral-400 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`} />
              <FiFolder className={`${isExpanded ? 'text-blue-400' : 'text-neutral-400'} w-4 h-4 mr-2`} />
              <span className="text-sm">{item.name}</span>
              <div className="hidden group-hover:flex ml-auto space-x-1">
                <button className="p-0.5 hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-300">
                  <FiPlus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className={`${isExpanded ? 'animate-slideDown' : 'hidden'}`}>
              {isExpanded && item.children && renderFileTree(item.children, level + 1)}
            </div>
          </div>
        );
      } else {
        return (
          <div 
            key={item.name} 
            className={`flex items-center px-2.5 py-1 rounded-md cursor-pointer group
              ${selectedFile === item.name ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-900 text-neutral-300'}`}
            onClick={() => setSelectedFile(item.name)}
            style={{ marginLeft: (level * 10) + 18 }}
          >
            {item.icon ? (
              <span className="w-4 h-4 mr-2 flex items-center justify-center">{item.icon}</span>
            ) : (
              <FiFile className="w-4 h-4 mr-2 text-neutral-400" />
            )}
            <span className="text-sm">{item.name}</span>
            <div className="hidden group-hover:flex ml-auto space-x-1">
              <button className="p-0.5 hover:bg-neutral-800 rounded text-neutral-500 hover:text-neutral-300">
                <FiTrash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      }
    });
  };

  const getFileContent = () => {
    switch (selectedFile) {
      case 'App.js':
        return `import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your App</Text>
      <Text style={styles.subtitle}>${currentPrompt || 'Your custom mobile application'}</Text>
      
      <View style={styles.card}>
        <Text style={styles.counter}>{count}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>Increment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counter: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default App;`;
      case 'index.js':
        return `import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);`;
      case 'styles.css':
        return `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background-color: #007BFF;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.button:hover {
  background-color: #0069D9;
}

.card {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Additional styles based on the prompt: "${currentPrompt}" */`;
      default:
        return `// ${selectedFile}\n// Generated content will appear here`;
    }
  };

  // Podświetlanie składni dla różnych typów plików
  const highlightSyntax = (code: string, file: string) => {
    if (file.endsWith('.js')) {
      // Podświetlanie składni JavaScript/React
      return code
        .replace(/(import|export|from|const|let|var|function|return|if|else|switch|case|break|default|for|while|do|class|extends|new|this|super|try|catch|finally|throw|async|await)\b/g, '<span class="text-purple-400">$1</span>')
        .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="text-amber-300">$1</span>')
        .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, '<span class="text-yellow-500">$1</span>')
        .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-blue-300">$1</span>')
        .replace(/\b(useState|useEffect|useRef|useCallback|useMemo|useContext)\b/g, '<span class="text-cyan-400">$1</span>')
        .replace(/\b(React|View|Text|StyleSheet|TouchableOpacity|AppRegistry)\b/g, '<span class="text-blue-400">$1</span>')
        .replace(/\/\/(.*)/g, '<span class="text-gray-500">\/\/$1</span>')
        .replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-gray-500">\/\*$1\*\/</span>');
    } else if (file.endsWith('.css')) {
      // Podświetlanie składni CSS
      return code
        .replace(/(\.\w+)\s*\{/g, '<span class="text-blue-400">$1</span> {')
        .replace(/([\w-]+)\s*:/g, '<span class="text-cyan-400">$1</span>:')
        .replace(/:\s*([^;}<]+)/g, ': <span class="text-amber-300">$1</span>')
        .replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-gray-500">\/\*$1\*\/</span>');
    }
    // Domyślnie zwróć kod bez podświetlenia
    return code;
  };

  // Generowanie numerów linii dla kodu z podświetlaniem składni
  const renderCodeWithLineNumbers = () => {
    const code = getFileContent();
    const lines = code.split('\n');
    const highlightedCode = highlightSyntax(code, selectedFile);
    const highlightedLines = highlightedCode.split('\n');
    
    return (
      <div className="flex">
        <div className="user-select-none text-right pr-3 border-r border-neutral-800 bg-black pt-4 pb-4">
          {lines.map((_, i) => (
            <div key={i} className="text-neutral-400 text-sm leading-6 px-2 font-mono">
              {i + 1}
            </div>
          ))}
        </div>
        <div className="flex-1 pt-4 pb-4 pl-4 overflow-x-auto relative">
          <div className="absolute left-0 top-[84px] w-full h-6 bg-neutral-800 opacity-20"></div>
          <div className="text-sm text-neutral-300 font-mono leading-6">
            {highlightedLines.map((line, i) => (
              <div key={i} className="whitespace-pre" dangerouslySetInnerHTML={{ __html: line || ' ' }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Funkcja do renderowania podglądu urządzenia
  const renderDevicePreview = () => {
    // Definiujemy rzeczywiste proporcje iPhone'a
    const iphoneWidth = 393;
    const iphoneHeight = 852;
    const androidWidth = 393;
    const androidHeight = 852;
    
    // Ustalamy skalę dla interfejsu (zwiększamy szerokość dla lepszego wyświetlania)
    const scale = 0.7; // Skala do dopasowania do interfejsu
    const deviceWidth = selectedDevice === 'iphone' ? iphoneWidth * scale : androidWidth * scale;
    const deviceHeight = selectedDevice === 'iphone' ? iphoneHeight * scale : androidHeight * scale;
    
    // Obliczamy marginesy dla zawartości z uwzględnieniem Dynamic Island i Home Indicator
    const contentMarginX = deviceWidth * 0.05; // 5% marginesu po bokach
    const contentMarginTop = deviceWidth * 0.06; // 6% marginesu z góry (dla Dynamic Island)
    const contentMarginBottom = deviceWidth * 0.07; // 7% marginesu z dołu (dla Home Indicator)
    const contentWidth = deviceWidth - (contentMarginX * 2);
    const contentHeight = deviceHeight - contentMarginTop - contentMarginBottom;
    
    return (
      <div className="flex-1 flex justify-center items-center p-4 overflow-auto bg-[#080808]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="transform transition-transform duration-300 relative"
        >
          {/* Glow effect pod urządzeniem */}
          <div className="absolute -inset-2 bg-gradient-to-b from-blue-500/10 to-cyan-500/10 rounded-[50px] blur-xl"></div>
          
          {/* Phone Frame */}
          <div className="relative" style={{ width: `${deviceWidth}px`, height: `${deviceHeight}px` }}>
            {/* iPhone Frame */}
            <div className="absolute inset-0 pointer-events-none z-10">
              <img 
                src="/frames/iphone.svg" 
                alt="iPhone frame" 
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Phone Content */}
            <div className="absolute z-0 rounded-[30px] overflow-hidden" style={{ 
              top: `${contentMarginTop}px`, 
              left: `${contentMarginX}px`, 
              width: `${contentWidth}px`, 
              height: `${contentHeight}px`
            }}>
              {mockType === 'spotify' && (
                <div className="w-full h-full relative">
                  <SpotifyMock containerStyle={{ position: 'relative', height: '100%' }} />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#050505] text-white relative">
      {/* Tło z gradientem i siatką */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtelna siatka */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Gradient nakładka */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent" />
        
        {/* Gradient orbs - jaśniejsze */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/20 to-blue-700/20 rounded-full blur-[100px] opacity-80" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-400/20 to-cyan-500/20 rounded-full blur-[100px] opacity-80" />
      </div>
      
      <Header />
      
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 px-6 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">App Designer</h1>
              <div className="flex items-center mt-0.5">
                <p className="text-[10px] text-neutral-400 mr-2">
                  {isPublic ? 'Public project' : 'Private project'} • Created just now
                </p>
                {/* Wskaźnik statusu projektu - obok nazwy */}
                <div className="flex items-center px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  <span className="text-[10px] text-green-300">Active</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Uproszczona sekcja z dodatkowymi informacjami o projekcie i opcjami współdzielenia */}
          <div className="flex items-center space-x-3">
            {/* Link do udostępniania - bardziej widoczny */}
            <div className="hidden md:flex items-center bg-[#0c0c0c] rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors shadow-sm">
              <input type="text" 
                value="https://hyperbuild.ai/project/12345" 
                className="bg-transparent text-xs text-neutral-300 px-3 py-1.5 focus:outline-none w-60"
                readOnly
              />
              <button className="bg-[#181818] text-neutral-200 hover:text-blue-400 px-3 py-1.5 rounded-r-lg border-l border-neutral-800 transition-colors flex items-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FiCopy className="w-3.5 h-3.5" />
                </motion.div>
              </button>
            </div>
            
            {/* Przycisk udostępniania - większy i bardziej widoczny */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3.5 py-1.5 bg-[#181818] hover:bg-[#222] rounded-lg text-sm text-white transition-colors font-medium border border-neutral-800 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15l4.5-4.5 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 10.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.25 13.5V6.75a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Share</span>
            </motion.button>
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden gap-6">
          {/* Lewa strona - ramka urządzenia (40%) */}
          <div className="w-[42%] flex flex-col bg-[#0a0a0a]/80 backdrop-blur-md overflow-hidden rounded-2xl border border-neutral-800 shadow-xl">
            <div className="p-3 flex justify-between items-center border-b border-neutral-800 backdrop-filter backdrop-blur-lg bg-black/30">
              <h3 className="text-sm font-medium text-white flex items-center">
                <FiLayout className="mr-2 text-blue-400" />
                Device Preview
              </h3>
              
              <div className="flex items-center space-x-2">
                {/* Przyciski trybu podglądu */}
                <div className="flex bg-[#111] rounded-lg border border-neutral-800 p-0.5">
                  <button 
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${viewMode === 'app' ? 'bg-blue-500/20 text-white' : 'text-neutral-400 hover:text-white'}`}
                    onClick={() => setViewMode('app')}
                  >
                    App
                  </button>
                  <button 
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${viewMode === 'code' ? 'bg-blue-500/20 text-white' : 'text-neutral-400 hover:text-white'}`}
                    onClick={() => setViewMode('code')}
                  >
                    Code
                  </button>
                  <button 
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${viewMode === 'split' ? 'bg-blue-500/20 text-white' : 'text-neutral-400 hover:text-white'}`}
                    onClick={() => setViewMode('split')}
                  >
                    Split
                  </button>
                </div>
              
                {/* Nowy komponent DeviceSelector */}
                <DeviceSelector 
                  selectedDevice={selectedDevice}
                  onChange={setSelectedDevice}
                />
              </div>
            </div>
            
            {/* Renderowanie podglądu urządzenia z nowym tłem */}
            <div className="flex-1 flex justify-center items-center p-8 overflow-auto bg-gradient-to-b from-[#0c0c0c] to-black relative">
              {/* Renderowanie w zależności od trybu podglądu */}
              {viewMode === 'app' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="transform transition-transform duration-300 relative"
                >
                  {/* Glow effect pod urządzeniem - usunięty */}
                  
                  {/* Phone Frame */}
                  <div className="relative" style={{ width: `${selectedDevice === 'iphone' ? 393 * 0.7 : 393 * 0.7}px`, 
                                                    height: `${selectedDevice === 'iphone' ? 852 * 0.7 : 852 * 0.7}px` }}>
                    {/* iPhone Frame */}
                    <div className="absolute inset-0 pointer-events-none z-10">
                      <img 
                        src="/frames/iphone.svg" 
                        alt="iPhone frame" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Phone Content */}
                    <div className="absolute z-0 rounded-[30px] overflow-hidden" style={{ 
                      top: `${(393 * 0.7) * 0.06}px`, 
                      left: `${(393 * 0.7) * 0.05}px`, 
                      width: `${(393 * 0.7) - ((393 * 0.7) * 0.05 * 2)}px`, 
                      height: `${(852 * 0.7) - ((393 * 0.7) * 0.06) - ((393 * 0.7) * 0.07)}px`
                    }}>
                      {mockType === 'spotify' && (
                        <div className="w-full h-full relative">
                          <SpotifyMock containerStyle={{ position: 'relative', height: '100%' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              
              {viewMode === 'code' && (
                <div className="w-full h-full bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
                  <div className="h-12 bg-[#111] border-b border-neutral-800 flex items-center px-4">
                    <span className="text-sm font-medium text-neutral-300 flex items-center">
                      <SiReact className="text-blue-400 w-4 h-4 mr-2" />
                      App.js
                    </span>
                  </div>
                  <div className="p-4 text-xs font-mono text-neutral-300 overflow-auto h-[calc(100%-3rem)]">
                    <pre className="whitespace-pre-wrap">{getFileContent()}</pre>
                  </div>
                </div>
              )}
              
              {viewMode === 'split' && (
                <div className="w-full h-full flex space-x-4">
                  <div className="w-1/2 h-full flex justify-center items-center">
                    <motion.div className="relative scale-75">
                      {/* Glow effect pod urządzeniem - usunięty */}
                      <div className="relative" style={{ width: `${selectedDevice === 'iphone' ? 393 * 0.7 : 393 * 0.7}px`, 
                                                      height: `${selectedDevice === 'iphone' ? 852 * 0.7 : 852 * 0.7}px` }}>
                        <div className="absolute inset-0 pointer-events-none z-10">
                          <img src="/frames/iphone.svg" alt="iPhone frame" className="w-full h-full object-contain" />
                        </div>
                        <div className="absolute z-0 rounded-[30px] overflow-hidden" style={{ 
                          top: `${(393 * 0.7) * 0.06}px`, 
                          left: `${(393 * 0.7) * 0.05}px`, 
                          width: `${(393 * 0.7) - ((393 * 0.7) * 0.05 * 2)}px`, 
                          height: `${(852 * 0.7) - ((393 * 0.7) * 0.06) - ((393 * 0.7) * 0.07)}px`
                        }}>
                          {mockType === 'spotify' && (
                            <div className="w-full h-full relative">
                              <SpotifyMock containerStyle={{ position: 'relative', height: '100%' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="w-1/2 h-full bg-[#0a0a0a] rounded-xl border border-neutral-800 overflow-hidden">
                    <div className="h-12 bg-[#111] border-b border-neutral-800 flex items-center px-4">
                      <span className="text-sm font-medium text-neutral-300 flex items-center">
                        <SiReact className="text-blue-400 w-4 h-4 mr-2" />
                        App.js
                      </span>
                    </div>
                    <div className="p-4 text-xs font-mono text-neutral-300 overflow-auto h-[calc(100%-3rem)]">
                      <pre className="whitespace-pre-wrap">{getFileContent()}</pre>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Floating Action Buttons - przeniesione z nagłówka */}
              <div className="absolute bottom-6 right-6 flex flex-col space-y-3">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg text-white"
                  title="Export Application"
                >
                  <FiDownload className="w-5 h-5" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-3 rounded-full bg-[#1a1a1a] border border-neutral-700 shadow-lg text-white"
                  title="Open on Device"
                >
                  <FiSmartphone className="w-5 h-5" />
                </motion.button>
              </div>
              
              {/* Dodatkowy floating button po lewej stronie */}
              <div className="absolute bottom-6 left-6">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center p-3 rounded-full bg-[#1a1a1a] border border-neutral-700 shadow-lg text-white"
                  title="Preview Options"
                >
                  <FiMaximize className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Prawa strona - interfejs czatu (60%) */}
          <div className="w-[58%] overflow-hidden flex flex-col bg-[#0a0a0a]/80 backdrop-blur-sm rounded-2xl border border-neutral-800 shadow-xl">
            <div className="bg-black/40 backdrop-blur-sm">
              <div className="flex border-b border-neutral-800">
                <button
                  className={`px-6 py-3 text-sm font-medium transition-all ${
                    activeTab === 'assistant' 
                      ? 'text-white border-b-2 border-blue-500' 
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  onClick={() => setActiveTab('assistant')}
                >
                  <div className="flex items-center">
                    <FiUser className={`w-4 h-4 mr-2 ${activeTab === 'assistant' ? 'text-blue-400' : ''}`} />
                    <span>Assistant</span>
                  </div>
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium transition-all ${
                    activeTab === 'backend' 
                      ? 'text-white border-b-2 border-blue-500' 
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  onClick={() => setActiveTab('backend')}
                >
                  <div className="flex items-center">
                    <FiServer className={`w-4 h-4 mr-2 ${activeTab === 'backend' ? 'text-blue-400' : ''}`} />
                    <span>Backend Config</span>
                  </div>
                </button>
                <button
                  className={`px-6 py-3 text-sm font-medium transition-all ${
                    activeTab === 'code' 
                      ? 'text-white border-b-2 border-blue-500' 
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  onClick={() => setActiveTab('code')}
                >
                  <div className="flex items-center">
                    <FiCode className={`w-4 h-4 mr-2 ${activeTab === 'code' ? 'text-blue-400' : ''}`} />
                    <span>Code Editor</span>
                  </div>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {activeTab === 'assistant' ? (
                <ChatInterface 
                  initialPrompt={initialPrompt}
                  onSendMessage={handleChatMessage}
                />
              ) : activeTab === 'code' ? (
                <div className="h-full flex">
                  {/* File Explorer */}
                  <div className="w-[260px] h-full bg-[#0a0a0a] border-r border-neutral-800 flex flex-col">
                    <div className="p-3 border-b border-neutral-800 flex justify-between items-center bg-gradient-to-r from-[#131313] to-[#0c0c0c]">
                      <div className="text-sm font-medium text-neutral-300">EXPLORER</div>
                      <div className="flex space-x-2">
                        <button className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-blue-400 transition-colors">
                          <FiPlus className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-blue-400 transition-colors">
                          <FiSearch className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-blue-400 transition-colors">
                          <FiRefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto py-1 text-neutral-300 bg-gradient-to-b from-[#0c0c0c] to-black">
                      {renderFileTree(fileStructure)}
                    </div>
                  </div>
                  
                  {/* Code Editor */}
                  <div className="flex-1 flex flex-col h-full">
                    <div className="px-4 py-3 border-b border-neutral-800 bg-gradient-to-r from-[#131313] to-[#0c0c0c] flex items-center justify-between">
                      <div className="flex items-center">
                        {selectedFile === 'App.js' && <SiReact className="text-blue-400 w-5 h-5 mr-2.5" />}
                        {selectedFile === 'index.js' && <SiJavascript className="text-yellow-400 w-5 h-5 mr-2.5" />}
                        {selectedFile === 'styles.css' && <SiCss3 className="text-blue-500 w-5 h-5 mr-2.5" />}
                        <span className="text-sm font-medium">{selectedFile}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center bg-[#111] hover:bg-[#222] text-sm px-3 py-1.5 rounded-md text-neutral-300 border border-neutral-800 transition-all"
                        >
                          <FiSave className="w-4 h-4 mr-2" />
                          Save
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm px-3 py-1.5 rounded-md text-white ml-1 shadow-md transition-all"
                        >
                          <FiPlay className="w-4 h-4 mr-2" />
                          Run
                        </motion.button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto bg-gradient-to-b from-[#0a0a0a] to-black">
                      <div className="relative">
                        {/* Subtle glow for code - jaśniejszy */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-md opacity-70 pointer-events-none"></div>
                        {renderCodeWithLineNumbers()}
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-neutral-800 bg-[#0c0c0c] flex justify-between items-center text-sm text-neutral-500">
                      <div>Ln 18, Col 24</div>
                      <div className="flex space-x-4">
                        <span>Spaces: 2</span>
                        <span>UTF-8</span>
                        <span>React</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full bg-gradient-to-b from-[#0c0c0c] to-black p-8">
                  <div className="mb-8">
                    <h3 className="text-base font-semibold mb-4 flex items-center">
                      <FaDatabase className="w-5 h-5 mr-3 text-blue-400" />
                      <span>Database Connection</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button 
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="flex flex-col items-center justify-center p-6 bg-[#131313] rounded-xl hover:bg-[#161616] transition-all border border-neutral-800 group relative"
                      >
                        {/* Glow behind button - jaśniejszy */}
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                        <SiSupabase className="w-8 h-8 mb-3 text-blue-400 group-hover:text-blue-300" />
                        <span className="text-sm font-medium">Supabase</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="flex flex-col items-center justify-center p-6 bg-[#131313] rounded-xl hover:bg-[#161616] transition-all border border-neutral-800 group relative"
                      >
                        {/* Glow behind button - jaśniejszy */}
                        <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                        <SiFirebase className="w-8 h-8 mb-3 text-amber-500 group-hover:text-amber-400" />
                        <span className="text-sm font-medium">Firebase</span>
                      </motion.button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold mb-4 flex items-center">
                      <FiSettings className="w-5 h-5 mr-3 text-blue-400" />
                      <span>Configuration</span>
                    </h3>
                    <div className="bg-[#0c0c0c] rounded-xl p-6 border border-neutral-800 relative">
                      {/* Subtle gradient behind card - jaśniejszy */}
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl blur-md opacity-40"></div>
                      <div className="relative">
                        <p className="text-sm text-neutral-400 mb-4">Configure your backend settings and database connection parameters.</p>
                        <div className="flex space-x-3">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 text-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-4 rounded-lg transition-all font-medium flex items-center justify-center shadow-md"
                          >
                            <FiZap className="w-5 h-5 mr-2.5" />
                            Connect Database
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 text-sm bg-[#111] hover:bg-[#191919] text-white py-3 px-4 rounded-lg transition-all font-medium flex items-center justify-center border border-neutral-700"
                          >
                            <FiKey className="w-5 h-5 mr-2.5" />
                            API Keys
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerPage; 