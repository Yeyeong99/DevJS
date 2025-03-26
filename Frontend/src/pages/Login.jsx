// Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import Kakao from "kakao-js-sdk";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../assets/Login.css";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  useEffect(() => {
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

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="login-container">
        <div className="logo" onClick={goHome} style={{ cursor: "pointer" }}>
          DEVJS
        </div>

        <div className="login-box">
          <h2>로그인</h2>
          {error && <p className="error-message">{error}</p>}

          <form>
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(email.length > 0)}
                placeholder={emailFocused ? "" : "이메일"}
              />
            </div>

            <div className="input-wrapper password-wrapper">
              <input
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(password.length > 0)}
                placeholder={passwordFocused ? "" : "비밀번호"}
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button type="submit" className="login-btn">
              로그인
            </button>
          </form>

          <div className="social-login">
            <div className="google-login hover-button">
              <GoogleLogin />
            </div>

            <div className="kakao-login">
              <button onClick={handleKakaoLogin} className="kakao-btn hover-button">
                <img
                  src="/kakao_login_medium.png"
                  alt="카카오 로그인"
                  className="kakao-img"
                />
              </button>
            </div>
          </div>
        </div>

        <p className="signup-text">
          계정이 없으신가요? <span onClick={() => navigate("/signup")}>회원가입</span>
        </p>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login;
