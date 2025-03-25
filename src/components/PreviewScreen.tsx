import React, { forwardRef, useImperativeHandle, useState } from 'react';
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
} from "@codesandbox/sandpack-react";

interface PreviewScreenProps {
  prompt: string;
  mockType?: 'default';
  selectedDevice?: 'iphone' | 'android';
  projectId?: string;
}

export interface PreviewScreenRef {
  refreshPreview: () => void;
}

// Przykładowe kody aplikacji
const APP_EXAMPLES = {
  helloWorld: {
    name: "Hello World",
    files: {
      "/App.js": `
import React from "react";

export default function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <h1 style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#333', 
        margin: '0 0 12px 0',
        width: '100%',
        textAlign: 'center',
        padding: '0 16px'
      }}>
        Hello Hyper Build!
      </h1>
      <p style={{ 
        fontSize: '14px', 
        color: '#666',
        margin: '0 0 20px 0',
        width: '100%',
        textAlign: 'center',
        padding: '0 16px'
      }}>
        To jest przykładowa aplikacja React
      </p>
      <div style={{ 
        width: '60px',
        height: '60px',
        borderRadius: '30px',
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '16px',
        flexShrink: '0'
      }}>
        <div style={{ fontSize: '24px', color: 'white' }}>👋</div>
      </div>
    </div>
  );
}`
    },
    dependencies: {}
  },
  counter: {
    name: "Counter App",
    files: {
      "/App.js": `
import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      paddingTop: 'env(safe-area-inset-top)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <h1 style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#333', 
        margin: '0 0 16px 0',
        width: '100%',
        textAlign: 'center',
        padding: '0 16px'
      }}>
        Counter App
      </h1>
      <p style={{ 
        fontSize: '36px', 
        fontWeight: 'bold', 
        color: '#0066cc', 
        margin: '0 0 20px 0',
        width: '100%',
        textAlign: 'center'
      }}>
        {count}
      </p>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        gap: '8px'
      }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{
            padding: '8px 14px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Increase
        </button>
        <button 
          onClick={() => setCount(count - 1)}
          style={{
            padding: '8px 14px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Decrease
        </button>
      </div>
    </div>
  );
}`
    },
    dependencies: {}
  },
  todoList: {
    name: "Todo List",
    files: {
      "/App.js": `
import React, { useState } from "react";

export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Complete Hyper Build project' },
    { id: '2', text: 'Review code changes' },
    { id: '3', text: 'Test new features' }
  ]);
  
  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task }]);
      setTask('');
    }
  };
  
  const removeTask = (id) => {
    setTasks(tasks.filter(item => item.id !== id));
  };
  
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      margin: 0,
      padding: '16px',
      paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
      paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)',
      paddingLeft: 'calc(env(safe-area-inset-left) + 16px)',
      paddingRight: 'calc(env(safe-area-inset-right) + 16px)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}>
      <h1 style={{ 
        fontSize: '18px', 
        fontWeight: 'bold', 
        margin: '0 0 16px 0',
        textAlign: 'center',
        color: '#333',
        width: '100%'
      }}>
        Todo List
      </h1>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        marginBottom: '12px',
        width: '100%'
      }}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a task..."
          style={{
            flex: '1',
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button 
          onClick={addTask}
          style={{
            marginLeft: '8px',
            padding: '0 10px',
            backgroundColor: '#0066cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Add
        </button>
      </div>
      
      <div style={{ 
        flex: '1', 
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {tasks.map((item) => (
          <div 
            key={item.id} 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              marginBottom: '8px',
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              border: '1px solid #f0f0f0'
            }}
          >
            <span style={{ 
              fontSize: '14px',
              wordBreak: 'break-word',
              flex: '1'
            }}>
              {item.text}
            </span>
            <button 
              onClick={() => removeTask(item.id)}
              style={{
                color: '#f44336',
                backgroundColor: 'transparent',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginLeft: '8px',
                fontSize: '14px'
              }}
            >
              Delete
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <p style={{ 
            textAlign: 'center', 
            color: '#666',
            fontSize: '14px',
            marginTop: '20px'
          }}>
            No tasks yet. Add some!
          </p>
        )}
      </div>
    </div>
  );
}`
    },
    dependencies: {}
  }
};

const PreviewScreen = forwardRef<PreviewScreenRef, PreviewScreenProps>(({ 
  prompt, 
  mockType = 'default',
  selectedDevice = 'iphone',
  projectId
}, ref) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentExample, setCurrentExample] = useState<string>("helloWorld");
  const [key, setKey] = useState<number>(0); // Klucz do wymuszenia rerenderowania

  // Podstawowe wymiary dla urządzenia
  const iphoneWidth = 393;
  const iphoneHeight = 852;
  const scale = 0.7;
  const deviceWidth = iphoneWidth * scale;
  const deviceHeight = iphoneHeight * scale;
  
  // Marginesy dla zawartości
  const contentMarginTop = deviceWidth * 0.06;
  const contentMarginX = deviceWidth * 0.05;
  const contentMarginBottom = deviceWidth * 0.07;
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

  // Bieżący przykład
  const currentApp = APP_EXAMPLES[currentExample as keyof typeof APP_EXAMPLES];

  // Lista przykładów do wyboru
  const examples = Object.entries(APP_EXAMPLES).map(([id, example]) => ({
    id,
    name: example.name
  }));

  // Zmiana przykładu
  const changeExample = (id: string) => {
    setIsLoading(true);
    setCurrentExample(id);
    setTimeout(() => {
      setKey(prev => prev + 1); // Wymusz ponowne renderowanie
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="relative transform transition-transform duration-300">
      <div className="relative" style={{ width: `${deviceWidth}px`, height: `${deviceHeight}px` }}>
        {/* Ramka iPhone */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <img 
            src="/frames/iphone.svg" 
            alt="iPhone frame" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Zawartość */}
        <div className="absolute z-0 rounded-[30px] overflow-hidden bg-white" style={{ 
          top: `${contentMarginTop}px`, 
          left: `${contentMarginX}px`, 
          width: `${contentWidth}px`, 
          height: `${contentHeight}px`
        }}>
          {isLoading ? (
            <div className="flex justify-center items-center h-full w-full bg-gray-100">
              <div className="text-gray-800 text-lg">Ładowanie podglądu...</div>
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden" key={key}>
              <SandpackProvider
                template="react"
                files={currentApp.files}
                theme="light"
                options={{
                  autorun: true
                }}
              >
                <SandpackLayout>
                  <SandpackPreview
                    showOpenInCodeSandbox={false}
                    showRefreshButton={false}
                    style={{ 
                      height: '100%', 
                      width: '100%', 
                      border: 'none'
                    }}
                  />
                </SandpackLayout>
              </SandpackProvider>
            </div>
          )}
        </div>
      </div>

      {/* Panel sterowania */}
      <div className="mt-4 flex flex-col items-center">
        <button 
          onClick={refreshPreview}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Odśwież podgląd
        </button>
        
        {/* Wybór przykładowych aplikacji */}
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2 text-center">Przykładowe aplikacje React:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {examples.map((example) => (
              <button 
                key={example.id}
                onClick={() => changeExample(example.id)}
                className={`px-3 py-1 text-xs rounded hover:bg-gray-300 transition ${
                  currentExample === example.id 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>

        {/* Informacja */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Powered by CodeSandbox
        </div>
      </div>
    </div>
  );
});

export default PreviewScreen;