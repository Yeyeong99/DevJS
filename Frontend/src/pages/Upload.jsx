// src/pages/Upload.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../assets/Upload.css";
import axiosInstance from "../api/axiosInstance";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function Upload() {
  const [jdFile, setJdFile] = useState(null);
  const [jdText, setJdText] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // 붙여넣은 이미지 미리보기용
  const [jdImages, setJdImages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [highlightedList, setHighlightedList] = useState([]);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    if (location.state) {
      setJdText(location.state.jdText || "");
      setQuestions(location.state.questions || [{ question: "", answer: "" }]);
      setSelectedItems(location.state.selectedItems || []);
      setHighlightedList(location.state.highlightedList || []);
      setCoverLetter(location.state.coverLetter || "");
    }
  }, [location.state]);

  const handleFileChange = (e) => {
    setJdFile(e.target.files[0]);
  };

  const handleBack = () => {
    const confirmBack = window.confirm("작성 중인 내용이 사라질 수 있습니다. 이전 페이지로 돌아가시겠습니까?");
    if (confirmBack) {
      navigate("/companyinfo", { state: location.state }); // ✅ 이전 state 그대로 전달
    }
  };


  const handlePasteImage = (e) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imageItems = items.filter(item => item.type.startsWith("image/"));
  
    if (imageItems.length === 0) return;
  
    imageItems.forEach((imageItem) => {
      const file = imageItem.getAsFile();
      if (file) {
        setJdFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setJdImages((prev) => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
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
      const accessToken = localStorage.getItem("access_token");
  
      // ✅ 1. JD 생성 (회사정보 포함)
      const jdPayload = {
        title: "지원서 작성",
        content: jdText || "",
        company: company,
        deadline: deadline,
      };
  
      const jdRes = await axiosInstance.post("jobdescriptions/", jdPayload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const jdId = jdRes.data.id;
  
      // ✅ 2. 파일이 있을 경우 업로드
      if (jdFile) {
        const fileForm = new FormData();
        fileForm.append("file", jdFile);
  
        await axiosInstance.post(
          `jobdescriptions/${jdId}/upload/`,
          fileForm,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
  
      // ✅ 3. CoverLetter 생성
      const clRes = await axiosInstance.post("coverletters/", {
        job_description: jdId,
        title: "내 자기소개서",
      });
  
      const coverLetterId = clRes.data.id;
  
      // ✅ 4. CoverLetterItem 생성
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
      navigate("/jd-selection");
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
            <textarea
              placeholder="직접 입력 (이미지 복수 붙여넣기 가능)"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              onPaste={handlePasteImage}
              className="input-box textarea-box"
            />

            {jdImages.length > 0 && (
              <div className="image-preview-list">
                {jdImages.map((src, idx) => (
                  <div className="image-preview-square" key={idx}>
                    <img src={src} alt={`붙여넣은 이미지 ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}


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
        <div className="button-group">
          <button
            type="button"
            onClick={handleBack}
            className="back-button"
            disabled={isSubmitting}
          >
            이전으로
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "제출 중..." : "다음으로"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Upload;
