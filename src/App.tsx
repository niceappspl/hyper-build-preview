import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DesignerPage from './pages/DesignerPage';

// Add these styles to your CSS file or create a new one
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/designer" element={<DesignerPage />} />
      </Routes>
    </Router>
  );
};

export default App;
