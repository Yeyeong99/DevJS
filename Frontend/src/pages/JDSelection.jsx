import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/JDSelection.css';

const JDSelection = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (value) => {
    setSelectedItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <div className="logo" onClick={handleLogoClick}>DevJS</div>
      <div className="content">
        <div className="left-section">
          <h2>1. JD에서 강조하고 싶은 부분을 골라주세요.</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>내용</th>
              </tr>
            </thead>
            <tbody>
              {["DW 및 Datalake 관련 Platform/Architecture 구축 및 운영", "Data 모델링 및 구축 및 운영", "AI/ML 개발 및 운영"].map((text, index) => (
                <tr key={index}>
                  <td><input type="checkbox" checked={selectedItems.includes(index)} onChange={() => handleCheckboxChange(index)} /></td>
                  <td>{text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="right-section">
          <h2>2. 강조된 요소가 반영된 자기소개서 부분을 알려주세요.</h2>
          <textarea placeholder="지원 분야(직무)와 관련하여, 해당 영역에서 역량 또는 전문성을 키우기 위해 꾸준히 노력한 경험에 대해 자유롭게 기술해 주세요." />
        </div>
      </div>
      <button className="submit-btn">완료</button>
    </div>
  );
};

export default JDSelection;
