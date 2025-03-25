import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignerPage from './pages/DesignerPage';
import AuthPage from './pages/AuthPage';
import ProjectsPage from './pages/ProjectsPage';
import ProfilePage from './pages/ProfilePage';
import IOSSimulatorPage from './pages/IOSSimulatorPage';
// Add these styles to your CSS file or create a new one
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/designer" element={<DesignerPage />} />
        <Route path="/designer/:projectId" element={<DesignerPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/simulator" element={<IOSSimulatorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
