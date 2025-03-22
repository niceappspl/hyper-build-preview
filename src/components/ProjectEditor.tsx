import React, { useState, useCallback, useEffect } from 'react';
import ProjectFileExplorer from './ProjectFileExplorer';
import CodeEditor from './CodeEditor';
import projectService from '../services/projectService';
import { toast } from 'react-hot-toast';

interface ProjectEditorProps {
  projectId: string | undefined;
  initialSelectedFile?: string;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ projectId, initialSelectedFile }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(initialSelectedFile || null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Aktualizacja wybranego pliku, gdy zmienia się initialSelectedFile
  useEffect(() => {
    if (initialSelectedFile) {
      setSelectedFile(initialSelectedFile);
    }
  }, [initialSelectedFile]);

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
  };

  const handleSaveFile = useCallback(async (content: string) => {
    if (!selectedFile || !projectId) return;

    setIsSaving(true);
    try {
      await projectService.updateFile(projectId, selectedFile, content);
      toast.success('File saved successfully');
    } catch (error) {
      console.error('Failed to save file:', error);
      toast.error('Failed to save file. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedFile, projectId]);

  const handleRunCode = useCallback(() => {
    toast.success('Running code...');
    // Implementacja funkcji uruchamiania kodu, jeśli jest dostępna
  }, []);

  if (!projectId) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-neutral-500 bg-gradient-to-b from-[#0c0c0c] to-black">
        <div className="text-center">
          <div className="mb-4 text-red-400 opacity-80">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-neutral-300 mb-2">No Project Selected</h3>
          <p className="text-neutral-500 max-w-md">
            Please select a project to view and edit its files.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-black">
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Sidebar z plikami projektu */}
        <div className="w-72 flex-shrink-0 border-r border-neutral-800 h-full">
          <ProjectFileExplorer 
            projectId={projectId}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile || undefined}
          />
        </div>

        {/* Panel główny z edytorem kodu */}
        <div className="flex-1 h-full">
          {selectedFile ? (
            <CodeEditor 
              projectId={projectId}
              selectedFile={selectedFile}
              onSave={handleSaveFile}
              onRun={handleRunCode}
              onFileSelect={handleFileSelect}
            />
          ) : (
            <div className="flex items-center justify-center h-full p-8 text-neutral-500 bg-gradient-to-b from-[#0c0c0c] to-black">
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor; 