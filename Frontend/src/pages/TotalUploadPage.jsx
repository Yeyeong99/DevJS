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
  const [positionList, setPositionList] = useState([])
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSidebarPosition, setShowSidebarPosition] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchTermPosition, setSearchTermPosition] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [searchActive, setSearchActive] = useState(false)
  const [searchActivePosition, setSearchActivePosition] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate()

  // 회사 리스트, 유저정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access_token");
        const companys = await axiosInstance.get('http://localhost:8000/api/total/company_list/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
        const userData = await axiosInstance.get('http://localhost:8000/api/total/total_list/', {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        setCompanyList(companys.data);
        // 지원직무만 추출
        const positions = [];
        for (const idx in userData.data) {
          positions.push(userData.data[idx]['position'])
        }
        setPositionList(positions)
      }
      catch (err) {
        console.error("❌ 데이터 가져오기 실패!", err);
      }
    };
    
    fetchData();
  }, []);



  
  const handleSubmit = async () => {
    if (isSubmitting) return;  // 이미 제출 중이면 함수 중단
    setIsSubmitting(true);     // 버튼 누르면 바로 잠금
    setErrors({}); // 제출할 때마다 에러 초기화
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

      // POST 요청 후 응답 받기
      const saveResponse = await axiosInstance.post("total/total_list/", payload);
      // DB에 저장된 company_id 추출
      const company_id = saveResponse.data.company;
      console.log(company_id)
      // 분석 → 결과 받기
      const accessToken = localStorage.getItem("access_token");
      const analyzePayload = {
        company_id: company_id
      }
      const { data: feedback } = await axiosInstance.post(
        "http://localhost:8000/api/analyzes/",
        analyzePayload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      navigate("/feedback",  { state: { ...payload, feedback } });
    }
    catch (error) {
      if (error.response) {
        console.error("전송 실패:", error.response.data);
    
        const errorData = error.response.data;
    
        if (typeof errorData === 'object') {
          setErrors(errorData);  // 필드별 에러를 저장
    
          // 정상적이지 않은 값이 있으면 통합 팝업 띄우기
          if (Object.keys(errorData).length > 0) {
            alert("유효한 값을 입력해주세요");
          }
    
        } else if (errorData.detail) {
          // detail 에러가 따로 있으면 띄움
          alert(errorData.detail);
        } else {
          alert("문제가 발생했습니다.");
        }
      } else {
        console.error("전송 실패:", error.message);
        alert("저장에 실패했습니다.");
      }
    }
    finally {
      setIsSubmitting(false);   // 성공이든 실패든 다시 활성화
      setIsAnalyzing(false);
    }
  };

  // 검색된 회사 목록 필터링하기
  const filteredCompanies = companyList.filter(comp => 
    comp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPositions = positionList.filter(pos => 
    pos?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 회사 선택 처리
  const handleSelectData = (selectedData) => {
    if (selectedData === companyList) {
      setCompany(selectedData.name)
      setSearchTerm(selectedData.name)
      setSearchActive(false)
      setShowSidebar(false)
    }
    else if (selectedData === positionList) {
      setPosition(selectedData)
      setSearchTermPosition(selectedData)
      setSearchActivePosition(false)
      setShowSidebarPosition(false)
    }
    
    
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
            {errors.keywords && <p className="error-message">{errors.keywords[0]}</p>}
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
                  setShowSidebar(true);
                  setSearchActive(true);
                }}
                className="campany-input"
              />
              {errors.name && <p className="error-message">{errors.name[0]}</p>}
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
                      onClick={() => handleSelectData(comp)}>
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
              onChange={(e) => {
                setPosition(e.target.value);
                setSearchTermPosition(e.target.value);

                if (e.target.value.trim().length > 0) {
                  setSearchActivePosition(true);
                  if (!showSidebar) {
                    setShowSidebarPosition(true);
                  }
                }
                else {
                  setSearchActivePosition(false);
                  setShowSidebarPosition(false);
                }
              }}
              onFocus={() => {
                setShowSidebarPosition(true);
                setSearchActivePosition(true);
              }}
              className="position-input" 
            />
            {errors.position && <p className="error-message">{errors.position[0]}</p>}
          </div>

          {showSidebar && (
            <div className="position-sidebar">
              <div className="position-list">
                {searchActive ? (
                filteredPositions.length > 0 ? (
                  filteredPositions.map((pos, index) => (
                    <div
                      key={index}
                      className="position-item"
                      onClick={() => handleSelectData(pos)}>
                      {pos}
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
            <label>4. 지원 마감일을 알려주세요.</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input-field data-input"
              min=""
              max="2099-12-31"
            />
            {errors.deadline && <p className="error-message">{errors.deadline[0]}</p>}
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
          {errors.question && <p className="error-message">{errors.question[0]}</p>}
          <textarea
            placeholder="답변"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          {errors.answer && <p className="error-message">{errors.answer[0]}</p>}
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
