import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 w-full py-6 px-4 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-gray-500">&copy; {new Date().getFullYear()} HyperBuild. All rights reserved.</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 