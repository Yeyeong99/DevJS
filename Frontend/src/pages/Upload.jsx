// src/pages/Upload.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ 추가
import '../assets/Upload.css';

function Upload() {
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const handleFileChange = (e) => {
    setJdFile(e.target.files[0]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('JD File:', jdFile);
    console.log('JD Text:', jdText);
    console.log('Questions:', questions);
    alert('제출 완료!');
  };

  return (
    <div className="upload-wrapper">
      <Link to="/" className="upload-title">DevJS</Link> {/* ✅ 수정된 부분 */}
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-columns">
          <div className="upload-column">
            <h2 className="section-title">1. JD를 업로드 해주세요.</h2>
            <label className="input-box">
              <span>이미지 / PDF</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="hidden-input"
              />
            </label>
            <input
              type="text"
              placeholder="직접 입력"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="input-box"
            />
          </div>

          <div className="upload-column">
            <h2 className="section-title">2. 자기소개서를 업로드 해주세요.</h2>
            {questions.map((q, i) => (
              <div key={i} className="question-block">
                <input
                  type="text"
                  placeholder="질문"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
                  className="input-box"
                />
                <textarea
                  placeholder="답변"
                  value={q.answer}
                  onChange={(e) => handleQuestionChange(i, 'answer', e.target.value)}
                  className="textarea-box"
                />
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="add-button">
              + 추가하기
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button">
          완료
        </button>
      </form>
    </div>
  );
}

export default Upload;
