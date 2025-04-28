import React, { useState } from "react"
import { useNavigate, useLocation  } from "react-router-dom"
import "../assets/TotalUploadPage.css"
import axios from "axios"
import Header from "../components/Header"
import axiosInstance from "../api/axiosInstance"

const TotalUploadPage = () => {

  const location = useLocation()
  const prefill = location.state || {};


  const [keywords, setKeywords] = useState(prefill.keywords || "")
  const [company, setCompany] = useState(prefill.company_name || "")
  const [position, setPosition] = useState(prefill.position || "");
  const [deadline, setDeadline] = useState(prefill.deadline || "")
  const [question, setQuestion] = useState(prefill.question || "")
  const [answer, setAnswer] = useState(prefill.answer || "")

  const navigate = useNavigate()



  const handleSubmit = async () => {
    try {
      const payload = {
        keywords,
        company,
        position,
        deadline,
        question,
        answer,
      };
      console.log(payload)
      const answerInfo = {
        company,
        keywords,
        question,
        answer,
      }
      await axiosInstance.post("total/total_list/", payload);
      // 2) 두 번째 분석 → 결과 받기
      const accessToken = localStorage.getItem("access_token");
      const { data: feedback } = await axiosInstance.post(
        "http://localhost:8000/api/analyzes/",
        answerInfo,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // feedback = { total_feedback, final_before_feedback, final_after_feedback }

      alert("성공적으로 저장되었습니다!");
      navigate("/feedback",  { state: { ...payload, feedback } });
    } catch (error) {
      console.error("전송 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };





  return (
    <div className="container">
        <Header/>

      <div className="form-wrapper">
        <div className="left-form">
          <div className="form-group">
            <label>1. 강조하고 싶은 키워드를 알려주세요.</label>
            <p className="helper">키워드가 여러 개인 경우 쉼표로 구분해주세요.<br />예) React를 이용한 웹 개발 경험, 커뮤니케이션 스킬</p>
            <textarea
              placeholder="예) Django를 이용한 웹 서버 개발 경험"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>2. 지원하는 기업 이름을 알려주세요.</label>
            <input
              type="text"
              placeholder="예) 멀티캠퍼스"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>3. 지원하는 직무를 알려주세요.</label>
            <input
              type="text"
              placeholder="예) 프론트엔드 개발자"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>4. 지원 마감일을 알려주세요.</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-field data-input"
            />
          </div>
        </div>

        <div className="right-form">
          <label>5. 자기소개서를 업로드 해주세요.</label>
          <input
            type="text"
            placeholder="질문"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <textarea
            placeholder="답변"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      </div>




      <div className="button-wrapper">

        
        <button className="submit-button" onClick={handleSubmit}>
          피드백 받기
        </button>
      </div>
    </div>
  );
};

export default TotalUploadPage;
