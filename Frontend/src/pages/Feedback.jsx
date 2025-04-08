import React from 'react';
import { useLocation } from 'react-router-dom';
import "../assets/Feedback.css";

const DevJSFeedbackPage = () => {
  const location = useLocation();
  const { jdItems = [], coverLetter = '' } = location.state || {};

  return (
    <div className="container">
      <h1 className="title">DevJS</h1>

      <section className="question-section">
        <h2 className="question">선택된 JD 항목</h2>
        <ul>
          {jdItems.map((item) => (
            <li key={item}>{['DW 및 Datalake 관련 Platform/Architecture 구축 및 운영', 'Data 모델링 및 구축 및 운영', 'AI/ML 개발 및 운영'][item]}</li>
          ))}
        </ul>

        <h2 className="question">입력한 자기소개서</h2>
        <div className="paragraph">{coverLetter}</div>
      </section>

      {/* 기존 피드백 내용 등 그대로 유지 */}
    </div>
  );
};

export default DevJSFeedbackPage;
