import React, { useEffect, useState } from "react"
import { useNavigate, useLocation  } from "react-router-dom"
import "../assets/TotalUploadPage.css"
import axios from "axios"
import Header from "../components/Header"
import axiosInstance from "../api/axiosInstance"

const TotalUploadPage = () => {

  const location = useLocation()
  const prefill = location.state || {};


  const [keywords, setKeywords] = useState(prefill.keywords || "")
  const [company, setCompany] = useState(prefill.company_name || "")
  const [position, setPosition] = useState(prefill.position || "");
  const [deadline, setDeadline] = useState(prefill.deadline || "")
  const [question, setQuestion] = useState(prefill.question || "")
  const [answer, setAnswer] = useState(prefill.answer || "")
  const [companyList, setCompanyList] = useState([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [searchActive, setSearchActive] = useState(false)

  const navigate = useNavigate()

  // 회사 리스트 가져오기
  useEffect(() => {
    console.log(companyList)
    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const res = await axiosInstance.get('http://localhost:8000/api/total/company_list/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        console.log(res.data);
        setCompanyList(res.data);
      }
      catch (err) {
        console.error("❌ 데이터 가져오기 실패!", err);
      }
    };
    
    fetchData();
  }, []);


  const handleSubmit = async () => {
    try {
      setIsAnalyzing(true);    // 로딩

      const payload = {
        keywords,
        company,
        position,
        deadline,
        question,
        answer,
      };

      console.log(payload)
      const answerInfo = {
        company,
        keywords,
        question,
        answer,
      }

      await axiosInstance.post("total/total_list/", payload);

      // 2) 두 번째 분석 → 결과 받기
      const accessToken = localStorage.getItem("access_token");
      const { data: feedback } = await axiosInstance.post(
        "http://localhost:8000/api/analyzes/",
        answerInfo,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      // feedback = { total_feedback, final_before_feedback, final_after_feedback }

      // alert("성공적으로 저장되었습니다!");
      navigate("/feedback",  { state: { ...payload, feedback } });
    }
    catch (error) {
      console.error("전송 실패:", error);
      alert("저장에 실패했습니다.");
    }
    finally {
      setIsAnalyzing(false);
    }
  };

  // 검색된 회사 목록 필터링하기
  const filteredCompanies = companyList.filter(comp => 
    comp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 회사 선택 처리
  const handleSelectCompany = (selectedCompany) => {
    setCompany(selectedCompany.name)
    setSearchTerm(selectedCompany.name)
    setSearchActive(false)
    setShowSidebar(false)
  }

  // 지원 기업 창 외부 클릭하면 검색 창 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && !event.target.closest('.company-input-group')) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showSidebar]);


  return (
    <div className="container">
        <Header/>
        {/* 로딩 띄우기 */}
        {isAnalyzing && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
              <div>피드백 받는 중입니다..</div>
          </div>
        )}

      <div className="form-wrapper">
        <div className="left-form">
          <div className="form-group">
            <label>1. 강조하고 싶은 키워드를 알려주세요.</label>
            <p className="helper">키워드가 여러 개인 경우 쉼표로 구분해주세요.<br />예) React를 이용한 웹 개발 경험, 커뮤니케이션 스킬</p>
            <textarea
              placeholder="예) Django를 이용한 웹 서버 개발 경험"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="form-group company-input-group">
            <label>2. 지원하는 기업 이름을 알려주세요.</label>
            <div className="company-input-container">
              <input
                type="text"
                placeholder="예) 멀티캠퍼스"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setSearchTerm(e.target.value);

                  if (e.target.value.trim().length > 0) {
                    setSearchActive(true);
                    if (!showSidebar) {
                      setShowSidebar(true);
                    }
                  }
                  else {
                    setSearchActive(false);
                    setShowSidebar(false);
                  }
                }}
                onFocus={() => {
                  if (company.trim().length > 0) {
                    setShowSidebar(true);
                    setSearchActive(true);
                  }
                }}
                className="campany-input"
              />
            </div>
          </div>
              
          {showSidebar && (
            <div className="company-sidebar">
              <div className="company-list">
                {searchActive ? (
                filteredCompanies.length > 0 ? (
                    filteredCompanies.map((comp, index) => (
                    <div
                      key={index}
                      className="company-item"
                      onClick={() => handleSelectCompany(comp)}>
                      {comp.name}
                    </div>
                    ))
                  ) : (
                    <div className="no-results">
                      검색 결과가 없습니다. 직접 입력해주세요.
                    </div>
                  )
                ) : null}
              </div>
            </div>
          )}


          <div className="form-group">
            <label>3. 지원하는 직무를 알려주세요.</label>
            <input
              type="text"
              placeholder="예) 프론트엔드 개발자"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>4. 지원 마감일을 알려주세요.</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-field data-input"
              min="2000-01-01"
              max="2099-12-31"
            />
          </div>
        </div>

        <div className="right-form">
          <label>5. 자기소개서를 업로드 해주세요.</label>
          <input
            type="text"
            placeholder="질문"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <textarea
            placeholder="답변"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      </div>




      <div className="button-wrapper">

        
        <button className="submit-button" onClick={handleSubmit}>
          피드백 받기
        </button>
      </div>
    </div>
  );
};

export default TotalUploadPage;
