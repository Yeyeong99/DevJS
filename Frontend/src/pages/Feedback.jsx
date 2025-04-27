import React, {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../assets/Feedback.css";
import Header from "../components/Header";
import axiosInstance from "../api/axiosInstance";

const JD_LABELS = ["DW 및 Datalake 관련 Platform/Architecture 구축 및 운영", "Data 모델링 및 구축 및 운영", "AI/ML 개발 및 운영"];

const DevJSFeedbackPage = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const {
    answer = "",
    question = "",
    keywords = "",
    feedback = []
  } = location.state || {};
  console.log(feedback);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toFinalPage = async () => {
    try {
      const answerInfo = {
        keywords,
        question,
        aiFeedback: answer
      };

      navigate("/finalsavepage", {state: {
          answerInfo
        }});
    } catch (error) {
      console.error("전송 실패:", error);
      alert("저장에 실패했습니다.");
    }
  };
  return (<div className="container">
    <Header/>

    <div className="layout">
      <section className="question-section">
        <p className="keywords">선택된 JD 항목: {keywords}</p>

        <h4 className="question">{question}</h4>
        <pre className="aiFeedback">{answer}</pre>

        {/* 종합 피드백 */}
        <h3 className="aiFeedback">종합 피드백</h3>
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
              {
                feedback.final_before_feedback
                  ?.map((prev, i) => (<tr key={i}>
                    <td>{i + 1}</td>
                    <td>{prev}</td>
                    <td>
                      <textarea type="text" value={feedback.final_after_feedback[i]}/>
                    </td>
                  </tr>))
              }
            </tbody>
          </table>
        </form>
      </section>
      <button type="btn btn-primary" onClick={toFinalPage}>
        수정 사항 반영하기
      </button>
    </div>
  </div>);
};

export default DevJSFeedbackPage;
