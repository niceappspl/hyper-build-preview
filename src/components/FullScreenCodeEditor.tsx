import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSave, FiPlay, FiMaximize2, FiCopy } from 'react-icons/fi';
import { SiReact, SiJavascript, SiCss3, SiTypescript, SiJson, SiHtml5, SiMarkdown } from 'react-icons/si';
import projectService from '../services/projectService';
import Tooltip from './Tooltip';
import { toast } from 'react-hot-toast';

interface FullScreenCodeEditorProps {
  isVisible: boolean;
  onClose: () => void;
  projectId: string | undefined;
  selectedFile: string;
  onSave?: (content: string) => void;
}

const FullScreenCodeEditor: React.FC<FullScreenCodeEditorProps> = ({ 
  isVisible, 
  onClose, 
  projectId,
  selectedFile,
  onSave
}) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible) {
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

  const getFileIcon = () => {
    const extension = selectedFile.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'js':
        return <SiJavascript className="text-yellow-400" />;
      case 'jsx':
        return <SiReact className="text-blue-400" />;
      case 'ts':
        return <SiTypescript className="text-blue-600" />;
      case 'tsx':
        return <SiTypescript className="text-blue-400" />;
      case 'css':
        return <SiCss3 className="text-blue-500" />;
      case 'json':
        return <SiJson className="text-yellow-600" />;
      case 'md':
        return <SiMarkdown className="text-neutral-400" />;
      case 'html':
        return <SiHtml5 className="text-orange-500" />;
      default:
        return <SiJavascript className="text-neutral-400" />;
    }
  };

  const handleSave = async () => {
    if (!onSave || !projectId || !selectedFile) return;
    
    setIsSaving(true);
    try {
      await projectService.updateFile(projectId, selectedFile, fileContent);
      onSave(fileContent);
      toast.success('File saved successfully');
    } catch (error) {
      console.error('Failed to save file:', error);
      toast.error('Failed to save file. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(fileContent)
      .then(() => toast.success('Code copied to clipboard'))
      .catch(err => {
        console.error('Failed to copy code:', err);
        toast.error('Failed to copy code. Please try again.');
      });
  };

  // Funkcja do kolorowania składni
  const highlightSyntax = (code: string) => {
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
          
          <motion.div 
            className="relative w-[95%] h-[90vh] flex flex-col rounded-xl overflow-hidden border border-neutral-800 bg-[#0D1117] shadow-2xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header z nazwą pliku i przyciskami */}
            <div className="px-4 py-3 flex items-center justify-between bg-[#161B22] border-b border-neutral-800">
              <div className="flex items-center text-white">
                <span className="mr-3">{getFileIcon()}</span>
                <span className="font-medium">{selectedFile}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Tooltip content="Copy code">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center bg-[#111] hover:bg-[#222] text-sm px-3 py-1.5 rounded-md text-neutral-300 border border-neutral-800 transition-all"
                    onClick={handleCopyToClipboard}
                  >
                    <FiCopy className="w-4 h-4 mr-2" />
                    Copy
                  </motion.button>
                </Tooltip>
                <Tooltip content="Save file">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center bg-[#111] hover:bg-[#222] text-sm px-3 py-1.5 rounded-md text-neutral-300 border border-neutral-800 transition-all"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <FiSave className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </motion.button>
                </Tooltip>
                <Tooltip content="Run code">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm px-3 py-1.5 rounded-md text-white shadow-md transition-all"
                  >
                    <FiPlay className="w-4 h-4 mr-2" />
                    Run
                  </motion.button>
                </Tooltip>
              </div>
            </div>
            
            {/* Edytor kodu */}
            <div className="flex-1 overflow-hidden">
              {renderCodeWithLineNumbers()}
            </div>
            
            {/* Footer z informacjami o pozycji kursora */}
            <div className="px-4 py-2 bg-[#161B22] border-t border-neutral-800 flex justify-between items-center text-sm text-neutral-500">
              <div>Ln {cursorPosition.line}, Col {cursorPosition.column}</div>
              <div className="flex space-x-4">
                <span>Spaces: 2</span>
                <span>UTF-8</span>
                <span>{selectedFile.split('.').pop()?.toUpperCase()}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FullScreenCodeEditor; 