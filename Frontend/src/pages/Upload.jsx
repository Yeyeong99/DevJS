// src/pages/Upload.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/Upload.css";
import axiosInstance from "../api/axiosInstance";
import Header from "../components/Header";


function Upload() {
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setJdFile(e.target.files[0]);
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jdFile && !jdText) {
      alert("JD를 업로드하거나 직접 입력해 주세요.");
      return;
    }

    if (questions.some((q) => !q.question || !q.answer)) {
      alert("모든 질문과 답변을 입력해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. JD 업로드
      const formData = new FormData();
      if (jdFile) formData.append("file", jdFile);
      if (jdText) formData.append("content", jdText);

      const jdRes = await axiosInstance.post("job-descriptions/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const jdId = jdRes.data.id;

      // 2. CoverLetter 생성
      const clRes = await axiosInstance.post("coverletters/", {
        job_description: jdId,
        title: "내 자기소개서", // 향후 사용자 입력값으로 대체 가능
      });

      const coverLetterId = clRes.data.id;

      // 3. CoverLetterItem 생성 (질문/답변 반복)
      await Promise.all(
        questions.map((q, index) =>
          axiosInstance.post(`coverletters/${coverLetterId}/items/`, {
            question: q.question,
            answer: q.answer,
            order: index,
          })
        )
      );

      alert("자기소개서 업로드 완료!");
      navigate("/jd-selection"); // 혹은 결과 페이지로 이동
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-wrapper">
      <Header />


      {/* <Link to="/" className="upload-title">
        DevJS
      </Link> */}
      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-columns">
          <div className="upload-column">
            <h2 className="section-title">1. JD를 업로드 해주세요.</h2>
            <label className="input-box">
              <span>이미지 / PDF</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileChange}
                className="hidden-input"
              />
            </label>
            <input
              type="text"
              placeholder="직접 입력"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="input-box"
            />
          </div>

          <div className="upload-column">
            <h2 className="section-title">2. 자기소개서를 업로드 해주세요.</h2>
            {questions.map((q, i) => (
              <div key={i} className="question-block">
                <input
                  type="text"
                  placeholder="질문"
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(i, "question", e.target.value)
                  }
                  className="input-box"
                />
                <textarea
                  placeholder="답변"
                  value={q.answer}
                  onChange={(e) =>
                    handleQuestionChange(i, "answer", e.target.value)
                  }
                  className="textarea-box"
                />
              </div>
            ))}
            <button type="button" onClick={addQuestion} className="add-button">
              + 추가하기
            </button>
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "제출 중..." : "완료"}
        </button>
      </form>
    </div>
  );
}

export default Upload;
