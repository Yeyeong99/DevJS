import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../assets/Dashboard.css";
import Header from "../components/Header";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();

  useEffect(() => {
    console.log(jobs)
    const fetchData = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        console.warn("\u26d4 access_token이 없습니다.");
        return;
      }

      try {
        const [jobsRes, userRes] = await Promise.all([
          axios.get("http://localhost:8000/api/total/total_list/", {
            headers: { Authorization: `Bearer ${accessToken}` }
          }),
          axios.get("http://localhost:8000/api/auth/user/", {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
        ]);

        setJobs(jobsRes.data);
        setUser(userRes.data);
      } catch (err) {
        const errorCode = err.response?.data?.code;

        if (errorCode === "token_not_valid") {
          console.warn("\u{1F501} access_token 만료 → refresh 시도");

          const refreshToken = localStorage.getItem("refresh_token");
          try {
            const refreshRes = await axios.post("http://localhost:8000/api/token/refresh/", { refresh: refreshToken });
            const newAccessToken = refreshRes.data.access;
            localStorage.setItem("access_token", newAccessToken);

            const retryUserRes = await axios.get("http://localhost:8000/api/auth/user/", {
              headers: { Authorization: `Bearer ${newAccessToken}` }
            });

            setUser(retryUserRes.data);
          } catch (refreshError) {
            console.error("\u26d4 refresh_token도 만료됨 → 로그아웃 처리");
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
            localStorage.clear();
            window.location.href = "/";
          }
        } else {
          console.error("⛔ 유저 정보 요청 실패:", err.response?.data || err);
        }
      }
    };

    fetchData();
  }, []);

  // jobs를 company_name 기준으로 그룹화
  const groupedJobs = jobs.reduce((acc, job) => {
    if (!acc[job.company_name]) {
      acc[job.company_name] = {
        company_name: job.company_name,
        jobs: [],
      };
    }
    acc[job.company_name].jobs.push(job);
    return acc;
  }, {});

  const groupedArray = Object.values(groupedJobs);
  const visibleGroups = showMore ? groupedArray : groupedArray.slice(0, 3);

  const sortedGroupedJobs = [...visibleGroups].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a.jobs[0][sortConfig.key];
    const bVal = b.jobs[0][sortConfig.key];

    if (sortConfig.key === 'deadline') {
      return sortConfig.direction === 'asc'
        ? new Date(aVal) - new Date(bVal)
        : new Date(bVal) - new Date(aVal);
    }

    return sortConfig.direction === 'asc'
      ? aVal.localeCompare(bVal, 'ko')
      : bVal.localeCompare(aVal, 'ko');
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const handleCreateClick = () => {
    navigate("/totalupload");
  };

  const handleGroupClick = (companyId) => {
    navigate(`/coverletter/${companyId}`);
  };

  const handleSeeMore = () => setShowMore(true);

  if (!user) return <p className="loading">유저 정보를 불러오는 중입니다...</p>;

  return (
    <div className="dashboard-container">
      <Header />
  
      <main className="dashboard-main">
        <section className="dashboard-header">
          <h1 className="greeting">안녕하세요, {user.nickname}님</h1>
          <p className="welcome">개발자를 위한 자기소개서 첨삭 서비스 DevJS에 오신 것을 환영합니다.</p>
          <button className="create-button" onClick={handleCreateClick}>+ 새로 만들기</button>
        </section>
  
        {groupedArray.length === 0 ? (
          <div className="no-jobs">
            <p>📝 아직 등록된 자소서가 없습니다.</p>
            <p>+ 새로 만들기를 눌러 자소서를 등록해보세요!</p>
          </div>
        ) : (
          <section className="job-section">
            <table className="job-table">
              <thead>
                <tr>
                  <th>기업</th>
                  <th>자소서 수</th>
                  <th onClick={() => handleSort('deadline')} className="sortable-header">
                    지원 마감일 {getSortIndicator('deadline')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedGroupedJobs.map((group, index) => {
                  const earliestDeadline = group.jobs
                    .map(job => new Date(job.deadline))
                    .sort((a, b) => a - b)[0]
                    .toISOString()
                    .split('T')[0];
  
                  return (
                    <tr key={index} className="job-row" onClick={() => handleGroupClick(group.jobs[0].company)}>
                      <td className="company-name">{group.company_name}</td>
                      <td>{group.jobs.length}</td>
                      <td>{earliestDeadline}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
  
            {!showMore && groupedArray.length >= 4 && (
              <div className="see-more" onClick={handleSeeMore}>
                더보기
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}  

export default Dashboard;