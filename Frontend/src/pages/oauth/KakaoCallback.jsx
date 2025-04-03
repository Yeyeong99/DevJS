import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      axios.post("http://localhost:8000/api/auth/kakao/", { code })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          alert("카카오 로그인 성공!");
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error("카카오 로그인 실패:", err.response?.data || err);
          alert("카카오 로그인 실패");
        });
    }
  }, []);

  return <p>카카오 로그인 처리 중입니다...</p>;
};

export default KakaoCallback;
