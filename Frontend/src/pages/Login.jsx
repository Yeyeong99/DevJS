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

  const handleKakaoLogin = () => {
    if (window.Kakao) {
      window.Kakao.Auth.authorize({
        redirectUri: "http://localhost:5173/kakao/callback",
      });
    } else {
      console.error("❌ Kakao SDK not available");
    }
  };

  const handleNaverLogin = () => {
    // 실제 네이버 로그인 URL로 변경 필요
    window.location.href = "https://nid.naver.com/oauth2.0/authorize?client_id=YOUR_NAVER_CLIENT_ID&redirect_uri=http://localhost:5173/naver/callback&response_type=code";
  };

  const handleGithubLogin = () => {
    // 실제 깃허브 로그인 URL로 변경 필요
    window.location.href = "https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID";
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-container">


        <div className="login-box">
          <div className="logo" onClick={goHome} style={{ cursor: "pointer" }}>
            DEVJS
          </div>
          <h2>로그인</h2>

          <div className="social-button-list">
            <GoogleLogin width="100%" className="social-button" />

            <button onClick={handleKakaoLogin} className="social-button kakao">
              <img src="/kakao_login_medium.png" alt="카카오 로그인" />
            </button>

            <button onClick={handleNaverLogin} className="social-button naver">
              <img src="https://static.nid.naver.com/oauth/small_g_in.PNG" alt="네이버 로그인" />
            </button>

            <button onClick={handleGithubLogin} className="social-button github">
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="깃허브 로그인" style={{ width: '20px', marginRight: '10px' }} />
              <span>GitHub 로그인</span>
            </button>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
