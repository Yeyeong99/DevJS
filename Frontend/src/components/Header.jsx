import { useNavigate, useLocation } from "react-router-dom";
import "../assets/Header.css";

const Header = () => {
    
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const isDashboard = location.pathname === "/dashboard";
    const isTotalUploadPage = location.pathname === "/totalupload";
    const isFeedbackPage = location.pathname === "/feedback";

    if (isDashboard) {
      return;
    }
    
    if (isTotalUploadPage || isFeedbackPage) {
      const confirmMove = window.confirm(
        "작성 중인 내용이 있다면 저장 후 이동해 주세요.\n정말 대시보드로 이동할까요?"
      );
      if (confirmMove) {
        navigate("/dashboard");
      }
    }
    else {
      navigate("/dashboard")
    }
  }



  const handleLogout = () => {
    const isDashboard = location.pathname === "/dashboard";
  
    const confirmMessage = isDashboard
      ? "정말 로그아웃하시겠습니까?"
      : "정말 로그아웃하시겠습니까?\n작성 중인 내용은 저장되지 않을 수 있습니다.";
  
    const confirmLogout = window.confirm(confirmMessage);
  
    if (confirmLogout) {
      localStorage.clear();
      alert("로그아웃 되었습니다.");
      navigate("/");
    }
  };

  return (
    <header className="devjs-header">
      <div className="left">
        <div className="logo" onClick={handleLogoClick}>DEVJS</div>
      </div>
      <div className="right">
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>
    </header>
  );
};

export default Header;
