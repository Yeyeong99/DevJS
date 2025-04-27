import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header"; // ✅ Header 따로 렌더링
import "../assets/CoverLetterDetailPage.css";

const CoverLetterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {

    window.scrollTo(0, 0);
    
    const fetchDetail = async () => {
      const access = localStorage.getItem("access_token");
      try {
        const res = await axios.get(`http://localhost:8000/api/total/${id}/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        if (res.data.length > 0) {
          setData(res.data[0]);
        } else {
          console.error("해당 회사에 등록된 자소서가 없습니다!");
        }
      } catch (err) {
        console.error("데이터 불러오기 실패!", err);
      }
    };

    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    const access = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://localhost:8000/api/total/delete/${data.id}/`, {
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
    <>
      <Header /> {/* ✅ Header는 항상 최상단에 따로! */}

      <div className="page-container">
        {/* ✅ 컨텐츠는 margin-top 대신 padding-top */}
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
      </div>
    </>
  );
};

export default CoverLetterDetailPage;
