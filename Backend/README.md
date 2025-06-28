# 폴더별 기능

```
Backend/
├── manage.py
├── Devjs/                   # 프로젝트 디렉토리
│   ├── __init__.py
│   ├── settings.py        
│   ├── urls.py              # `api/` 정의
│   └── wsgi.py
│
├── accounts/                # 사용자 인증 관련 앱
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            # CustomUser 모델 정의
│   ├── serializers.py       # 사용자 정보 직렬화 클래스 정의
│   ├── tests.py
│   ├── urls.py              # 로그인, 로그아웃, 사용자 페이지, 닉네임 생성 api 정의
│   ├── views.py             # 로그인, 로그아웃, 사용자 정보 확인, 닉네임 생성 함수
│   └── utils.py             # 사용자 생성 및 JWT 발급 함수
│
├── analyzes/                # JD + 자소서를 입력받아 분석 관련 앱
│   ├── rag/                 # RAG 관련 벡터 DB
│   │   └── faiss
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py           
│   ├── models.py
│   ├── tests.py
│   ├── urls.py              # 피드백 요청 api 정의
│   ├── utils.py             # 유사도 분석, LLM 모델 응답 받기 함수
│   └── views.py             # 피드백 요청 함수
│
├── total/                   # JD-keyword와 Coverletter 저장하는 앱
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py            # 회사 모델, 회사-사용자 중개 모델 정의
│   ├── serializers.py       # JD keyword, coverletter 정보 직렬화 클래스 정의
│   ├── tests.py
│   ├── urls.py              # 사용자가 JD, coverletter 관련 작성 정보 요청 api
│   └── views.py             # 사용자가 작성한 자소서 질문, 내용, JD-keyword, 지원직무, 회사 받는 함수
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
        - `nickname` : 사용자가 설정한 닉네임

- `views.py`
    - `{platform-name}LoginView` 작성
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
        - GET : `api/auth/user/` (JWT 필요) 현재 로그인된 사용자 정보 => **이거 프론트 / 백 맞추기**


**로그인 기능** 

✅ 소셜 로그인  
✅ JWT 기반 인증  
✅ access/refresh 토큰 관리  
✅ 토큰 자동 갱신  
✅ 로그인 후 유저 정보 조회  
✅ 로그인 유지 기능  


---

### analyzes

---
- 사용자가 입력한 자기소개서와 키워드를 바탕으로 자기소개서 내 키워드 반영 정도를 평가하고 사용자의 자기소개서를 개선할 수 있는 방향을 제시함

