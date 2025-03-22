import React, { useState, useEffect } from 'react';
import { FiSave, FiPlay, FiMaximize2 } from 'react-icons/fi';
import { SiReact, SiJavascript, SiCss3 } from 'react-icons/si';
import { motion } from 'framer-motion';
import projectService from '../services/projectService';
import Tooltip from './Tooltip';
import FullScreenProjectEditor from './FullScreenProjectEditor';

interface CodeEditorProps {
  projectId: string | undefined;
  selectedFile: string;
  onSave?: (content: string) => void;
  onRun?: () => void;
  onFileSelect?: (filePath: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  projectId, 
  selectedFile, 
  onSave, 
  onRun,
  onFileSelect
}) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [showFullScreenEditor, setShowFullScreenEditor] = useState(false);

  useEffect(() => {
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

    fetchFileContent();
  }, [projectId, selectedFile]);

  const getFileIcon = () => {
    const extension = selectedFile.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'js':
      case 'jsx':
        return <SiJavascript className="text-yellow-400 w-5 h-5 mr-2.5" />;
      case 'ts':
      case 'tsx':
        return <SiJavascript className="text-blue-500 w-5 h-5 mr-2.5" />;
      case 'css':
        return <SiCss3 className="text-blue-500 w-5 h-5 mr-2.5" />;
      case 'jsx':
      case 'tsx':
        return <SiReact className="text-blue-400 w-5 h-5 mr-2.5" />;
      default:
        return null;
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(fileContent);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContent(e.target.value);
  };

  const handleFullScreenSave = (content: string) => {
    setFileContent(content); // Zaktualizuj lokalny stan
    if (onSave) {
      onSave(content); // Przekaż zmiany do rodzica
    }
  };

  const handleFullScreenFileSelect = (filePath: string) => {
    if (onFileSelect) {
      onFileSelect(filePath);
    }
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

    return (
      <div className="flex bg-black">
        {/* Line numbers */}
        <div className="text-neutral-600 text-right pr-4 select-none">
          {lines.map((_, index) => (
            <div key={index} className="leading-6 text-xs py-0.5">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Actual code */}
        <div className="flex-1">
          <textarea
            value={fileContent}
            onChange={handleContentChange}
            className="w-full bg-transparent text-neutral-300 focus:outline-none border-0 p-0 font-mono text-xs leading-6 resize-none whitespace-pre"
            style={{ 
              minHeight: `${lines.length * 24}px`,
              overflowY: 'auto',
              height: '100%'
            }}
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
    );
  };

  return (
    <div className="flex flex-col h-full relative w-full">
      {/* Niebieskie podświetlenie dla edytora kodu */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-blue-600/5 to-transparent opacity-80 pointer-events-none"></div>
      
      {/* Subtle glow effect dla całego panelu */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-r-xl opacity-70 pointer-events-none"></div>
      
      <div className="px-4 py-3 border-b border-neutral-800 bg-gradient-to-r from-[#131313] to-[#0c0c0c] flex items-center justify-between">
        <div className="flex items-center">
          {getFileIcon()}
          <span className="text-sm font-medium">{selectedFile}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Tooltip content="Save file changes">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center bg-[#111] hover:bg-[#222] text-sm px-3 py-1.5 rounded-md text-neutral-300 border border-neutral-800 transition-all"
              onClick={handleSave}
            >
              <FiSave className="w-4 h-4 mr-2" />
              Save
            </motion.button>
          </Tooltip>
          <Tooltip content="Run application code">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm px-3 py-1.5 rounded-md text-white ml-1 shadow-md transition-all"
              onClick={onRun}
            >
              <FiPlay className="w-4 h-4 mr-2" />
              Run
            </motion.button>
          </Tooltip>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-black">
        <div className="p-4 h-full overflow-auto">
          {renderCodeWithLineNumbers()}
        </div>
      </div>
      <div className="px-4 py-2 border-t border-neutral-800 bg-[#0c0c0c] flex justify-between items-center text-sm text-neutral-500">
        <div>Ln {cursorPosition.line}, Col {cursorPosition.column}</div>
        <div className="flex space-x-4">
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>{selectedFile.split('.').pop()?.toUpperCase()}</span>
        </div>
      </div>
      
      {/* Pełnoekranowy edytor projektu z eksploratorem plików */}
      <FullScreenProjectEditor
        isVisible={showFullScreenEditor}
        onClose={() => setShowFullScreenEditor(false)}
        projectId={projectId}
        selectedFile={selectedFile}
        onFileSave={handleFullScreenSave}
        onFileSelect={handleFullScreenFileSelect}
      />
    </div>
  );
};

export default CodeEditor; 