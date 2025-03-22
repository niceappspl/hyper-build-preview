import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '../services';
import toast, { Toaster } from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{id: string; name: string; email: string; role: string}>({
    id: '',
    name: '',
    email: '',
    role: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string; confirm?: string}>({});

  // Sprawdzenie czy użytkownik jest zalogowany i pobranie danych
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = authService.isLoggedIn();
      if (!isLoggedIn) {
        toast.error('Please log in to view your profile');
        navigate('/auth');
        return;
      }
      
      try {
        setIsLoading(true);
        const user = await authService.getCurrentUser();
        setUserData(user);
        setName(user.name);
        setEmail(user.email);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load your profile');
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Walidacja formularza
  const validateForm = () => {
    const newErrors: {name?: string; email?: string; password?: string; confirm?: string} = {};
    let isValid = true;
    
    // Walidacja imienia
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Walidacja email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Walidacja hasła (tylko jeśli użytkownik chce zmienić hasło)
    if (showPasswordSection) {
      if (!currentPassword) {
        newErrors.password = 'Current password is required';
        isValid = false;
      }
      
      if (newPassword) {
        if (newPassword.length < 6) {
          newErrors.password = 'New password must be at least 6 characters long';
          isValid = false;
        }
        
        if (newPassword !== confirmPassword) {
          newErrors.confirm = 'Passwords do not match';
          isValid = false;
        }
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Obsługa zapisywania zmian
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const updateData: {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {};
    
    // Dodaj tylko zmienione pola
    if (name !== userData.name) updateData.name = name;
    if (email !== userData.email) updateData.email = email;
    
    // Dodaj hasła tylko jeśli użytkownik chce je zmienić
    if (showPasswordSection && currentPassword && newPassword) {
      updateData.currentPassword = currentPassword;
      updateData.newPassword = newPassword;
    }
    
    // Jeśli nie ma zmian, wyświetl komunikat
    if (Object.keys(updateData).length === 0) {
      toast.info('No changes to save');
      return;
    }
    
    try {
      setIsSaving(true);
      const response = await authService.updateUser(updateData);
      
      setUserData(response.user);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
      
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      
      // Obsługa specyficznych błędów API
      if (error.response?.data?.error === 'Invalid current password') {
        setErrors(prev => ({ ...prev, password: 'Current password is incorrect' }));
      } else if (error.response?.data?.error === 'Email already in use') {
        setErrors(prev => ({ ...prev, email: 'This email is already in use' }));
      } else {
        toast.error('Failed to update profile');
      }
    } finally {
      setIsSaving(false);
    }
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
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 mb-8">
            Your Profile
          </h1>
          
          <div className="bg-[#080808]/60 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 shadow-xl">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Account Info Section */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
                  
                  <div className="space-y-4">
                    {/* User ID (readonly) */}
                    <div className="flex items-center bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-3">
                      <div className="flex-shrink-0">
                        <span className="text-neutral-400">User ID:</span>
                      </div>
                      <div className="ml-3 flex-grow">
                        <span className="text-neutral-300 font-mono text-sm">{userData.id}</span>
                      </div>
                    </div>
                    
                    {/* Name field */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="text-neutral-500" />
                        </div>
                        <input
                          type="text"
                          className={`w-full bg-[#0a0a0a] border ${errors.name ? 'border-red-500' : 'border-neutral-700'} rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <FiAlertCircle className="mr-1" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    
                    {/* Email field */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="text-neutral-500" />
                        </div>
                        <input
                          type="email"
                          className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-red-500' : 'border-neutral-700'} rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                          <FiAlertCircle className="mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    {/* Role (readonly) */}
                    <div className="flex items-center bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-3">
                      <div className="flex-shrink-0">
                        <span className="text-neutral-400">Account Type:</span>
                      </div>
                      <div className="ml-3 flex-grow">
                        <span className="capitalize text-neutral-300">{userData.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Password Section Toggle */}
                <div className="mb-6">
                  <button
                    type="button"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center focus:outline-none"
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                  >
                    <FiLock className="mr-2" />
                    {showPasswordSection ? 'Hide password section' : 'Change password'}
                  </button>
                </div>
                
                {/* Password Section (conditional) */}
                {showPasswordSection && (
                  <div className="mb-8 border-t border-neutral-800 pt-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
                    
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-neutral-500" />
                          </div>
                          <input
                            type="password"
                            className={`w-full bg-[#0a0a0a] border ${errors.password ? 'border-red-500' : 'border-neutral-700'} rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <FiAlertCircle className="mr-1" />
                            {errors.password}
                          </p>
                        )}
                      </div>
                      
                      {/* New Password */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-neutral-500" />
                          </div>
                          <input
                            type="password"
                            className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      {/* Confirm New Password */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-neutral-500" />
                          </div>
                          <input
                            type="password"
                            className={`w-full bg-[#0a0a0a] border ${errors.confirm ? 'border-red-500' : 'border-neutral-700'} rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors`}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        {errors.confirm && (
                          <p className="mt-1 text-sm text-red-500 flex items-center">
                            <FiAlertCircle className="mr-1" />
                            {errors.confirm}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-white text-sm font-medium transition-colors shadow-lg flex items-center"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving changes...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 bg-[#111] hover:bg-[#191919] rounded-lg text-sm text-white border border-[#333] transition-colors"
              onClick={() => navigate('/')}
            >
              Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 bg-[#111] hover:bg-[#191919] rounded-lg text-sm text-white border border-[#333] transition-colors"
              onClick={() => navigate('/projects')}
            >
              My Projects
            </motion.button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage; 