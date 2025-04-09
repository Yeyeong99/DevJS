import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/JDSelection.css';

const JDSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { jdText = '', questions = [] } = location.state || {}; // ✅ 전달받은 데이터 추출

  const [selectedItems, setSelectedItems] = useState([]);
  const [highlightedList, setHighlightedList] = useState(
    questions.map(() => false)
  );  const [coverLetter, setCoverLetter] = useState('');

  const handleCheckboxChange = (value) => {
    setSelectedItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleHighlightChange = (index) => {
    const updated = [...highlightedList];
    updated[index] = !updated[index];
    setHighlightedList(updated);
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  // const handleSubmit = () => {
  //   navigate('/feedback', {
  //     state: {
  //       jdItems: selectedItems,
  //       coverLetter,
  //     },
  //   });
  // };
  const handleSubmit = () => {
    const selectedEssays = questions
      .map((q, i) =>
        highlightedList[i] ? { [`q${i + 1}`]: { question: q.question, answer: q.answer } } : null
      )
      .filter(Boolean)
      .reduce((acc, cur) => ({ ...acc, ...cur }), {});
  
    navigate('/feedback', {
      state: {
        jdItems: selectedItems,
        coverLetter,
        selectedEssays,
      },
    });
  };

  return (
    <div className="container">
      <div className="logo" onClick={handleLogoClick}>DevJS</div>

      <div className="content">
        {/* 1번 영역 */}
        <div className="left-section">
          <h2>1. JD에서 강조하고 싶은 부분을 골라주세요.</h2>

          {/* ✅ 업로드한 JD 텍스트 표시 */}
          {jdText && (
            <div className="jd-preview">
              <p><strong>업로드한 JD:</strong></p>
              <div className="jd-text">{jdText}</div>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>
              {/* ===================이 부분에 데이터 가지고와서 해야함====================== */}
              {[     
                "DW 및 Datalake 관련 Platform/Architecture 구축 및 운영",
                "Data 모델링 및 구축 및 운영",
                "AI/ML 개발 및 운영"
              ].map((text, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td>{text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2번 영역 */}
        <div className="right-section">
          <h2>2. 강조된 요소가 반영된 자기소개서 부분을 알려주세요.</h2>

          {/* ✅ 업로드한 자소서 질문/답변 리스트 */}
          
          
          {questions.length > 0 && questions[0].question && (
            <div className="uploaded-questions">
              {questions.map((q, i) => (
                <div key={i} className="question-block">
                  <div className="question-header">
                    <input
                      type="checkbox"
                      checked={highlightedList[i] || false}
                      onChange={() => handleHighlightChange(i)}
                    />
                    <p className="question">
                      <strong>Q{i + 1}.</strong> {q.question}
                    </p>
                  </div>
                  <p className="answer">{q.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>완료</button>
    </div>
  );
};

export default JDSelection;
