// CoverLetterDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/CoverLetterDetailPage.css";

const CoverLetterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      const access = localStorage.getItem("access_token");
      try {
        const res = await axios.get(`http://localhost:8000/api/total/total_list/`);
        const item = res.data.find((d) => d.id === parseInt(id));
        setData(item);
      } catch (err) {
        console.error("데이터 불러오기 실패!", err);
      }
    };

    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    const access = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://localhost:8000/api/total/total_list/${id}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      alert("삭제 완료!");
      navigate("/dashboard");
    } catch (err) {
      console.error("삭제 실패!", err);
    }
  };

  if (!data) return <p>로딩 중...</p>;

  return (
    <div className="detail-container">
      <div className="question-block">
        <p className="question-title">{data.question}</p>
        <span className="tag">AI 분석: {data.keywords}</span>
      </div>

      <div className="feedback-content">
        <div className="ai-feedback">
          <h3>AI 피드백 반영본</h3>
          <p>{data.feedback}</p>
        </div>

        <button className="toggle-btn" onClick={() => setShowOriginal(!showOriginal)}>
          {showOriginal ? "원본 자소서 숨기기 ▲" : "원본 자소서 보기 ▼"}
        </button>

        {showOriginal && (
          <div className="original-answer">
            <h4>원본 자기소개서</h4>
            <p>{data.answer}</p>
          </div>
        )}
      </div>

      <button className="delete-btn" onClick={handleDelete}>
        삭제하기
      </button>
    </div>
  );
};

export default CoverLetterDetailPage;
