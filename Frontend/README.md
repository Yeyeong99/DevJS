# Front-end Role

## 1. 로그인 및 인증 기능 구현

✅ 담당할 작업

- 로그인 화면 UI 개발
- OAuth 로그인 (Google, Naver, Kakao, GitHub 연동)
- 로그인 성공/실패 처리 및 에러 핸들링
- 백엔드 API 연동 (Axios 사용)
- 로그인 상태 관리 (React Query 또는 useContext 활용)
  
✅ 사용할 기술

- React (useState, useEffect) → 로그인 UI 개발
- Axios → 로그인 API 연동
- React Router → 로그인 후 페이지 이동
- React Query → 로그인 상태 캐싱

## 2. 자기소개서 & JD 업로드 기능 구현

✅ 담당할 작업

- 자기소개서 & JD 업로드 화면 UI 개발
- 파일 업로드 및 미리보기 기능 구현
- OCR API 연동 (JD 내용 인식)
- 백엔드 API 연동 (파일 업로드 처리)
  
✅ 사용할 기술

- React (useState, useEffect) → 파일 업로드 UI
- Axios → API 연동
- React Query → 업로드한 파일 상태 관리

## 3. 자기소개서 첨삭 결과 화면 개발

✅ 담당할 작업

- 첨삭 결과를 보여주는 UI 개발
- 피드백을 표 형태로 정리하여 표시
- 다시 첨삭받기 버튼 추가
- DB 저장 버튼 추가
  
✅ 사용할 기술
- React (useEffect, useState) → UI 구현
- Axios → API 호출 및 결과 가져오기
- React Query → 데이터 관리

## 4. 자기소개서 목록 관리 (DB에서 불러오기 & 삭제)

✅ 담당할 작업

- 저장된 자기소개서 목록 조회 화면 개발
- 특정 자기소개서 선택 후 삭제 기능
- 페이지네이션 (필요 시)
  
✅ 사용할 기술

- React (useEffect, useState) → 목록 UI 개발
- Axios → 데이터 불러오기 & 삭제 API 연동
- React Query → 캐싱하여 성능 최적화

## 5. UI/UX 개선 & 반응형 디자인 적용

✅ 담당할 작업

- Tailwind CSS를 이용한 UI 스타일링
- 모바일 & 데스크탑 반응형 디자인 적용
- 로딩 스피너 추가
  
✅ 사용할 기술

- Tailwind CSS → 스타일링
- Framer Motion (선택) → 애니메이션 효과 추가

## 결론 - 프론트엔드에서 담당할 핵심 역할

1) 로그인 기능 구현 (OAuth 연동)

2) 자기소개서 & JD 업로드 기능 개발

3) 첨삭 결과 페이지 UI 개발

4) 자기소개서 목록 관리 (조회 & 삭제)

5) Tailwind CSS로 UI 스타일링 및 반응형 적용

6) React Query & Axios로 API 연동 및 상태 관리

</br>
</br>
</br>
</br>

# Front-end Stack


## 1. 코드 에디터 & IDE
✅ VS Code 사용

✅ 필수 확장 프로그램

- ESLint → 코드 스타일 체크
- Prettier → 코드 자동 정렬
- Tailwind CSS IntelliSense → Tailwind CSS 지원
- Thunder Client / Postman → API 테스트
- GitHub Copilot → AI 코드 자동 완성 (유료)
- WebStorm (유료) → IntelliJ 계열이라 강력한 기능 제공
- Sublime Text (라이트한 코드 편집기)

## 2. CSS 프레임워크

✅ Tailwind CSS

- 유틸리티 기반 CSS 프레임워크 (클래스 조합으로 디자인)
- 빠르게 스타일 적용 가능, 유지보수 편리
- 현업에서 점점 많이 쓰임

✅ Bootstrap

- 예전에는 많이 썼지만, 최근에는 Tailwind로 대체되는 중
- 버튼, 카드, 그리드 등 기본 컴포넌트가 있어서 빠르게 디자인 가능
- 기업 서비스에서는 여전히 많이 씀 (관리자 페이지 등)

## 3. 상태 관리 (State Management)

작은 프로젝트는 useState, useContext 정도로 충분하지만, 큰 프로젝트에서는 상태 관리 라이브러리를 사용

✅ Redux Toolkit (🔥 대세!)

- 복잡한 상태 관리할 때 많이 사용
- 예전 Redux보다 코드가 간결함
- 대규모 프로젝트에서 자주 사용됨
  
✅ React Query (데이터 캐싱 & 비동기 상태 관리)

- API 호출 결과를 캐싱해서 최적화
- API 연동 많을 때 Redux보다 React Query를 더 씀!
  
✅ Zustand (경량 상태 관리)
Redux보다 가볍고 사용법 간단
작은 프로젝트에서 인기 많음!

대규모 프로젝트 → Redux Toolkit
API 호출 & 데이터 캐싱 많음 → React Query
작은 프로젝트 & 간단한 상태 관리 → Zustand

## 4. API 호출 & 데이터 처리
프론트엔드는 보통 백엔드랑 API로 통신

✅ Axios
- fetch()보다 더 강력하고 편리함
- 요청/응답 인터셉터 기능 제공 (ex. 토큰 자동 추가)
- 대부분의 프로젝트에서 사용됨
- 
✅ Fetch API (기본 제공)
- 브라우저 내장 API라 별도 설치 필요 없음
- 하지만 에러 핸들링이 불편함

## 5. 빌드 & 번들링 툴
프론트엔드 코드를 최적화하고 배포할 때 빌드 도구 사용

✅ Vite (🔥 최신 대세!)

- Webpack보다 빠름
- React, Vue, Svelte 프로젝트에서 많이 사용됨
- 개발 서버 속도가 빠름
  
✅ Webpack (기존 대세, 대형 프로젝트용)

- 대기업, 레거시 프로젝트에서 여전히 사용
- 복잡한 설정이 필요하지만, 강력한 기능 제공

## 6. 기타 필수 개발 툴
✅ Git & GitHub
- 코드 버전 관리 & 협업
- Git Flow 사용 (브랜치 전략)
  
✅ Postman / Thunder Client
- API 테스트 도구
  
✅ Jira / Notion / Trello
- 프로젝트 일정 & 작업 관리
  
✅ Figma / Zeplin
- UI/UX 디자인 협업

## 결론 - 현업에서 가장 많이 쓰는 툴

- 코드 에디터 → VS Code
- 프레임워크 → React
- 스타일링 → Tailwind CSS, Material UI
- 상태 관리 → Redux Toolkit / React Query
- API 연동 → Axios
- 빌드 도구 → Vite
- 협업 툴 → GitHub, Jira, Notion



