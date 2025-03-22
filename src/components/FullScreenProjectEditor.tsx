import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiPlay } from 'react-icons/fi';
import ProjectFileExplorer from './ProjectFileExplorer';
import projectService from '../services/projectService';
import { toast } from 'react-hot-toast';

interface FullScreenProjectEditorProps {
  isVisible: boolean;
  onClose: () => void;
  projectId: string | undefined;
  selectedFile: string | null;
  onFileSave: (content: string) => void;
  onFileSelect: (filePath: string) => void;
}

const FullScreenProjectEditor: React.FC<FullScreenProjectEditorProps> = ({
  isVisible,
  onClose,
  projectId,
  selectedFile,
  onFileSave,
  onFileSelect
}) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && selectedFile) {
      fetchFileContent();
    }
  }, [isVisible, projectId, selectedFile]);

  const fetchFileContent = async () => {
    if (!projectId || !selectedFile) {
      setFileContent('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const content = await projectService.getFileContent(projectId, selectedFile);
      setFileContent(content);
    } catch (err) {
      console.error('Failed to fetch file content:', err);
      setError('Failed to load file content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!projectId || !selectedFile) return;
    
    setIsSaving(true);
    try {
      await projectService.updateFile(projectId, selectedFile, fileContent);
      onFileSave(fileContent);
      toast.success('File saved successfully');
    } catch (error) {
      console.error('Failed to save file:', error);
      toast.error('Failed to save file. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunCode = () => {
    toast.success('Running code...');
    // Implementacja funkcji uruchamiania kodu
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
  };

  // Funkcja do kolorowania składni
  const highlightSyntax = (code: string) => {
    if (!selectedFile) return code;
    
    const extension = selectedFile.split('.').pop()?.toLowerCase();
    
    if (extension === 'js' || extension === 'jsx' || extension === 'ts' || extension === 'tsx') {
      // Kolorowanie składni JavaScript/TypeScript/React
      return code
        .replace(/(import|export|from|const|let|var|function|return|if|else|switch|case|break|default|for|while|do|class|extends|new|this|super|try|catch|finally|throw|async|await)\b/g, '<span class="text-purple-400">$1</span>')
        .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="text-amber-300">$1</span>')
        .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, '<span class="text-yellow-500">$1</span>')
        .replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-blue-300">$1</span>')
        .replace(/\b(useState|useEffect|useRef|useCallback|useMemo|useContext)\b/g, '<span class="text-cyan-400">$1</span>')
        .replace(/\b(React|View|Text|StyleSheet|TouchableOpacity|AppRegistry)\b/g, '<span class="text-blue-400">$1</span>')
        .replace(/\/\/(.*)/g, '<span class="text-gray-500">\/\/$1</span>')
        .replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-gray-500">\/\*$1\*\/</span>');
    } else if (extension === 'css') {
      // Kolorowanie składni CSS
      return code
        .replace(/(\.\w+)\s*\{/g, '<span class="text-blue-400">$1</span> {')
        .replace(/([\w-]+)\s*:/g, '<span class="text-cyan-400">$1</span>:')
        .replace(/:\s*([^;}<]+)/g, ': <span class="text-amber-300">$1</span>')
        .replace(/\/\*([\s\S]*?)\*\//g, '<span class="text-gray-500">\/\*$1\*\/</span>');
    } else if (extension === 'html') {
      // Kolorowanie składni HTML
      return code
        .replace(/(<\/?)(\w+)([^>]*)(\/?>)/g, '$1<span class="text-orange-400">$2</span>$3$4')
        .replace(/([\w-]+)="([^"]*)"/g, '<span class="text-cyan-400">$1</span>="<span class="text-amber-300">$2</span>"');
    } else if (extension === 'json') {
      // Kolorowanie składni JSON
      return code
        .replace(/"(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?/g, (match) => {
          const isKey = /:$/.test(match);
          return isKey 
            ? `<span class="text-cyan-400">${match}</span>` 
            : `<span class="text-amber-300">${match}</span>`;
        })
        .replace(/\b(true|false|null)\b/g, '<span class="text-yellow-500">$1</span>')
        .replace(/\b(-?\d+\.?\d*)\b/g, '<span class="text-blue-300">$1</span>');
    }
    
    // Domyślnie zwracamy oryginalny kod bez kolorowania
    return code;
  };

  const renderCodeWithLineNumbers = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64 text-red-500">
          {error}
        </div>
      );
    }

    if (!selectedFile) {
      return (
        <div className="flex items-center justify-center h-full p-8 text-neutral-500">
          <div className="text-center">
            <div className="mb-4 text-blue-400 opacity-80">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path>
                <path d="M9.293 6.707 12.586 10l-3.293 3.293 1.414 1.414L15.414 10l-4.707-4.707-1.414 1.414zM6 14h2v2H6z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-neutral-300 mb-2">Select a file to edit</h3>
            <p className="text-neutral-500 max-w-md">
              Choose a file from the project explorer to view and edit its content.
            </p>
          </div>
        </div>
      );
    }

    const lines = fileContent.split('\n');
    const highlightedCode = highlightSyntax(fileContent);
    const highlightedLines = highlightedCode.split('\n');
    
    return (
      <div className="flex h-full">
        {/* Edytor z podświetlaniem składni */}
        <div className="flex flex-1 bg-[#0D1117] overflow-hidden relative"> 
          {/* Linie kodu z numerami linii */}
          <div className="text-neutral-500 text-right pr-4 pt-4 pb-4 border-r border-neutral-800 bg-[#161B22] select-none font-mono">
            {lines.map((_, index) => (
              <div key={index} className="leading-6 text-xs px-2 py-[1px]">
                {index + 1}
              </div>
            ))}
          </div>
          
          {/* Podświetlany kod */}
          <div className="flex-1 relative">
            {/* Warstwa z podświetlonym kodem */}
            <div 
              className="absolute inset-0 text-sm font-mono leading-6 pt-4 pb-4 pl-4 overflow-auto pointer-events-none"
            >
              {highlightedLines.map((line, i) => (
                <div key={i} className="whitespace-pre text-neutral-300" dangerouslySetInnerHTML={{ __html: line || ' ' }}></div>
              ))}
            </div>
            
            {/* Właściwy textarea do edycji */}
            <textarea
              value={fileContent}
              onChange={handleContentChange}
              className="absolute inset-0 w-full bg-transparent text-transparent caret-white focus:outline-none border-0 p-0 pt-4 pb-4 pl-4 font-mono text-sm leading-6 resize-none whitespace-pre"
              style={{ 
                minHeight: `${Math.max(lines.length, 10) * 24}px`,
                overflowY: 'auto',
                height: '100%'
              }}
              spellCheck="false"
              onSelect={(e) => {
                const target = e.target as HTMLTextAreaElement;
                const { selectionStart } = target;
                const textBeforeCursor = fileContent.substring(0, selectionStart);
                const line = textBeforeCursor.split('\n').length;
                const lastNewLine = textBeforeCursor.lastIndexOf('\n');
                const column = selectionStart - (lastNewLine !== -1 ? lastNewLine + 1 : 0);
                setCursorPosition({ line, column });
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderNoFileSelectedView = () => (
    <div className="flex items-center justify-center h-full p-8 text-neutral-500">
      <div className="text-center">
        <div className="mb-4 text-blue-400 opacity-80">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h16l.002 14H4z"></path>
            <path d="M9.293 6.707 12.586 10l-3.293 3.293 1.414 1.414L15.414 10l-4.707-4.707-1.414 1.414zM6 14h2v2H6z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-neutral-300 mb-2">Select a file to edit</h3>
        <p className="text-neutral-500 max-w-md">
          Choose a file from the project explorer to view and edit its content.
        </p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close button */}
          <motion.button 
            className="fixed top-6 right-6 p-3 rounded-full bg-black/70 hover:bg-black/90 border border-neutral-700 transition-colors z-[10001] text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClose}
            aria-label="Close editor"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="w-6 h-6" />
          </motion.button>
          
          {/* Fullscreen editor container */}
          <motion.div 
            className="w-full h-full max-w-7xl max-h-[90vh] bg-gradient-to-b from-[#101010] to-[#0a0a0a] rounded-lg shadow-2xl overflow-hidden border border-neutral-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header z nazwą pliku i przyciskami */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-gradient-to-r from-[#131313] to-[#0c0c0c]">
              <div className="flex items-center">
                <span className="text-sm font-medium text-neutral-300">{selectedFile || 'Project Editor'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm px-3 py-1.5 rounded-md text-white shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleRunCode}
                >
                  <FiPlay className="w-4 h-4 mr-2" />
                  Run
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center bg-[#111] hover:bg-[#222] text-sm px-3 py-1.5 rounded-md text-neutral-300 border border-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSave}
                  disabled={!selectedFile || isSaving}
                >
                  <FiSave className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </motion.button>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="flex flex-1 h-[calc(90vh-65px)]">
              {/* Sidebar with file explorer */}
              <div className="w-72 flex-shrink-0 border-r border-neutral-800 h-full">
                <ProjectFileExplorer 
                  projectId={projectId}
                  onFileSelect={onFileSelect}
                  selectedFile={selectedFile || undefined}
                />
              </div>
              
              {/* Main code editor area */}
              <div className="flex-1 h-full flex flex-col">
                <div className="flex-1 overflow-auto">
                  {selectedFile ? renderCodeWithLineNumbers() : renderNoFileSelectedView()}
                </div>
                
                {/* Status bar */}
                {selectedFile && (
                  <div className="px-4 py-2 border-t border-neutral-800 bg-[#0c0c0c] flex justify-between items-center text-sm text-neutral-500">
                    <div>Ln {cursorPosition.line}, Col {cursorPosition.column}</div>
                    <div className="flex space-x-4">
                      <span>Spaces: 2</span>
                      <span>UTF-8</span>
                      <span>{selectedFile.split('.').pop()?.toUpperCase()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenProjectEditor; 