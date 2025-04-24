import { useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axiosInstance"
import { useNavigate } from "react-router-dom";
import "../assets/SetNickname.css";


const SetNickname = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const access = localStorage.getItem("access_token");

    await axiosInstance.patch("http://localhost:8000/api/auth/nickname/", 
      { nickname },
      { headers: { Authorization: `Bearer ${access}` } }
    );

    alert("닉네임 설정 완료!");
    navigate("/dashboard");
  };

  return (
            <div className="nickname-container">
            <h2>닉네임을 설정해주세요</h2>
            <input
                className="nickname-input"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: dev_yuchan"
            />
            <button className="nickname-submit" onClick={handleSubmit}>
                확인
            </button>
            </div>
  );
};

export default SetNickname;
