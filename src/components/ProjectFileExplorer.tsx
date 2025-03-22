import React, { useState, useEffect } from 'react';
import { FiFolder, FiFile, FiChevronDown, FiChevronRight, FiRefreshCw, FiPlus } from 'react-icons/fi';
import { SiReact, SiJavascript, SiCss3, SiJson, SiTypescript, SiMarkdown, SiHtml5 } from 'react-icons/si';
import { motion } from 'framer-motion';
import projectService from '../services/projectService';
import Tooltip from './Tooltip';

interface ProjectFileExplorerProps {
  projectId: string | undefined;
  onFileSelect: (filePath: string) => void;
  selectedFile?: string;
}

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  size?: number;
}

const ProjectFileExplorer: React.FC<ProjectFileExplorerProps> = ({ 
  projectId, 
  onFileSelect,
  selectedFile
}) => {
  const [fileStructure, setFileStructure] = useState<FileNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProjectFiles();
  }, [projectId]);

  const fetchProjectFiles = async () => {
    if (!projectId) {
      setFileStructure([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const files = await projectService.getProjectFiles(projectId);
      const structure = buildFileTree(files);
      setFileStructure(structure);
    } catch (err) {
      console.error('Failed to fetch project files:', err);
      setError('Failed to load project files. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Konwertuje płaską listę plików do drzewa
  const buildFileTree = (files: { path: string; size?: number }[]): FileNode[] => {
    const root: FileNode[] = [];
    const map: { [key: string]: FileNode } = {};

    // Sortujemy pliki alfabetycznie
    files.sort((a, b) => a.path.localeCompare(b.path));

    files.forEach(file => {
      const pathParts = file.path.split('/');
      let currentPath = '';

      pathParts.forEach((part, index) => {
        const isFile = index === pathParts.length - 1;
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        // Jeśli węzeł już istnieje, pomijamy
        if (map[currentPath]) return;

        const node: FileNode = {
          name: part,
          path: currentPath,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };

        if (isFile) {
          node.size = file.size;
        }

        // Dodaj do mapy
        map[currentPath] = node;

        // Dodaj do rodzica lub korzenia
        if (parentPath) {
          if (map[parentPath].children) {
            map[parentPath].children!.push(node);
          }
        } else {
          root.push(node);
        }
      });
    });

    // Sortujemy foldery przed plikami na każdym poziomie
    const sortNodes = (nodes: FileNode[]) => {
      nodes.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'folder' ? -1 : 1;
      });

      nodes.forEach(node => {
        if (node.children) {
          sortNodes(node.children);
        }
      });
    };

    sortNodes(root);
    return root;
  };

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
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
        return <FiFile className="text-neutral-400" />;
    }
  };

  const renderFileNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile === node.path;

    return (
      <div key={node.path}>
        <motion.div
          className={`flex items-center py-1 px-2 rounded hover:bg-blue-500/10 cursor-pointer select-none text-sm ${
            isSelected ? 'bg-blue-500/20 text-white' : 'text-neutral-300'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          whileHover={{ scale: 1.01 }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect(node.path);
            }
          }}
        >
          <div className="mr-2 w-4 flex-shrink-0">
            {node.type === 'folder' ? (
              isExpanded ? <FiChevronDown className="text-blue-400" /> : <FiChevronRight className="text-blue-400" />
            ) : null}
          </div>
          <div className="mr-2 w-4 flex-shrink-0">
            {node.type === 'folder' ? <FiFolder className="text-blue-400" /> : getFileIcon(node.name)}
          </div>
          <div className="truncate">{node.name}</div>
        </motion.div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderFileNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-neutral-800 bg-gradient-to-r from-[#131313] to-[#0c0c0c] flex items-center justify-between">
        <div className="text-sm font-medium text-neutral-200">Files</div>
        <div className="flex space-x-2">
          <Tooltip content="Add new file">
            <button 
              className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <Tooltip content="Refresh files">
            <button 
              className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
              onClick={fetchProjectFiles}
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-1 text-neutral-300 bg-gradient-to-b from-[#0c0c0c] to-black relative">
        {/* Niebieskie podświetlenie dla file explorera */}
        <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-br from-blue-500/5 via-blue-600/5 to-transparent opacity-80 pointer-events-none"></div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-sm">
            {error}
          </div>
        ) : fileStructure.length === 0 ? (
          <div className="p-4 text-neutral-500 text-sm">
            No files found in this project.
          </div>
        ) : (
          fileStructure.map(node => renderFileNode(node))
        )}
      </div>
    </div>
  );
};

export default ProjectFileExplorer; 