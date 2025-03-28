// Dashboard.jsx
import React from 'react';
import "../assets/Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="greeting">안녕하세요, 김싸피님</h1>
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
