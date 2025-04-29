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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    if (isSubmitting) return;  // 이미 제출 중이면 함수 중단
    setIsSubmitting(true);     // 버튼 누르면 바로 잠금
    setErrors({}); // 제출할 때마다 에러 초기화
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
      if (error.response) {
        console.error("전송 실패:", error.response.data);
    
        const errorData = error.response.data;
    
        if (typeof errorData === 'object') {
          setErrors(errorData);  // 필드별 에러를 저장
    
          // ✨ 정상적이지 않은 값이 있으면 통합 팝업 띄우기
          if (Object.keys(errorData).length > 0) {
            alert("뭔가 잘못 입력한 것 같아요😉");
          }
    
        } else if (errorData.detail) {
          // detail 에러가 따로 있으면 띄움
          alert(errorData.detail);
        } else {
          alert("문제가 발생했습니다.");
        }
      } else {
        console.error("전송 실패:", error.message);
        alert("저장에 실패했습니다.");
      }
    }
    finally {
      setIsSubmitting(false);   // 성공이든 실패든 다시 활성화
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
            {errors.keywords && <p className="error-message">{errors.keywords[0]}</p>}
          </div>
          <div className="form-group">
            <label>2. 지원하는 기업 이름을 알려주세요.</label>
            <input
              type="text"
              placeholder="예) 멀티캠퍼스"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            {errors.company && <p className="error-message">{errors.company[0]}</p>}
          </div>
          <div className="form-group">
            <label>3. 지원하는 직무를 알려주세요.</label>
            <input
              type="text"
              placeholder="예) 프론트엔드 개발자"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            {errors.position && <p className="error-message">{errors.position[0]}</p>}
          </div>

          <div className="form-group">
            <label>4. 지원 마감일을 알려주세요.</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-field data-input"
            />
            {errors.deadline && <p className="error-message">{errors.deadline[0]}</p>}
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
          {errors.question && <p className="error-message">{errors.question[0]}</p>}
          <textarea
            placeholder="답변"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          {errors.answer && <p className="error-message">{errors.answer[0]}</p>}
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
