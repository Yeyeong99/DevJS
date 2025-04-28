import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/Feedback.css";
import Header from "../components/Header";
import axiosInstance from "../api/axiosInstance";

const JD_LABELS = ["DW 및 Datalake 관련 Platform/Architecture 구축 및 운영", "Data 모델링 및 구축 및 운영", "AI/ML 개발 및 운영"];

const DevJSFeedbackPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const {
    answer = "",
    feedback = []
  } = location.state || {};

  const [question, setQuestion] = useState("");
  const [keywords, setKeywords] = useState("");
  const [originalAnswer, setOriginalAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");

  const [company, setCompany] = useState("");
  const [editedFeedback, setEditedFeedback] = useState(feedback.final_after_feedback || []);
  // 문장들을 배열로 분리하여 관리
  const [parsedAnswer, setParsedAnswer] = useState([]);
  const textareaRefs = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // 초기 answer 파싱
    if (answer && feedback?.final_before_feedback) {
      const parsed = parseAnswerIntoSegments(answer, feedback.final_before_feedback);
      setParsedAnswer(parsed);
    }

    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const res = await axiosInstance.get(`http://localhost:8000/api/total/total_list/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        const latest = res.data[0];

        setCompany(latest.company);
        setQuestion(latest.question);
        setKeywords(latest.keywords);
        setOriginalAnswer(latest.answer);
      } catch (err) {
        console.error("❌ 데이터 가져오기 실패!", err);
      }
    };

    fetchData();
  }, []);

  // answer를 feedback.final_before_feedback 문장들을 기준으로 분리하는 함수
  const parseAnswerIntoSegments = (fullAnswer, sentences) => {
    let remainingAnswer = fullAnswer;
    const segments = [];
    
    // 각 문장(before_feedback)을 찾아 분리
    sentences.forEach((sentence, index) => {
      if (remainingAnswer.includes(sentence)) {
        const parts = remainingAnswer.split(sentence);
        
        // 문장 이전 부분이 있으면 추가
        if (parts[0]) {
          segments.push({
            id: `regular-${index}`,
            text: parts[0],
            isFeedback: false
          });
        }
        
        // 피드백 문장 추가
        segments.push({
          id: `feedback-${index}`,
          text: sentence,
          isFeedback: true,
          feedbackIndex: index
        });
        
        // 남은 텍스트 업데이트
        remainingAnswer = parts.slice(1).join(sentence);
      }
    });
    
    // 마지막 남은 텍스트 추가
    if (remainingAnswer) {
      segments.push({
        id: `regular-last`,
        text: remainingAnswer,
        isFeedback: false
      });
    }
    
    return segments;
  };

  // 사용자 피드백 수정 처리
  const handleFeedbackChange = (index, event) => {
    const newFeedback = [...editedFeedback];
    newFeedback[index] = event.target.value;
    setEditedFeedback(newFeedback);
    
    // 파싱된 답변에서 해당 피드백 문장 업데이트
    const updatedParsedAnswer = parsedAnswer.map(segment => {
      if (segment.isFeedback && segment.feedbackIndex === index) {
        return { ...segment, text: event.target.value };
      }
      return segment;
    });
    
    setParsedAnswer(updatedParsedAnswer);
  };

  const toFinalPage = async () => {
    try {
      // 업데이트된 parsedAnswer로부터 전체 답변 재구성
      const updatedFullAnswer = parsedAnswer.map(segment => segment.text).join("");
      
      const answerInfo = {
        keywords,
        question,
        aiFeedback: updatedFullAnswer,
        originalAnswer: answer,
      };
      
      const payload = {
        company,
        feedback: updatedFullAnswer,
      };

      await axiosInstance.put("total/total_list/", payload);

      navigate("/finalsavepage", {state: {
          answerInfo
        }});
    } catch (error) {
      console.error("전송 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };

  return (
    <div className="container">
      <Header/>

      <div className="layout">
        <section className="question-section">
          <p className="keywords">선택된 JD 항목: {keywords}</p>
          <h4 className="question">{question}</h4>
          
          {/* 파싱된 답변 렌더링 */}
          <div className="aiFeedback">
            {parsedAnswer.map(segment => (
              <span 
                key={segment.id}
                className={segment.isFeedback ? "highlighted-feedback" : ""}
                id={segment.id}
              >
                {segment.text}
              </span>
            ))}
          </div>
          
          {/* 종합 피드백 */}
          <h3 className="totalFeedback">종합 피드백</h3>
          <div className="paragraph">{feedback.total_feedback}</div>
          
          {/* 수정 전·후 문장 비교 표 */}
          <h3 className="sentenceFeedback">문장별 개선 내역</h3>
          <form action="" method="post">
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>수정 전</th>
                  <th>수정 후</th>
                </tr>
              </thead>

              <tbody>
                {feedback.final_before_feedback?.map((prev, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <span>{prev}</span>
                    </td>
                    <td>
                      <textarea 
                        ref={el => (textareaRefs.current[i] = el)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        value={editedFeedback[i] || ""} 
                        onChange={event => handleFeedbackChange(i, event)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </section>
        <button type="button" onClick={toFinalPage}>
          수정 사항 반영하기
        </button>
      </div>
    </div>
  );
};

export default DevJSFeedbackPage;