import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../assets/Home.css"; 

function Home() {
  const navigate = useNavigate();

  // ✅ 홈 이동 핸들러
  const goHome = () => {
    navigate("/");
  };

  return (
    <motion.div 
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >

      <motion.div 
        className="logo"
        style={{ cursor: "pointer" }}
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        DevJS
      </motion.div>

      <motion.div 
        className="text-container"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
        }}
      >
        <motion.h1 
          className="headline"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 1 }}
        >
          개발자를 위한 자기소개서 첨삭 서비스
        </motion.h1>

        <motion.p 
          className="subtext"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 1 }}
        >
          AI 기반으로 자기소개서를 분석하고, 맞춤 피드백을 받아보세요.
        </motion.p>
      </motion.div>

      <motion.button 
        className="login-btn"
        onClick={() => navigate("/login")}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        로그인
      </motion.button>
    </motion.div>
  );
}

export default Home;
