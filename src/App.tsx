import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ExpoPreviewPage from './pages/ExpoPreviewPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/expo-preview" element={<ExpoPreviewPage />} />
      </Routes>
    </Router>
  );
};

export default App;
