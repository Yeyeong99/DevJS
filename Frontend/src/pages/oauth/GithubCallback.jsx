// src/pages/oauth/GitHubCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkNicknameAndRedirect } from "../../utils/checkNicknameAndRedirect";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI;

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios.post(`${BASE_URL}auth/github/`, {
        code,
        redirect_uri: GITHUB_REDIRECT_URI,  // ✅ redirect_uri 꼭 함께 보내기
      })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          alert("깃허브 로그인 성공!");
          checkNicknameAndRedirect(navigate);  // ✅ 닉네임 여부 따라 분기!
        })
        .catch((err) => {
          console.error("깃허브 로그인 실패:", err.response?.data || err);
          alert("깃허브 로그인 실패");
        });
    }
  }, [navigate]);

  return <p>깃허브 로그인 처리 중입니다...</p>;
};

export default GitHubCallback;
