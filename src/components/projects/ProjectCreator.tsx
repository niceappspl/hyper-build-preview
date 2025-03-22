import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBox } from 'react-icons/fi';
import { projectService } from '../../services';
import WorkspaceLoader from '../WorkspaceLoader';
import { generateProjectUrlId } from '../../utils/helpers';
import toast from 'react-hot-toast';

// Define proper type for the project
interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  templateId?: string;
  public: boolean;
  userId: string;
}

interface ProjectCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated?: (project: Project) => void;
}

const ProjectCreator: React.FC<ProjectCreatorProps> = ({ isOpen, onClose, onProjectCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [createdProject, setCreatedProject] = useState<Project | null>(null);
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const navigate = useNavigate();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setPrompt('');
      setIsPublic(false);
      setBuildProgress(0);
      setIsLoading(false);
      setCreatedProject(null);
      setIsProjectCreated(false);
    }
  }, [isOpen]);

  // Efekt odpowiedzialny za tworzenie projektu w trakcie animacji ładowania
  useEffect(() => {
    let isMounted = true;
    
    // Rozpocznij tworzenie projektu gdy animacja ładowania osiągnie 40%
    const createProjectAt = 40;
    
    if (isLoading && buildProgress >= createProjectAt && !isProjectCreated) {
      setIsProjectCreated(true); // Zapobiega wielokrotnemu wywołaniu
      
      const projectName = prompt.trim() || `Project ${new Date().toLocaleDateString()}`;
      const projectData = {
        name: projectName,
        description: prompt,
        public: isPublic
      };
      
      console.log('Creating project with data:', projectData);
      
      // Sprawdź stan autentykacji przed kontynuowaniem
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        toast.error('Please log in to create a project');
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      
      // Asynchroniczne tworzenie projektu
      const createProjectAsync = async () => {
        try {
          const newProject = await projectService.createProject(projectData);
          console.log('Created project response:', newProject);
          
          if (!newProject || !newProject.id) {
            throw new Error('Failed to create project: No valid project ID received');
          }
          
          if (isMounted) {
            setCreatedProject(newProject);
            console.log('Project created successfully with ID:', newProject.id);
          }
        } catch (error) {
          console.error('Error creating project:', error);
          
          if (isMounted) {
            // Kontynuuj animację, ale zapamiętaj błąd
            if (error instanceof Error) {
              toast.error(`Failed to create project: ${error.message}`);
            } else {
              toast.error('Failed to create project: Unknown error');
            }
          }
        }
      };
      
      createProjectAsync();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isLoading, buildProgress, isProjectCreated, prompt, isPublic]);

  // Efekt odpowiedzialny za nawigację po zakończeniu animacji i utworzeniu projektu
  useEffect(() => {
    // Dodajemy debugowanie
    console.log('Navigation effect triggered with:', {
      buildProgress,
      createdProject,
      isNavigating: buildProgress >= 100 && createdProject && createdProject.id
    });
    
    // Wykonaj nawigację tylko gdy animacja się zakończyła (100%) i projekt został pomyślnie utworzony
    if (buildProgress >= 100 && createdProject && createdProject.id) {
      console.log('Navigation conditions met, proceeding with navigation');
      toast.success('Project created successfully!');
      
      // Przekierowanie do designera z identyfikatorem projektu w URL
      if (onProjectCreated) {
        console.log('Using onProjectCreated callback');
        onProjectCreated(createdProject);
        onClose(); // Close modal after successful creation
      } else {
        try {
          // Dodajemy ID projektu do URL i przekierowujemy
          const targetUrl = `/designer/${createdProject.id}`;
          console.log('Navigating to:', targetUrl);
          
          // Bezpośrednie przekierowanie jako fallback
          const directRedirect = () => {
            console.log('Using direct window.location redirection');
            window.location.href = targetUrl;
          };
          
          // Próba nawigacji przez React Router
          navigate(targetUrl, { 
            state: { 
              prompt: prompt || createdProject.name, 
              isPublic,
              projectId: createdProject.id,
              isNewProject: true
            },
            replace: true // Używamy replace zamiast push, aby uniknąć problemów z historią
          });
          
          console.log('Navigation dispatch completed, checking if it worked');
          
          // Sprawdź czy nawigacja zadziałała po krótkim opóźnieniu
          setTimeout(() => {
            if (document.location.pathname !== targetUrl) {
              console.log('Navigation failed, using direct redirect');
              directRedirect();
            } else {
              console.log('Navigation was successful');
            }
          }, 300);
        } catch (navigationError) {
          console.error('Navigation error:', navigationError);
          // Awaryjne przekierowanie bezpośrednie
          window.location.href = `/designer/${createdProject.id}`;
        }
      }
    } else if (buildProgress >= 100 && (!createdProject || !createdProject.id)) {
      // Jeśli animacja zakończyła się, ale nie mamy projektu - wyświetl błąd
      console.error('Animation completed but project creation failed');
      toast.error('Project creation failed. Please try again.');
      setIsLoading(false); // Zakończ ładowanie
    }
  }, [buildProgress, createdProject, navigate, onClose, onProjectCreated, prompt, isPublic]);

  // Jeśli modal jest zamknięty, nie renderuj
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please provide a description for your project');
      return;
    }
    
    // Rozpocznij animację ładowania
    setIsLoading(true);
    
    // Symuluj postęp ładowania - zbalansowane tempo
    let progress = 0;
    const interval = setInterval(() => {
      // Zbalansowany przyrost dla bardziej realistycznej symulacji
      // Dostosuj tempo w zależności od etapu procesu
      let increment = 0;
      
      if (progress < 40) {
        // Początkowa faza - szybszy przyrost
        increment = Math.random() * 5 + 2; // 2-7% przyrostu
      } else if (progress >= 40 && progress < 75) {
        // Środkowa faza - moment tworzenia projektu, wolniejszy przyrost
        increment = Math.random() * 3 + 1; // 1-4% przyrostu
      } else {
        // Końcowa faza - wolniejszy przyrost
        increment = Math.random() * 2 + 0.5; // 0.5-2.5% przyrostu
      }
      
      progress += increment;
      
      // Spowolnienie w okolicach 80%
      if (progress > 80 && progress < 95) {
        progress += Math.random() * 1; // Wolniejszy przyrost w końcowej fazie
      }
      
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      
      setBuildProgress(progress);
    }, 300); // Zbalansowana częstotliwość aktualizacji
  };

  return (
    <>
      {/* Workspace loader */}
      <WorkspaceLoader isLoading={isLoading} buildProgress={buildProgress} prompt={prompt} />
      
      {/* Modal */}
      {!isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div 
            className="w-full max-w-2xl bg-[#0a0a0a] border border-[#222] rounded-xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-b border-[#222] px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold text-white flex items-center">
                <FiBox className="mr-2 text-blue-400" />
                Create New Project
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Project Description</label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="What would you like to build?"
                    className="w-full h-32 px-4 py-3 bg-[#0f0f0f] border border-[#222] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Describe your project in detail. This will be used to generate your app's components.
                </p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-400">Project Visibility</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Public</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                      />
                      <div className="w-11 h-6 bg-[#191919] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500"></div>
                    </label>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {isPublic 
                    ? "Public projects can be viewed by anyone with the link." 
                    : "Private projects are only visible to you."}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[#191919] hover:bg-[#252525] border border-[#333] text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg transition-colors font-medium"
                >
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ProjectCreator; 