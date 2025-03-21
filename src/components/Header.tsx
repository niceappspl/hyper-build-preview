import React from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiArrowLeft } from 'react-icons/fi';

interface HeaderProps {
  variant?: 'home' | 'designer';
  projectName?: string;
  isPublic?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  variant = 'home',
  projectName = "App Designer",
  isPublic = false 
}) => {
  return (
    <header className="bg-gradient-to-r from-[#080808] to-[#0a0a0a] border-b border-[#222] py-1.5 px-4 relative z-20">
      {/* Subtle glow line under header */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0"></div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo dla strony głównej */}
          {variant === 'home' && (
            <motion.a 
              href="/" 
              className="flex items-center group"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative w-5 h-5 mr-1.5">
                {/* Logo glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-sm blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-4 h-4 bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col">
                  <div className="h-1/5 bg-blue-300"></div>
                  <div className="h-1/5 bg-blue-400"></div>
                  <div className="h-1/5 bg-blue-500"></div>
                  <div className="h-1/5 bg-blue-600"></div>
                  <div className="h-1/5 bg-blue-700"></div>
                </div>
              </div>
              <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">HyperBuild</span>
            </motion.a>
          )}
          
          {/* Przycisk powrotu dla strony projektu */}
          {variant === 'designer' && (
            <motion.a 
              href="/" 
              className="flex items-center group text-neutral-400 hover:text-white transition-colors"
              whileHover={{ x: -2 }}
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Back to home</span>
            </motion.a>
          )}
          
          {/* Navigation for Home page variant */}
          {variant === 'home' && (
            <nav className="hidden md:flex items-center ml-6 space-x-5">
              <motion.a 
                href="#" 
                className="text-xs text-gray-400 hover:text-white transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                <span>Features</span>
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></div>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-xs text-gray-400 hover:text-white transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                <span>Pricing</span>
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></div>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-xs text-gray-400 hover:text-white transition-colors relative group"
                whileHover={{ y: -1 }}
              >
                <span>Docs</span>
                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:w-full transition-all duration-300"></div>
              </motion.a>
            </nav>
          )}
          
          {/* Project info for Designer page variant */}
          {variant === 'designer' && (
            <div className="hidden md:flex items-center border-l border-neutral-800 ml-4 pl-4">
              <div>
                <h1 className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">{projectName}</h1>
                <div className="flex items-center mt-0.5">
                  <p className="text-[10px] text-neutral-400 mr-2">
                    {isPublic ? 'Public project' : 'Private project'} • Created just now
                  </p>
                  {/* Wskaźnik statusu projektu - obok nazwy */}
                  <div className="flex items-center px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                    <span className="text-[10px] text-green-300">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Link do udostępniania i przycisk Share - tylko dla wersji designer */}
        {variant === 'designer' && (
          <div className="hidden md:flex items-center space-x-3 mr-3">
            <div className="hidden lg:flex items-center bg-[#0c0c0c] rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors shadow-sm flex-1">
              <input type="text" 
                value="https://hyperbuild.ai/project/12345" 
                className="bg-transparent text-xs text-neutral-300 px-3 py-1.5 focus:outline-none w-96"
                readOnly
              />
              <button className="bg-[#181818] text-neutral-200 hover:text-blue-400 px-3 py-1.5 rounded-r-lg border-l border-neutral-800 transition-colors flex items-center">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <FiCopy className="w-3.5 h-3.5" />
                </motion.div>
              </button>
            </div>
            
            {/* Przycisk udostępniania - większy i bardziej widoczny */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center px-3.5 py-1.5 bg-[#181818] hover:bg-[#222] rounded-lg text-sm text-white transition-colors font-medium border border-neutral-800 shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15l4.5-4.5 4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 10.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20.25 13.5V6.75a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Share</span>
            </motion.button>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <motion.a 
            href="#" 
            className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </svg>
          </motion.a>
          <motion.a 
            href="#" 
            className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </motion.a>
          <motion.a 
            href="#" 
            className="text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.898-.608 1.297a19.97 19.97 0 0 0-5.93 0 12.57 12.57 0 0 0-.617-1.297.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.21 13.21 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.96 19.96 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"></path>
            </svg>
          </motion.a>
          <motion.button 
            className="flex items-center space-x-1 px-3 py-1.5 bg-[#111] hover:bg-[#191919] rounded-lg text-sm text-white transition-all font-medium border border-[#222] relative group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Subtle glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
            <div className="relative flex items-center space-x-1">
              <span>Marcin Jarzebowski</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
              </svg>
            </div>
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header; 