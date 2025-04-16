import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/JDSelection.css';
import Header from "../components/Header";


const JDSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();


  const [jdItems, setJdItems] = useState([]); // 💡 API로 가져온 JD 리스트 저장

  useEffect(() => {
    fetch('http://localhost:8000/api/job-descriptions/')
      .then((res) => res.json())
      .then((data) => setJdItems(data))
      .catch((error) => console.error('JD 데이터 불러오기 실패:', error));
  }, []);

  const { jdText = '', questions = [] } = location.state || {}; // 전달받은 데이터 추출

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
            <Header />


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


{/* 여기 아래부분이 API 적용 전 */}
            <tbody>
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


{/* 여기 아래부분이 API 적용 후 */}

          {/* <tbody>
            {jdItems.map((item, index) => (
              <tr key={item.id || index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.title)}
                    onChange={() => handleCheckboxChange(item.title)}
                  />
                </td>
                <td>{item.title}</td>
              </tr>
            ))}
          </tbody> */}

{/* API 적용 후 코드는 API에서 오는 데이터가 다음과 같다고 가정하고 있음. */}
{/* 
[
  { "id": 1, "title": "DW 및 Datalake 관련 Platform/Architecture 구축 및 운영" },
  { "id": 2, "title": "Data 모델링 및 구축 및 운영" },
  { "id": 3, "title": "AI/ML 개발 및 운영" }
] */}





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

      <div className="button-wrapper">
        <div className="button-group">
          <button
            className="back-button"
            onClick={() => {
              const confirmBack = window.confirm("작성 중인 내용이 사라질 수 있습니다. 이전 페이지로 돌아가시겠습니까?");
              if (confirmBack) {
                navigate("/upload", {
                  state: {
                    ...location.state, 
                    selectedItems,
                    highlightedList,
                    coverLetter,
                  },
                });
              }
            }}
          >
            이전으로
          </button>

          <button className="submit-btn" onClick={handleSubmit}>
            다음으로
          </button>
        </div>
      </div>
 
  </div>
  );
};

export default JDSelection;
