// src/pages/oauth/GoogleCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkNicknameAndRedirect } from "../../utils/checkNicknameAndRedirect"; // ✅ utils에서 함수 불러오기

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios.post("http://localhost:8000/api/auth/google/", {
        code,
        redirect_uri: "http://localhost/google/callback",  // ✅ redirect_uri 반드시 명시
      })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          alert("구글 로그인 성공!");
          checkNicknameAndRedirect(navigate);  // ✅ 닉네임 존재 여부에 따라 분기 처리!
        })
        .catch((err) => {
          console.error("⛔ 구글 로그인 실패:", err.response?.data || err);
          alert("구글 로그인 실패");
          navigate("/login");
        });
    }
  }, [navigate]);

  return <p>구글 로그인 처리 중입니다...</p>;
};

export default GoogleCallback;
