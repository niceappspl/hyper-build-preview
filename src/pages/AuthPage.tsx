import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiGithub } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import Header from '../components/Header';
import Footer from '../components/Footer';
import toast, { Toaster } from 'react-hot-toast';
import { authService, projectService } from '../services';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || (!isLogin && !username)) {
      toast.error(isLogin 
        ? 'Please enter email and password' 
        : 'Please enter username, email and password');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Password validation (min 8 characters, at least one letter and one number)
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      toast.error('Password must be at least 8 characters with at least one letter and one number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      let userData;
      
      if (isLogin) {
        // Login user with real auth service
        userData = await authService.login({
          email,
          password
        });
        
        toast.success('Successfully logged in!');
        setEmail('');
        setPassword('');
      } else {
        // Register user with real auth service
        userData = await authService.register({
          name: username,
          email,
          password
        });
        
        toast.success('Successfully registered!');
        setUsername('');
        setEmail('');
        setPassword('');
      }
      
      // Create a new default project for the user
      if (userData) {
        try {
          const newProject = await projectService.createProject({
            name: "Your new app project",
            description: "Created with HyperBuild",
            public: false
          });
          
          // Navigate to designer page after successful auth with the new project
          setTimeout(() => {
            navigate('/designer', { 
              state: { 
                prompt: "Your new app project", 
                isPublic: false,
                projectId: newProject.id
              } 
            });
          }, 1000);
        } catch (projectError) {
          console.error('Error creating project:', projectError);
          // Still navigate to designer even if project creation fails
          setTimeout(() => {
            navigate('/designer', { 
              state: { 
                prompt: "Your new app project", 
                isPublic: false
              } 
            });
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.response?.data?.message || (isLogin ? 'Login failed' : 'Registration failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true);
    
    // For social login, we would normally redirect to OAuth provider
    // Since this is not fully implemented in the backend yet, we'll show a toast
    toast.error(`${provider} authentication not implemented yet`);
    setIsLoading(false);
    
    // Implementation would look something like:
    // window.location.href = `${API_URL}/auth/${provider}`;
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] overflow-hidden">
      <Toaster position="top-center" />
      <Header variant="home" />
      
      {/* Background Elements - same style as HomePage */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/50 to-transparent" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/10 to-blue-700/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/10 to-cyan-500/10 rounded-full blur-[100px] animate-float-delayed" />
      </div>
      
      {/* Main content area taking full height between header and footer */}
      <div className="flex-grow flex items-center justify-center relative z-10 py-10 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Auth Form Card */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm"></div>
            <div className="relative bg-[#0a0a0a] border border-[#222] rounded-xl shadow-xl p-8">
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-lg blur-xl"></div>
                  <div className="relative w-full h-full bg-black rounded-lg border border-[#222] flex items-center justify-center overflow-hidden">
                    <div className="w-10 h-10 bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col">
                      <div className="h-1/5 bg-blue-300"></div>
                      <div className="h-1/5 bg-blue-400"></div>
                      <div className="h-1/5 bg-blue-500"></div>
                      <div className="h-1/5 bg-blue-600"></div>
                      <div className="h-1/5 bg-blue-700"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-2xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                {isLogin ? 'Log in to HyperBuild' : 'Create a HyperBuild account'}
              </h1>
              <p className="text-gray-400 text-center mb-8 text-sm">
                {isLogin 
                  ? 'Log in to continue creating apps' 
                  : 'Sign up and start creating apps in seconds'}
              </p>
              
              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6">
                <motion.button 
                  onClick={() => handleSocialLogin('github')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex justify-center items-center py-3 px-4 bg-[#161b22] border border-[#30363d] rounded-lg hover:bg-[#1c2129] transition-colors text-white"
                >
                  <FiGithub className="h-5 w-5 mr-3" />
                  <span className="font-medium">Continue with GitHub</span>
                </motion.button>
                
                <motion.button 
                  onClick={() => handleSocialLogin('google')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex justify-center items-center py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-800"
                >
                  <FcGoogle className="h-5 w-5 mr-3" />
                  <span className="font-medium">Continue with Google</span>
                </motion.button>
              </div>
              
              {/* Divider */}
              <div className="flex items-center mb-6">
                <div className="flex-grow h-px bg-[#222]"></div>
                <span className="px-3 text-xs text-gray-500">or with email</span>
                <div className="flex-grow h-px bg-[#222]"></div>
              </div>
              
              {/* Auth Form */}
              <form onSubmit={handleAuth} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="username"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="relative overflow-hidden"
                    >
                      <div className="py-1">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <FiUser className="h-5 w-5" />
                          </div>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full bg-[#111] border border-[#222] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiMail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-[#111] border border-[#222] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiLock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#111] border border-[#222] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                
                {isLogin && (
                  <div className="flex justify-end">
                    <Link to="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg opacity-80 group-hover:opacity-100 blur-sm transition-opacity"></div>
                  <div className="relative w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-medium flex items-center justify-center">
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      isLogin ? 'Log in' : 'Sign up'
                    )}
                  </div>
                </motion.button>
              </form>
              
              {/* Switch Mode Link */}
              <p className="mt-6 text-center text-sm text-gray-400">
                {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
                {' '}
                <button 
                  onClick={switchMode}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AuthPage; 