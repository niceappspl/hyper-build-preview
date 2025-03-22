import React, { useState, useEffect, useRef } from 'react';
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
  const [hasNavigated, setHasNavigated] = useState(false);
  // Ref do przechowywania informacji czy nawigacja została już wykonana
  const navigationAttempted = useRef(false);
  // Ref do przechowywania ID interwału animacji ładowania
  const loadingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      setHasNavigated(false);
      navigationAttempted.current = false;
      
      // Wyczyść interwał jeśli istnieje
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    }
  }, [isOpen]);

  // Efekt odpowiedzialny za tworzenie projektu w trakcie animacji ładowania
  useEffect(() => {
    let isMounted = true;
    
    // Rozpocznij tworzenie projektu gdy animacja ładowania osiągnie 40%
    const createProjectAt = 30;
    
    if (isLoading && buildProgress >= createProjectAt && !isProjectCreated) {
      setIsProjectCreated(true); // Zapobiega wielokrotnemu wywołaniu
      console.log('Project creation started at', buildProgress, '% progress');
      
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
      
      // Lekko spowolnij animację na czas tworzenia projektu, ale nie za bardzo
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = setInterval(() => {
          // Umiarkowane tempo, aby dać czas na utworzenie projektu, ale nie robić wielkiego zastoju
          setBuildProgress(prev => {
            // Nie przekraczaj 90% zanim projekt nie zostanie utworzony
            if (prev < 90) return prev + 0.5;
            return prev;
          });
        }, 200); // Szybsza aktualizacja
      }
      
      // Asynchroniczne tworzenie projektu
      const createProjectAsync = async () => {
        try {
          console.log('Calling projectService.createProject...');
          const newProject = await projectService.createProject(projectData);
          console.log('Created project response:', newProject);
          
          // Sprawdzamy czy otrzymaliśmy obiekt projektu
          if (!newProject) {
            console.error('No project data received from API');
            throw new Error('Failed to create project: No project data received');
          }
          
          // Sprawdzamy czy projekt ma prawidłowe ID
          if (!newProject.id || typeof newProject.id !== 'string' || newProject.id.trim() === '') {
            console.error('Invalid project ID received:', newProject.id);
            throw new Error('Failed to create project: Invalid project ID received');
          }
          
          // Sprawdzamy czy ID ma odpowiedni format (np. czy nie jest to tymczasowe ID)
          if (newProject.id.startsWith('temp_')) {
            console.warn('Temporary project ID received:', newProject.id);
            // Próba pobrania prawdziwego ID
            try {
              console.log('Attempting to fetch the real project ID');
              const recentProjects = await projectService.getAllProjects();
              // Sortuj projekty wg daty utworzenia (od najnowszych)
              const sortedProjects = recentProjects.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );
              
              if (sortedProjects.length > 0) {
                const mostRecentProject = sortedProjects[0];
                if (mostRecentProject.id && !mostRecentProject.id.startsWith('temp_')) {
                  console.log('Found real project ID:', mostRecentProject.id);
                  if (isMounted) {
                    setCreatedProject(mostRecentProject);
                    
                    // Po uzyskaniu projektu, szybko zakończ animację
                    if (loadingIntervalRef.current) {
                      clearInterval(loadingIntervalRef.current);
                      loadingIntervalRef.current = setInterval(() => {
                        setBuildProgress(prev => {
                          if (prev < 100) return prev + 2.5; // Szybszy przyrost
                          if (prev >= 100) {
                            if (loadingIntervalRef.current) {
                              clearInterval(loadingIntervalRef.current);
                              loadingIntervalRef.current = null;
                            }
                            return 100;
                          }
                          return prev;
                        });
                      }, 30); // Znacznie szybsza aktualizacja
                    }
                  }
                  return;
                }
              }
              
              throw new Error('Could not find a real project ID');
            } catch (fetchError) {
              console.error('Error fetching real project ID:', fetchError);
              // Kontynuuj z tymczasowym ID jako ostateczność
              if (isMounted) {
                setCreatedProject(newProject);
                console.log('Using temporary project ID as fallback:', newProject.id);
                
                // Szybko zakończ animację
                if (loadingIntervalRef.current) {
                  clearInterval(loadingIntervalRef.current);
                  loadingIntervalRef.current = setInterval(() => {
                    setBuildProgress(prev => {
                      if (prev < 100) return prev + 2.5; // Szybszy przyrost
                      if (prev >= 100) {
                        if (loadingIntervalRef.current) {
                          clearInterval(loadingIntervalRef.current);
                          loadingIntervalRef.current = null;
                        }
                        return 100;
                      }
                      return prev;
                    });
                  }, 30); // Znacznie szybsza aktualizacja
                }
              }
            }
          } else {
            // Mamy prawidłowy projekt z ID, zapisz go
            if (isMounted) {
              setCreatedProject(newProject);
              console.log('Project created successfully with ID:', newProject.id);
              
              // Po uzyskaniu projektu, szybko zakończ animację
              if (loadingIntervalRef.current) {
                clearInterval(loadingIntervalRef.current);
                loadingIntervalRef.current = setInterval(() => {
                  setBuildProgress(prev => {
                    if (prev < 100) return prev + 2.5; // Szybszy przyrost
                    if (prev >= 100) {
                      if (loadingIntervalRef.current) {
                        clearInterval(loadingIntervalRef.current);
                        loadingIntervalRef.current = null;
                      }
                      return 100;
                    }
                    return prev;
                  });
                }, 30); // Znacznie szybsza aktualizacja
              }
            }
          }
        } catch (error) {
          console.error('Error creating project:', error);
          
          if (isMounted) {
            // Zakończ animację, jeśli wystąpił błąd
            if (loadingIntervalRef.current) {
              clearInterval(loadingIntervalRef.current);
              loadingIntervalRef.current = null;
              // Ustawienie buildProgress na 100 spowoduje wywołanie efektu nawigacji,
              // który wykryje brak projektu i wyświetli błąd
              setBuildProgress(100);
            }
            
            // Wyświetl komunikat o błędzie
            if (error instanceof Error) {
              toast.error(`Failed to create project: ${error.message}`);
            } else {
              toast.error('Failed to create project: Unknown error');
            }
            
            // Szybciej zakończ animację i zamknij modal w przypadku błędu
            setTimeout(() => {
              if (isMounted) {
                setIsLoading(false);
              }
            }, 1000); // Krótsze opóźnienie
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
      hasNavigated,
      navigationAttempted: navigationAttempted.current,
      isNavigating: buildProgress >= 100 && createdProject && createdProject.id && !hasNavigated && !navigationAttempted.current
    });
    
    // Jeśli animacja się zakończyła, ale nie mamy projektu, sprawdź najpierw czy możemy go pobrać
    if (buildProgress >= 100 && (!createdProject || !createdProject.id) && !navigationAttempted.current) {
      // Oznacz jako próbowaną
      navigationAttempted.current = true;
      console.log('Animation completed but project not available, attempting to find recent project...');
      
      // Ostatnia próba znalezienia projektu
      const findRecentProject = async () => {
        try {
          // Krótsze opóźnienie
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const recentProjects = await projectService.getAllProjects();
          console.log('Recent projects for recovery:', recentProjects);
          
          if (recentProjects && recentProjects.length > 0) {
            // Sortuj po dacie utworzenia (najnowsze najpierw)
            const sortedProjects = recentProjects.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            // Użyj najnowszego projektu
            const mostRecent = sortedProjects[0];
            console.log('Found most recent project for recovery:', mostRecent);
            
            if (mostRecent && mostRecent.id) {
              console.log('Setting recent project as created project:', mostRecent);
              setCreatedProject(mostRecent);
              toast.success('Project created successfully!');
              
              // Natychmiastowe przekierowanie
              const targetUrl = `/designer/${mostRecent.id}`;
              console.log('Directly navigating to:', targetUrl);
              window.location.href = targetUrl;
              setHasNavigated(true);
              return true;
            }
          }
          
          return false;
        } catch (error) {
          console.error('Failed to find recent project:', error);
          // Jeśli animacja zakończyła się, ale nie mamy projektu - wyświetl błąd
          console.error('Animation completed but project creation failed');
          toast.error('Project creation failed. Please try again.');
          setIsLoading(false); // Zakończ ładowanie
          return false;
        }
      };
      
      findRecentProject();
      return;
    }
    
    // Wykonaj nawigację tylko gdy animacja się zakończyła (100%) i projekt został pomyślnie utworzony
    // oraz nawigacja nie została jeszcze wykonana lub próbowana
    if (buildProgress >= 100 && createdProject && createdProject.id && !hasNavigated && !navigationAttempted.current) {
      // Oznacz nawigację jako próbowaną, aby uniknąć wielokrotnych prób
      navigationAttempted.current = true;
      
      // Krótsze opóźnienie przed nawigacją
      setTimeout(() => {
        console.log('Navigation conditions met, proceeding with navigation');
        toast.success('Project created successfully!');
        
        // Funkcja do bezpośredniej nawigacji jako ostateczność
        const directRedirect = () => {
          try {
            const targetUrl = `/designer/${createdProject.id}`;
            console.log('Using direct window.location redirection to:', targetUrl);
            window.location.href = targetUrl;
            setHasNavigated(true);
          } catch (error) {
            console.error('Direct navigation failed:', error);
            toast.error('Navigation failed. Please try refreshing the page.');
          }
        };
        
        // Przekierowanie do designera z identyfikatorem projektu w URL
        if (onProjectCreated) {
          try {
            console.log('Using onProjectCreated callback');
            onProjectCreated(createdProject);
            onClose(); // Close modal after successful creation
            setHasNavigated(true);
          } catch (callbackError) {
            console.error('Error in onProjectCreated callback:', callbackError);
            // Jeśli callback nie zadziała, spróbuj bezpośrednią nawigację
            directRedirect();
          }
        } else {
          try {
            // Dodajemy ID projektu do URL i przekierowujemy
            const targetUrl = `/designer/${createdProject.id}`;
            console.log('Navigating to:', targetUrl);
            
            // Sprawdź czy ID jest prawidłowe przed nawigacją
            if (!createdProject.id || createdProject.id.includes('temp_')) {
              console.error('Invalid project ID for navigation:', createdProject.id);
              throw new Error('Invalid project ID');
            }
            
            // Prefer direct navigation for reliability
            directRedirect();
            
            /* Try React Router navigation first
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
              const currentPath = document.location.pathname;
              console.log('Current path after navigation attempt:', currentPath);
              
              if (currentPath !== targetUrl) {
                console.log('Navigation failed, using direct redirect');
                directRedirect();
              } else {
                console.log('Navigation was successful');
                setHasNavigated(true);
              }
            }, 200);
            */
          } catch (navigationError) {
            console.error('Navigation error:', navigationError);
            // Awaryjne przekierowanie bezpośrednie
            directRedirect();
          }
        }
      }, 100); // Znacznie krótsze opóźnienie przed uruchomieniem nawigacji
    }
  }, [buildProgress, createdProject, navigate, onClose, onProjectCreated, prompt, isPublic, hasNavigated]);

  // Dodatkowy efekt zabezpieczający, który spróbuje wykonać nawigację po czasie,
  // jeśli animacja zakończyła się, mamy projekt, ale nawigacja nie nastąpiła
  useEffect(() => {
    if (buildProgress >= 100 && !hasNavigated) {
      // Odczekaj krótszą chwilę i sprawdź, czy wciąż jesteśmy w tym samym komponencie
      const safetyTimeout = setTimeout(async () => {
        if (!hasNavigated) {
          console.log('Safety check triggered - navigation still not completed');
          
          try {
            // Jeśli nie mamy projektu, spróbuj znaleźć ostatnio utworzony
            if (!createdProject || !createdProject.id) {
              console.log('No project available, trying emergency recovery...');
              
              try {
                const recentProjects = await projectService.getAllProjects();
                if (recentProjects && recentProjects.length > 0) {
                  // Sortuj po dacie utworzenia (najnowsze najpierw)
                  const sortedProjects = recentProjects.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  );
                  
                  const lastProject = sortedProjects[0];
                  if (lastProject && lastProject.id) {
                    console.log('Emergency project found:', lastProject);
                    // Natychmiastowa nawigacja
                    const targetUrl = `/designer/${lastProject.id}`;
                    window.location.href = targetUrl;
                    return;
                  }
                }
                
                // Jeśli nie udało się znaleźć projektu, wyświetl błąd
                throw new Error('Cannot find any project to navigate to');
              } catch (error) {
                console.error('Emergency project recovery failed:', error);
                toast.error('Project navigation failed. Please go to the Projects page and select your project manually.');
                setIsLoading(false);
              }
            } else {
              // Mamy projekt, ale nawigacja nie zadziałała - natychmiastowe przekierowanie
              console.log('Forcing direct navigation to project:', createdProject.id);
              const targetUrl = `/designer/${createdProject.id}`;
              window.location.href = targetUrl;
            }
          } catch (error) {
            console.error('Even safety navigation failed:', error);
            toast.error('Navigation failed. Please go to the Projects page and select your project manually.');
            setIsLoading(false);
          }
        }
      }, 1000); // Krótsze opóźnienie, ale wciąż dajemy czas na normalne nawigacje
      
      return () => clearTimeout(safetyTimeout);
    }
  }, [buildProgress, createdProject, hasNavigated, setIsLoading]);
  
  // Reset nawigacji, gdy zmienia się projekt
  useEffect(() => {
    if (createdProject) {
      navigationAttempted.current = false;
    }
  }, [createdProject]);

  // Efekt czyszczący interwał przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        loadingIntervalRef.current = null;
      }
    };
  }, []);

  // Jeśli modal jest zamknięty, nie renderuj
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please provide a description for your project');
      return;
    }
    
    // Wyczyść poprzedni interwał jeśli istnieje (na wszelki wypadek)
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
    
    // Rozpocznij animację ładowania
    setIsLoading(true);
    
    // Symuluj postęp ładowania - zbalansowane tempo
    let progress = 0;
    
    // Tworzymy nowy interwał i zapisujemy jego ID w referencji
    loadingIntervalRef.current = setInterval(() => {
      // Zbalansowany przyrost dla bardziej realistycznej symulacji
      // Dostosuj tempo w zależności od etapu procesu
      let increment = 0;
      
      if (progress < 30) {
        // Początkowa faza - szybszy przyrost
        increment = Math.random() * 4 + 3; // 3-7% przyrostu - szybciej do momentu tworzenia projektu
      } else if (progress >= 30 && progress < 75) {
        // Środkowa faza - moment tworzenia projektu, wolniejszy przyrost
        increment = Math.random() * 3 + 1; // 1-4% przyrostu
      } else {
        // Końcowa faza - szybszy przyrost po utworzeniu projektu
        increment = Math.random() * 3 + 1.5; // 1.5-4.5% przyrostu - szybciej po utworzeniu projektu
      }
      
      progress += increment;
      
      // Sprawdź czy osiągnęliśmy lub przekroczyliśmy 100%
      if (progress >= 100) {
        progress = 100;
        // Wyczyść interwał, aby zatrzymać animację
        if (loadingIntervalRef.current) {
          clearInterval(loadingIntervalRef.current);
          loadingIntervalRef.current = null;
        }
        
        // Upewnij się, że buildProgress osiąga dokładnie 100%
        console.log('Animation reached 100%, finalizing progress');
        setBuildProgress(100);
        return;
      }
      
      // Aktualizuj stan tylko jeśli nie osiągnęliśmy jeszcze 100%
      setBuildProgress(progress);
    }, 180); // Szybsza częstotliwość aktualizacji
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