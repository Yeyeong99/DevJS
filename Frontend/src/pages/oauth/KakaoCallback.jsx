import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkNicknameAndRedirect } from "../../utils/checkNicknameAndRedirect";  // ✅ utils import

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios.post("http://localhost:8000/api/auth/kakao/", {
        code,
        redirect_uri: "http://localhost:5173/kakao/callback",  // ✅ redirect_uri 꼭 보내기
      })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          checkNicknameAndRedirect(navigate);  // ✅ 닉네임 확인 후 페이지 이동
        })
        .catch((err) => {
          console.error("카카오 로그인 실패:", err.response?.data || err);
          alert("카카오 로그인 실패");
        });
    }
  }, [navigate]);

  return <p>카카오 로그인 처리 중입니다...</p>;
};

export default KakaoCallback;
