// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../assets/Dashboard.css";

const Dashboard = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.warn("⛔ access_token이 없습니다.");
      return;
    }

    axios.get("http://localhost:8000/api/auth/user/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    .then((res) => {
      setUser(res.data);
    })
    .catch(async (err) => {
      const errorCode = err.response?.data?.code;
    
      if (errorCode === "token_not_valid") {
        console.warn("🔄 access_token 만료 → refresh 시도");
    
        const refreshToken = localStorage.getItem("refresh_token");
    
        try {
          const res = await axios.post("http://localhost:8000/api/token/refresh/", {
            refresh: refreshToken,
          });
    
          const newAccessToken = res.data.access;
          localStorage.setItem("access_token", newAccessToken);
    
          // access_token 재발급 성공 → 다시 유저 정보 요청
          const retry = await axios.get("http://localhost:8000/api/auth/user/", {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            }
          });
    
          setUser(retry.data);
        } catch (refreshError) {
          console.error("⛔ refresh_token도 만료됨 → 로그아웃 처리");
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          localStorage.clear();
          window.location.href = "/";
        }
      } else {
        console.error("⛔ 유저 정보 요청 실패:", err.response?.data || err);
      }
    });
    
  }, []);

  if (!user) return <p className="loading">유저 정보를 불러오는 중입니다...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="greeting">안녕하세요, {user.username}님</h1>
      <p className="welcome">개발자를 위한 자기소개서 첨삭 서비스 DevJS에 오신 것을 환영합니다.</p>
      <button className="create-button">+ 새로 만들기</button>

      <table className="job-table">
        <thead>
          <tr>
            <th>#</th>
            <th>기업</th>
            <th>마감일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>삼성전자</td>
            <td>2025-03-19</td>
            <td><span className="status editing">수정 중</span></td>
          </tr>
          <tr>
            <td>2</td>
            <td>삼성카드</td>
            <td>2025-03-19</td>
            <td><span className="status submitted">제출 완료</span></td>
          </tr>
          <tr>
            <td>3</td>
            <td>제일기획</td>
            <td>2025-03-19</td>
            <td><span className="status editing">수정 중</span></td>
          </tr>
        </tbody>
      </table>

      <div className="see-more">더보기</div>
    </div>
  );
};

export default Dashboard;
