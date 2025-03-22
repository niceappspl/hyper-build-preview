import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiHome } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectList from '../components/projects/ProjectList';
import ProjectCreator from '../components/projects/ProjectCreator';
import { authService } from '../services';
import toast, { Toaster } from 'react-hot-toast';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      
      {/* Project Creator Component */}
      <ProjectCreator 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <Footer />
    </div>
  );
};

export default ProjectsPage; 