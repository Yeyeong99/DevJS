// Login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Kakao from "kakao-js-sdk";
import "../assets/Login.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;




function Login() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (typeof window.Kakao !== "undefined" && !window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_JS_KEY);
      console.log("✅ Kakao SDK Initialized:", window.Kakao.isInitialized());
    }
  }, []);

  const goHome = () => {
    navigate("/");
  };

  const handleGoogleLogin = () => {
    const redirectUri = "http://localhost:5173/google/callback";
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
  
    window.location.href = oauthUrl;
  };
  

  const handleKakaoLogin = () => {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri: "http://localhost:5173/kakao/callback",
      });
    } else {
      console.error("❌ Kakao SDK not available");
    }
  };


  const handleGithubLogin = () => {
    const client_id = "Ov23licXbDo6SK3Lpcqt";
    const redirect_uri = "http://localhost:5173/github/callback";
  
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user`;
  
    window.location.href = githubAuthUrl;
  };

  
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-container">


        <div className="login-box">
          <div className="logo" onClick={goHome} style={{ cursor: "pointer" }}>
            DEVJS
          </div>
          <h2>로그인</h2>

          <div className="social-login-buttons">
            
            <button onClick={handleGoogleLogin} className="social-button google">
              <img src="/google_logo.png" alt="google" />
              <span>구글 계정으로 로그인</span>
            </button>
            <button onClick={handleKakaoLogin} className="social-button kakao">
              <img src="/kakao_logo.png" alt="kakao" />
              <span>카카오톡 계정으로 로그인</span>
            </button>
            <button onClick={handleGithubLogin} className="social-button github">
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="깃허브 로그인" />
              <span>GitHub 계정으로 로그인</span>
            </button>

          </div>

        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
