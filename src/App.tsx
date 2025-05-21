import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExpoPreviewPage from './pages/ExpoPreviewPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/expo-preview" replace />} />
        <Route path="/expo-preview" element={<ExpoPreviewPage />} />
        <Route path="/expo-preview/*" element={<ExpoPreviewPage />} />
      </Routes>
    </Router>
  );
};

export default App;
