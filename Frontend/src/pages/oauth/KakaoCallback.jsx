import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { checkNicknameAndRedirect } from "../../utils/checkNicknameAndRedirect";  // ✅ utils import
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios.post(`${BASE_URL}auth/kakao/`, {
        code,
        redirect_uri: KAKAO_REDIRECT_URI,  // ✅ redirect_uri 꼭 보내기
      })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          alert("카카오 로그인 성공!");
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
