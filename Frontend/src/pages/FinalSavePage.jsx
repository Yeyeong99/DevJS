import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/FinalSavePage.css";
import axios from 'axios';


const FinalSavePage = () => {
  const { id } = useParams(); // URL에서 id 받아옴
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
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
        setAiFeedback(latest.feedback); // 
      } catch (err) {
        console.error("데이터 가져오기 실패!", err);
      }
    };
  
    fetchData();
  }, [id]);


  const saveFeedback = async () => {
    try {
      const access = localStorage.getItem("access_token");
      await axios.put(`http://localhost:8000/api/total/total_list/`, {
        feedback: aiFeedback,
      }, {
        headers: { Authorization: `Bearer ${access}` },
      });
      alert("✅ 피드백이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("❌ 피드백 저장 실패:", error);
      alert("❌ 저장 중 오류가 발생했습니다.");
    }
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
        <button className="btn" onClick={saveFeedback}>피드백 더 받기</button>
        <button className="btn btn-primary" onClick={saveFeedback}>피드백버전으로 저장하기</button>
      </div>
    </div>
  );
};

export default FinalSavePage;
