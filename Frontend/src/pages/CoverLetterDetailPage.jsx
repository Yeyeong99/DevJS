import React, { useEffect, useState } from "react";
import { useParams, useNavigate, data } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import "../assets/CoverLetterDetailPage.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CoverLetterDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]); 
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchDetails = async () => {
      const access = localStorage.getItem("access_token");
      try {
        const res = await axios.get(`${BASE_URL}total/total_list/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

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

  const toggleAnswer = (targetId) => {
    setOpenId(prev => (prev === targetId ? null : targetId));
  };

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm("정말 삭제할까요?");
    if (!confirmDelete) return;

    const access = localStorage.getItem("access_token");
    try {
      await axios.delete(`${BASE_URL}total/delete/${itemId}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      alert("삭제 완료!");

      const updatedDatas = datas.filter(item => item.id !== itemId);
      setDatas(updatedDatas);

      if (updatedDatas.length === 0) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("삭제 실패!", err);
    }
  };

  if (datas.length === 0) return <p>로딩 중...</p>;
  return (
    <div className="container">
      <Header />

      <div className="detail-container">
        

        {datas.map((item) => (
          
          <div key={item.id} className="coverletter-card">
            <div className="company-position">{item.company_name} | {item.position}</div>

            <div className="question-block">
              <p className="question-title">{item.question}</p>
              <span className="tag">강조한 키워드 : {item.keywords}</span>
            </div>

            <div className="feedback-content">
              <div className="ai-feedback">
                {item.feedback ? (
                  <p>{item.feedback}</p>
                ) : (
                  <>
                    <p>AI 피드백이 없습니다.</p>
                    <button
                      className="go-upload-btn"
                      onClick={() => navigate("/totalupload", {
                        state: {
                          company: item.company,
                          company_name: item.company_name,
                          position: item.position,
                          question: item.question,
                          keywords: item.keywords,
                          answer: item.answer,
                          deadline: item.deadline,
                          id: item.id,
                        },
                      })}
                    >
                      ✨ AI 피드백 받으러 가기
                    </button>
                  </>
                )}
              </div>

              <div className="original-toggle">
                <button
                  className="toggle-btn"
                  onClick={() => toggleAnswer(item.id)}
                >
                  {openId === item.id ? "▲ 원본 자소서 닫기" : "▼ 원본 자소서 보기"}
                </button>

                {openId === item.id && (
                  <div className="original-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            </div>

            <button className="delete-btn" onClick={() => handleDelete(item.id)}>
              삭제하기
            </button>
            <div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoverLetterDetailPage;