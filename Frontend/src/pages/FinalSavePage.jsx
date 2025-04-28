import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../assets/FinalSavePage.css";
import axios from 'axios';

const FinalSavePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const res = await axios.get(`http://localhost:8000/api/total/total_list/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        const latest = res.data[0];

        setQuestion(latest.question);
        setKeywords(latest.keywords);
        setOriginalAnswer(latest.answer);

        if (answerInfo && answerInfo.aiFeedback) {
          setAiFeedback(answerInfo.aiFeedback);
        }
      } catch (err) {
        console.error("❌ 데이터 가져오기 실패!", err);
      }
    };

    fetchData();
  }, [id, answerInfo]);

  useEffect(() => {
    if (originalAnswer && aiFeedback) {
      highlightChanges();
    }
  }, [originalAnswer, aiFeedback]);

  const highlightChanges = () => {
    // 문장 단위로 대충 쪼개기 (., !, ? 뒤에 공백 기준)
    const originalSentences = originalAnswer.split(/(?<=[.!?])\s+/);
    const feedbackSentences = aiFeedback.split(/(?<=[.!?])\s+/);

    const highlights = feedbackSentences.map((sentence, idx) => {
      if (sentence !== originalSentences[idx]) {
        return { text: sentence, highlight: true };
      }
      return { text: sentence, highlight: false };
    });

    setHighlightedParts(highlights);
  };

  const handleGetMoreFeedback = () => {
    navigate("/totalupload");
  };
  const handleGoToHome = () => {
    navigate("/dashboard"); // ✅ Dashboard로 이동
  };
  return (
    <div className="feedback-container">
      <Header />

      <div className="question-block">
        <p className="question-title">{question}</p>
        <span className="tag">{keywords}</span>
      </div>

      <div className="feedback-content">
        <div className="original-answer">
          <h3>원본 자기소개서</h3>
          <p>{originalAnswer}</p>
        </div>

        <div className="ai-feedback">
          <h3>AI 피드백 반영본 (하이라이트)</h3>
          <p>
            {highlightedParts.map((part, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: part.highlight ? "yellow" : "transparent",
                  padding: "2px",
                  borderRadius: "3px",
                }}
              >
                {part.text + " "}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="button-wrapper">
        <button className="btn" onClick={handleGetMoreFeedback}>
          피드백 더 받기
        </button>
        <button className="btn btn-primary" onClick={handleGoToHome}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default FinalSavePage;
