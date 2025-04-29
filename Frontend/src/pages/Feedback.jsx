import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/Feedback.css";
import Header from "../components/Header";
import axiosInstance from "../api/axiosInstance";

const JD_LABELS = [
  "DW 및 Datalake 관련 Platform/Architecture 구축 및 운영",
  "Data 모델링 및 구축 및 운영",
  "AI/ML 개발 및 운영",
];

const DevJSFeedbackPage = () => {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [totalFeedback, setTotalFeedback] = useState("");

  const [company, setCompany] = useState("");
  const [editedFeedback, setEditedFeedback] = useState("");


  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const res = await axiosInstance.get(
          `http://localhost:8000/api/total/total_list/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        const latest = res.data[0];

        setCompany(latest.company);
        setQuestion(latest.question);
        setKeywords(latest.keywords);
        setOriginalAnswer(latest.answer);
        setAiFeedback(latest.feedback);
        setEditedFeedback(latest.feedback);
        setTotalFeedback(latest.total_feedback);
      } catch (err) {
        console.error("❌ 데이터 가져오기 실패!", err);
      }
    };

    fetchData();
  }, []);

  // 사용자 피드백 수정 처리
  const handleFeedbackChange = (event) => {
    const newFeedback = event.target.value;
    setEditedFeedback(newFeedback);
  };

  const toFinalPage = async () => {
    try {
      const payload = {
        company,
        feedback: editedFeedback,
      };

      await axiosInstance.put("total/total_list/", payload);

      navigate("/finalsavepage");
    } catch (error) {
      console.error("전송 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <Header />

      <div className="layout">
        <section className="question-section">
          <p className="keywords">선택된 JD 항목: {keywords}</p>
          <h4 className="question">{question}</h4>

          <div className="answer-container">
            {/* 파싱된 답변 렌더링 */}
            <div className="original-answer">
              <pre>{originalAnswer}</pre>
            </div>
            {/* 파싱된 답변 렌더링 */}
            <div className="ai-feedback">
              <textarea value={editedFeedback} onChange={handleFeedbackChange}></textarea>
            </div>
          </div>
          {/* 종합 피드백 */}
          <h3 className="totalFeedback">종합 피드백</h3>
          <div className="paragraph">{totalFeedback}</div>
        </section>
        <button type="button" onClick={toFinalPage}>
          수정 사항 반영하기
        </button>
      </div>
    </div>
  );
};

export default DevJSFeedbackPage;
