import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/CompanyInfo.css";

function CompanyInfo() {
  const [company, setCompany] = useState("");
  const [deadline, setDeadline] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!company || !deadline) {
      alert("회사명과 마감일을 모두 입력해주세요!");
      return;
    }

    navigate("/upload", {
      state: {
        company,
        deadline,
      },
    });
  };

  return (
    <div className="company-info-wrapper">
      <h2 className="title">자소서 작성을 시작하기 전에</h2>
      <p className="description">지원 회사와 지원 마감일을 먼저 입력해 주세요.</p>

      <input
        type="text"
        placeholder="지원 회사명 (예: 삼성전자)"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="input-field"
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="input-field data-input"
      />

      <button onClick={handleNext} className="next-button">
        다음으로
      </button>
    </div>
  );
}

export default CompanyInfo;
