import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Feedback from './pages/Feedback';
import JDSelection from './pages/JDSelection';
import SetNickname from './pages/SetNickname';




import KakaoCallback from "./pages/oauth/KakaoCallback";
import GoogleCallback from "./pages/oauth/GoogleCallback";
import GitHubCallback from "./pages/oauth/GithubCallback";



function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/jd-selection" element={<JDSelection />} />
        <Route path="/setnickname" element={<SetNickname />} />




        <Route path="/kakao/callback" element={<KakaoCallback />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        <Route path="/github/callback" element={<GitHubCallback />} />

        
      </Routes>
  
  );
}

export default App;
