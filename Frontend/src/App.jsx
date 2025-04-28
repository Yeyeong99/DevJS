import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Feedback from './pages/Feedback';
import JDSelection from './pages/JDSelection';
import SetNickname from './pages/SetNickname';
import CompanyInfo from "./pages/CompanyInfo";
import TotalUploadPage from "./pages/TotalUploadPage";
import FinalSavePage from "./pages/FinalSavePage";
import CoverLetterDetailPage from "./pages/CoverLetterDetailPage";





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
        <Route path="/companyinfo" element={<CompanyInfo />} />
        <Route path="/totalupload" element={<TotalUploadPage />} />
        <Route path="/finalsavepage" element={<FinalSavePage />} />
        <Route path="/coverletter/:id" element={<CoverLetterDetailPage />} />
        {/* <Route path="/finalsavepage/:id" element={<FinalSavePage />} /> */}




        <Route path="/kakao/callback" element={<KakaoCallback />} />
        <Route path="/google/callback" element={<GoogleCallback />} />
        <Route path="/github/callback" element={<GitHubCallback />} />

        
      </Routes>
  
  );
}

export default App;
