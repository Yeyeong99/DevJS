import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "../assets/Feedback.css";

const JD_LABELS = [
  "DW 및 Datalake 관련 Platform/Architecture 구축 및 운영",
  "Data 모델링 및 구축 및 운영",
  "AI/ML 개발 및 운영"
];

const DevJSFeedbackPage = () => {
  const location = useLocation();
  const { jdItems = [], coverLetter = '', selectedEssays = {} } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const essayLabels = {
    q1: "Q1. 가장 중요한 요소는?",
    q2: "Q2. 내 취미는",
    q3: "Q3. 나이"
  };

  return (
    <div className="container">
      <h1 className="title">DevJS</h1>
      
      <div className="layout">
        <section className="question-section">
          <h2 className="question">선택된 JD 항목</h2>
          <ul>
            {jdItems.map((itemIdx) => (
              <li key={itemIdx}>{JD_LABELS[itemIdx]}</li>
            ))}
          </ul>
  
          <h2 className="question">강조된 요소</h2>
          <ul>
            {Object.entries(selectedEssays).map(([key, value]) => (
              <li key={key}>
                <strong>{key.toUpperCase()}. {value.question}</strong>: {value.answer}
              </li>
            ))}
          </ul>
  
          <h2 className="question">피드백 분석</h2>
          <div className="paragraph">
            {jdItems.length === 0 ? (
              <p>선택된 JD 항목이 없습니다. JD 항목을 먼저 선택해주세요!</p>
            ) : (
              jdItems.map((itemIdx) => {
                const jd = JD_LABELS[itemIdx];
                const answers = Object.values(selectedEssays).map((v) => v.answer);
                const matched = answers.some((ans) => coverLetter.includes(ans));
  
                return (
                  <div key={itemIdx} style={{ marginBottom: "1rem" }}>
                    <strong>{jd}</strong>
                    <p>
                      {matched
                        ? "✔ 강조된 요소가 자기소개서에 잘 반영되어 있습니다."
                        : "❗ 강조된 요소가 자기소개서에 충분히 반영되지 않았습니다. 선택한 JD와 연결될 수 있도록 내용을 보완해주세요."}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
  
};

export default DevJSFeedbackPage;
