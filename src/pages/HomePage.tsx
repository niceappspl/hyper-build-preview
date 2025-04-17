import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WorkspaceLoader from '../components/WorkspaceLoader';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aiAssistant, setAiAssistant] = useState(true);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const navigate = useNavigate();

  // Example app templates
  const appTemplates = [
    { id: 'fitness', name: 'Native iOS fitness tracker' },
    { id: 'ecommerce', name: 'E-commerce app with AR features' },
    { id: 'social', name: 'Social media with live streaming' },
    { id: 'photo', name: 'Photo editor with AI filters' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Start building animation
    setIsBuilding(true);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
        
        // Navigate to designer page after a short delay
        setTimeout(() => {
          navigate('/designer', { state: { prompt, aiAssistant } });
        }, 500);
      }
      setBuildProgress(progress);
    }, 400);
  };

  const handleTemplateClick = (templateId: string) => {
    const templatePrompts: Record<string, string> = {
      fitness: "Create a native iOS fitness tracker app with workout tracking, progress charts, and social sharing",
      ecommerce: "Build an e-commerce app with AR features for trying products virtually before purchase",
      social: "Design a social media app with live streaming capabilities and interactive comments",
      photo: "Create a photo editor app with AI-powered filters and automatic enhancement"
    };
    
    setPrompt(templatePrompts[templateId] || "");
  };

  return (
    <div className="min-h-screen bg-[#000000] relative overflow-hidden">
      <Header variant="home" />
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent" />
        
        {/* Enhanced gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-blue-700/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/10 to-cyan-500/10 rounded-full blur-[100px] animate-float-delayed" />
      </div>

      {/* Workspace Loader Component */}
      <WorkspaceLoader isLoading={isBuilding} buildProgress={buildProgress} prompt={prompt} />

      <AnimatePresence>
        {!isBuilding && (
          <main className="relative z-10 flex flex-col items-center pt-18 md:pt-20 px-4">
            {/* Logo with Gradient */}
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-32 h-32 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-2xl blur-xl"></div>
                <div className="relative w-full h-full bg-black rounded-2xl border border-[#222] flex items-center justify-center overflow-hidden">
                  <div className="w-20 h-20 bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col">
                    <div className="h-1/5 bg-blue-300"></div>
                    <div className="h-1/5 bg-blue-400"></div>
                    <div className="h-1/5 bg-blue-500"></div>
                    <div className="h-1/5 bg-blue-600"></div>
                    <div className="h-1/5 bg-blue-700"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Heading with Gradient */}
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Idea to mobile app in seconds.
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-400 text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              HyperBuild is your superhuman mobile app engineer.
            </motion.p>

            {/* App Creation Form with Gradient Border */}
            <motion.div 
              className="w-full max-w-3xl mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <div className="flex items-center gap-4">
                    <button 
                      type="button"
                      className="px-4 py-2 bg-black/30 border border-[#1a1a1a] rounded-lg text-white flex items-center gap-2 hover:bg-[#1a1a1a]/50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Attach
                    </button>
                    
                    <button 
                      type="button"
                      className="px-4 py-2 bg-black/30 border border-[#1a1a1a] rounded-lg text-white flex items-center gap-2 hover:bg-[#1a1a1a]/50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Import
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">AI Assistant</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={aiAssistant}
                          onChange={() => setAiAssistant(!aiAssistant)}
                        />
                        <div className="w-11 h-6 bg-[#1a1a1a] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-cyan-500"></div>
                      </label>
                    </div>
                    
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors font-medium"
                    >
                      Build
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>

            {/* App Templates with Gradient Hover */}
            <motion.div 
              className="w-full max-w-3xl mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {appTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template.id)}
                    className="relative group px-4 py-3 bg-black/30 border border-[#1a1a1a] rounded-lg text-white text-sm hover:bg-[#1a1a1a]/50 transition-colors text-center overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500"></div>
                    <span className="relative z-10">{template.name}</span>
                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></div>
                  </button>
                ))}
              </div>
            </motion.div>
          </main>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
};

export default HomePage;