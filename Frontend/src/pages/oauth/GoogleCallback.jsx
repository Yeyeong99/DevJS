// src/pages/oauth/GoogleCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios.post("http://localhost:8000/api/auth/google/", { code })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          alert("구글 로그인 성공!");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("⛔ 구글 로그인 실패:", err.response?.data || err);
          alert("구글 로그인 실패");
        });
    }
  }, []);

  return <p>구글 로그인 처리 중입니다...</p>;
};

export default GoogleCallback;
