import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';

import KakaoCallback from "./pages/oauth/KakaoCallback";
import GoogleCallback from "./pages/oauth/GoogleCallback";



function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/kakao/callback" element={<KakaoCallback />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        
      </Routes>
  
  );
}

export default App;
