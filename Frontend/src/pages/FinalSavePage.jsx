import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../assets/FinalSavePage.css";
import axios from 'axios';

const FinalSavePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Feedback 페이지에서 데이터 가져와지는지 확인

  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Feedback 페이지 내용 디버깅을 위해 콘솔에 출력
    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const res = await axios.get(`http://localhost:8000/api/total/total_list/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        const latest = res.data[0];

        setCompany(latest.company);
        setQuestion(latest.question);
        setKeywords(latest.keywords);
        setOriginalAnswer(latest.answer);
        setAiFeedback(latest.feedback);
      } catch (err) {
        console.error("❌ 데이터 가져오기 실패!", err);
      }
    };

    fetchData();
  }, [id]);



  const handleGetMoreFeedback = () => {
    navigate("/totalupload"); // ✅ TotalUploadPage로 이동
  };
  const GoToDashboard = () => {
    navigate("/dashboard"); // ✅ TotalUploadPage로 이동
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
          <h3>AI 피드백 반영본</h3>
          <p>{aiFeedback}</p>
        </div>
      </div>

      <div className="button-wrapper">
        <button className="btn" onClick={handleGetMoreFeedback}>
          피드백 더 받기
        </button>
        <button className="btn btn-primary" onClick={GoToDashboard}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default FinalSavePage;