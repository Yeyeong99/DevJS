import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/CompanyInfo.css";

function CompanyInfo() {
  const [company, setCompany] = useState("");
  const [deadline, setDeadline] = useState("");
  const [position, setPosition] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      setCompany(location.state.company || "");
      setDeadline(location.state.deadline || "");
      setPosition(location.state.position || "");
    }
  }, [location.state]);

  const handleNext = () => {
    if (!company || !deadline || !position) {
      alert("회사명, 지원 직무, 마감일을 모두 입력해주세요!");
      return;
    }

    navigate("/upload", {
      state: {
        company,
        deadline,
        position,
      },
    });
  };

  const handleBack = () => {
    const confirmBack = window.confirm("작성 중인 내용이 사라질 수 있습니다. 정말 이전으로 돌아가시겠습니까?");
    if (confirmBack) {
      navigate(-1);
    }
  };

  return (
    <div className="company-info-wrapper">
      <h2 className="title">자소서 작성을 시작하기 전에</h2>
      <p className="description">지원 회사, 지원 직무, 그리고 마감일을 입력해 주세요.</p>

      <input
        type="text"
        placeholder="지원 회사 (예: 삼성전자)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="input-field"
      />

      <input
        type="text"
        placeholder="지원 직무 (예: 프론트엔드 개발자)"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        className="input-field"
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="input-field data-input"
      />

      <div className="button-group">
        <button onClick={handleBack} className="back-button">
          이전으로
        </button>
        <button onClick={handleNext} className="next-button">
          다음으로
        </button>
      </div>
    </div>
  );
}

export default CompanyInfo;
