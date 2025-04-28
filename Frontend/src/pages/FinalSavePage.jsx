import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../assets/FinalSavePage.css";
import axios from 'axios';

const FinalSavePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { answerInfo } = location.state || {};

  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [company, setCompany] = useState("");
  const [highlightedParts, setHighlightedParts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const res = await axios.get(`http://localhost:8000/api/total/total_list/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

        const latest = res.data[0];

        setCompany(latest.company);
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

  const saveFeedback = async () => {
    try {
      const access = localStorage.getItem("access_token");
  
      if (!id) {
        alert("❌ 저장할 글 ID가 없습니다!");
        return;
      }
  
      await axios.put(`http://localhost:8000/api/total/${id}/`, {
        feedback: aiFeedback,
      }, {
        headers: { Authorization: `Bearer ${access}` },
      });
  
      alert("✅ 피드백이 성공적으로 저장되었습니다!");
      // 저장 성공하면 다른 페이지로 이동도 가능
      navigate("/dashboard");  // 예시: 저장 후 대시보드로 이동
    } catch (error) {
      console.error("❌ 피드백 저장 실패:", error);
      alert("❌ 저장 중 오류가 발생했습니다.");
    }
  };
  

  const handleGetMoreFeedback = () => {
    navigate("/totalupload");
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
        <button className="btn btn-primary" onClick={saveFeedback}>
          피드백버전으로 저장하기
        </button>
      </div>
    </div>
  );
};

export default FinalSavePage;
