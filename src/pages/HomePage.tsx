import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WorkspaceLoader from '../components/WorkspaceLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSparkles } from "react-icons/io5";

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
      <div className="absolute inset-0 overflow-hidden">
        {/* Complete background with gradient and logo */}
        <img 
          src="/hyper-build/background.svg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Subtle darkening overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/30 via-transparent to-transparent"></div>
      </div>

      {/* Workspace Loader Component */}
      <WorkspaceLoader isLoading={isBuilding} buildProgress={buildProgress} prompt={prompt} />

      <AnimatePresence>
        {!isBuilding && (
          <main className="relative z-10 flex flex-col items-center pt-18 md:pt-20 px-4">
            {/* Main Heading with Gradient */}
            <div id="intro" className="mt-[5vh] max-w-chat mx-auto text-center px-4 lg:px-0">
              <motion.h1 
                className="mb-4 animate-fade-in flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <span
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '60px',
                    lineHeight: '68px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    background: 'linear-gradient(to top, #00BFFF 5%, #FFFFFF 45%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    whiteSpace: 'nowrap',
                    textAlign: 'center'
                  }}
                >
                  Generate mobile app with AI
                </span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex justify-center mt-6 mb-8"
              >
                <img 
                  src="/hyper-build/group-home-page.svg" 
                  alt="Technologies" 
                  className="h-8" 
                />
              </motion.div>
            </div>

            {/* App Creation Form with Gradient Border */}
            <motion.div 
              className="w-full max-w-3xl mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  {/* Gradient border - more visible */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00FFFF] to-[#6100FF]"></div>
                  <div className="absolute inset-[2px] bg-[#1B193F] rounded-lg"></div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="What would you like to build today?"
                    className="relative w-full h-32 px-6 py-4 bg-transparent rounded-xl text-white placeholder-gray-400 focus:outline-none resize-none z-10"
                  />
                  {/* Right-centered Build button with sparkle icon */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <button 
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-[#6100FF] to-[#00FFFF] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
                      style={{ 
                        background: 'linear-gradient(90deg, #6100FF 0%, #00FFFF 100%)' 
                      }}
                    >
                      <IoSparkles className="text-white" />
                      Build
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">AI Assistant</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={aiAssistant}
                        onChange={() => setAiAssistant(!aiAssistant)}
                      />
                      <div className="w-11 h-6 bg-[#1a1a1a] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#6100FF] peer-checked:to-[#00FFFF]"></div>
                    </label>
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Example suggestions with "No idea? use this:" */}
            <motion.div 
              className="w-full max-w-4xl mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex flex-col items-center space-y-4">
                <span className="text-white text-lg">No idea? use this:</span>
                <div className="flex justify-center space-x-3 overflow-x-auto pb-2">
                  <button
                    onClick={() => setPrompt("Create a dream journal app with dream analysis capabilities")}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-xs whitespace-nowrap"
                    style={{ 
                      background: 'linear-gradient(90deg, #292755 0%, #1B1842 100%)',
                      border: '1px solid rgba(97, 0, 255, 0.3)'
                    }}
                  >
                    Dream journal with dream analysis
                  </button>
                  <button
                    onClick={() => setPrompt("Build a personal AI language trainer with personalized lessons")}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-xs whitespace-nowrap"
                    style={{ 
                      background: 'linear-gradient(90deg, #292754 0%, #1B1842 100%)',
                      border: '1px solid rgba(97, 0, 255, 0.3)'
                    }}
                  >
                    Personal AI language trainer
                  </button>
                  <button
                    onClick={() => setPrompt("Design a smart recipe organizer that suggests meals based on ingredients")}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity text-xs whitespace-nowrap"
                    style={{ 
                      background: 'linear-gradient(90deg, #292754 0%, #1B1842 100%)',
                      border: '1px solid rgba(97, 0, 255, 0.3)'
                    }}
                  >
                    Smart recipe organizer
                  </button>
                </div>
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