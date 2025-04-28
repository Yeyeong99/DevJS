import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../assets/CoverLetterDetailPage.css";

const CoverLetterDetailPage = () => {
  const { id } = useParams(); // 이 id는 companyId!
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]); // 여러 개 데이터로 변경

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchDetails = async () => {
      const access = localStorage.getItem("access_token");
      try {
        const res = await axios.get(`http://localhost:8000/api/total/total_list/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

        // 해당 회사(company id)와 일치하는 것만 필터링
        const filtered = res.data.filter(item => String(item.company) === id);

        if (filtered.length > 0) {
          setDatas(filtered);
        } else {
          console.error("해당 회사에 등록된 자소서가 없습니다!");
        }
      } catch (err) {
        console.error("데이터 불러오기 실패!", err);
      }
    };

    fetchDetails();
  }, [id]);

  const handleDelete = async (itemId) => {
    const access = localStorage.getItem("access_token");
    try {
      await axios.delete(`http://localhost:8000/api/total/delete/${itemId}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      alert("삭제 완료!");
      window.location.reload(); // 새로고침해서 리스트 갱신
    } catch (err) {
      console.error("삭제 실패!", err);
    }
  };

  if (datas.length === 0) return <p>로딩 중...</p>;

  return (
    <>
      <Header />

      <div className="page-container">
        <div className="detail-container">
          <h2 className="company-title">등록된 자기소개서 목록</h2>

          {datas.map((item) => (
            <div key={item.id} className="coverletter-card">
              <div className="question-block">
                <p className="question-title">{item.question}</p>
                <span className="tag">AI 분석: {item.keywords}</span>
              </div>

              <div className="feedback-content">
                <div className="ai-feedback">
                  <h3>AI 피드백 반영본</h3>
                  <p>{item.feedback || "AI 피드백이 없습니다."}</p>
                </div>

                <details>
                  <summary>원본 자소서 보기</summary>
                  <div className="original-answer">
                    <h4>원본 자기소개서</h4>
                    <p>{item.answer}</p>
                  </div>
                </details>
              </div>

              <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                삭제하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CoverLetterDetailPage;
