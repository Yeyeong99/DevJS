# 폴더별 기능

```
Backend/
├── manage.py
├── Devjs/                 # 프로젝트 디렉토리
│   ├── __init__.py
│   ├── settings.py        # 'from decouple import config' 사용함.
│   ├── urls.py
│   └── wsgi.py
│
├── accounts/                # 사용자 인증 관련 앱
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            # CustomUser 모델 정의
│   ├── tests.py
│   ├── urls.py              # /auth/kakao, /auth/google URL 라우팅
│   ├── views.py             # 카카오, 구글 로그인 뷰
│   └── utils.py             # 사용자 생성 및 JWT 발급 함수
│
├── analyzes/                # JD + 자소서를 입력받아 분석 관련 앱
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            # Analysis 모델 정의
│   ├── tests.py
│   ├── urls.py
│   └── views.py
│
├── feedbacks/                # JD + 자소서를 입력받아 분석 관련 앱
│
└── requirements.txt
```

---

## 🗂️ 각 파일 역할 요약

| 파일명 | 설명 |
|--------|------|
| `accounts/models.py` | `CustomUser` 모델 정의 (`AbstractUser` 상속) |
| `accounts/views.py` | 카카오/구글 로그인 처리를 위한 APIView 정의 |
| `accounts/urls.py` | `/auth/kakao/`, `/auth/google/` 등의 URL 연결 |
| `accounts/utils.py` | 소셜 사용자 생성 및 JWT 발급 로직 모듈화 |
| `backend/settings.py` | 앱 등록, OAuth 키 설정, 인증 설정 등 |
| `backend/urls.py` | 전체 API 라우팅 설정 (accounts.urls 포함) |

---

### accounts

- `models.py`
    - `CustomUser` 모델 정의 (`AbstractUser` 상속)
    - 추가 필드
        - `provider` : 소셜 로그인 제공자 이름
        - `social_id` : 소셜 로그인 제공자 보내주는 고유 사용자 ID  
        => 해당 유저의 소셜 로그인 계정을 유일하게 식별한다.

- `views.py`
    - `KakaoLoginView`, `GoogleLoginView`, `UserInfoView` 작성
    - 로직 흐름
        1. 프론트에서 받은 code 값을 받는다.
        2. 해당 code로 Access Token 요청
        3. Access Token으로 사용자 정보 요청 (email, id 등)
        4. 사용자 DB에 등록 or 이미 존재하면 로그인
        5. JWT 토큰 발급 후 프론트에 응답


- `urls.py`
    - `api/` 하위로 연결
    - URL 동작 방법
        - POST : `api/auth/kakao` (카카오 로그인) , `api/auth/google` (구글 로그인)
        - GET : `api/user/` (JWT 필요) 현재 로그인된 사용자 정보


**로그인 완료** 0403
✅ 카카오 소셜 로그인  
✅ JWT 기반 인증  
✅ access/refresh 토큰 관리  
✅ 토큰 자동 갱신  
✅ 로그인 후 유저 정보 조회  
✅ 로그인 유지 기능  


- 추가 사항

    - [ ] 닉네임 설정

---

### analyzes

- 목적 : JD + 자소서를 입력받아 AI 분석을 요청하고, 처리 상태를 관리하는 기능
- 주요 기능

    - `/api/analyzes/` : 분석 요청

        - POST 요청 → 분석 요청 저장 → FastAPI 호출  
                    ↘ 실패 시 'failed'  
                    ↘ 성공 시: Feedback + Recommendation 저장 → 분석 완료 처리

    - `/api/analyzes/{coverletter_id}/retry/` : 재분석 요청

- 구현 요소

    - `Analysis`  모델 : 요청 상태, 요청 시각, 결과 완료 여부 등 관리
    - FastAPI로 모델 호출
    - Celery 사용 시 : 비동기 처리 등록

---

### feedbacks

- 목적 : 분석 결과로 생성된 피드백 및 추천 문장을 저장하고, 이를 사용자에게 제공하거나 반영하는 기능

- 주요 기능

    - `/api/feedbacks/{coverletter_id}/` : 분석된 피드백 전체 조회
    - `/api/feedbacks/{feedback_id}/apply/` : 추천 문장 반영

- 구현 요소

    - `Feedback` 모델 : 자소서 문장별 피드백, 유사도 등
    - `RecommendationSentence` 모델 : 추천 문장, 생성 이유, 생성 방식 등
    - 문장 반영 시, `coverletters` 앱의 자소서 업데이트
    
---

## ✨ 다음에 할 수 있는 것들 (선택 옵션)

| 기능 | 설명 |
|------|------|
| 🔓 로그아웃 기능 | localStorage 초기화 + `/login`으로 이동 |
| 👤 유저 프로필 사진, 닉네임 표시 | 카카오에서 `nickname`, `profile_image_url` 가져오기 |
| ⚠️ 로그인 안 된 상태에서 `/dashboard` 접근 제한 | access_token 없으면 리디렉트 |
| 📦 axios 인스턴스로 인증 공통 처리 | 요청마다 헤더 설정 중복 줄이기 |
| 🛡 실제 배포 환경용 보안 설정 | CORS, HTTPS, 토큰 저장 방식 등 |

---

