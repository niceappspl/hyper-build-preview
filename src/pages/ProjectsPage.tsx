import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiHome, FiX } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectList from '../components/projects/ProjectList';
import { authService, projectService } from '../services';
import toast, { Toaster } from 'react-hot-toast';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = authService.isLoggedIn();
      if (!isLoggedIn) {
        toast.error('Please log in to view your projects');
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Start loading state
    setIsLoading(true);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        
        // Create project and navigate
        try {
          const projectData = {
            name: prompt.substring(0, 50), // First 50 chars as name
            description: prompt,
            public: isPublic
          };
          
          projectService.createProject(projectData)
            .then(newProject => {
              setTimeout(() => {
                setIsLoading(false);
                setIsModalOpen(false);
                navigate('/designer', { 
                  state: { 
                    prompt, 
                    isPublic,
                    projectId: newProject.id
                  }
                });
              }, 500);
            })
            .catch(error => {
              console.error('Error creating project:', error);
              toast.error('Failed to create project');
              setIsLoading(false);
            });
        } catch (error) {
          console.error('Error creating project:', error);
          toast.error('Failed to create project');
          setIsLoading(false);
        }
      }
      setBuildProgress(progress);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] overflow-hidden">
      <Toaster position="top-center" />
      <Header variant="home" />
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-blue-700/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/10 to-cyan-500/10 rounded-full blur-[100px] animate-float-delayed" />
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex items-start justify-center relative z-10 py-12 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              My Projects
            </h1>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center px-4 py-2 rounded-lg bg-[#111] hover:bg-[#191919] text-white border border-neutral-800 transition-colors"
                onClick={() => navigate('/')}
              >
                <FiHome className="mr-2" />
                Home
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                <FiPlus className="mr-2" />
                New Project
              </motion.button>
            </div>
          </div>
          
          <div className="bg-[#080808]/60 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 shadow-xl">
            <ProjectList />
          </div>
        </div>
      </div>
      
      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && !isLoading && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-2xl bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                <h2 className="text-xl font-bold text-white">Create New Project</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-neutral-400 hover:text-white"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FiX className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl blur-sm group-hover:blur-md transition-all"></div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="What would you like to build today?"
                      className="relative w-full h-32 px-6 py-4 bg-black/80 border border-[#1a1a1a] rounded-xl text-white placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-[#333] transition-colors resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Public</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={isPublic}
                          onChange={() => setIsPublic(!isPublic)}
                        />
                        <div className="w-11 h-6 bg-[#1a1a1a] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        type="button"
                        className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#222] transition-colors"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors font-medium"
                      >
                        Create Project
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* Loading/Building Animation Modal */}
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-md px-6">
              <motion.div 
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">Preparing your workspace</h2>
                <p className="text-gray-400">HyperBuild is generating your app components...</p>
              </motion.div>
              
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${buildProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="text-right text-sm text-gray-400 mb-8">
                {Math.round(buildProgress)}% complete
              </div>
              
              <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4 font-mono text-xs text-gray-400 h-64 overflow-hidden">
                <div className="animate-typing">
                  <p className="mb-1 text-blue-400">// Setting up development environment</p>
                  <p className="mb-1">Initializing iOS simulator for iPhone 15 Pro...</p>
                  <p className="mb-1">Configuring Xcode build tools...</p>
                  <p className="mb-1 text-blue-400">// Preparing Android environment</p>
                  <p className="mb-1">Setting up Android SDK tools...</p>
                  <p className="mb-1">Configuring Pixel 7 emulator...</p>
                  <p className="mb-1 text-blue-400">// Installing dependencies</p>
                  <p className="mb-1">Installing React Native dependencies...</p>
                  <p className="mb-1">Setting up native modules...</p>
                  <p className="mb-1 text-blue-400">// Configuring build pipeline</p>
                  <p className="mb-1">Setting up CI/CD workflow...</p>
                  <p className="mb-1">Configuring app signing certificates...</p>
                  <p className="mb-1 text-green-400">✓ iOS environment ready</p>
                  <p className="mb-1 text-green-400">✓ Android environment ready</p>
                  <p className="mb-1 text-green-400">✓ Dependencies installed</p>
                  <p className="mb-1 text-blue-400">// Preparing workspace</p>
                  <p className="mb-1">Configuring hot reload...</p>
                  <p className="mb-1">Setting up debugging tools...</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default ProjectsPage; 