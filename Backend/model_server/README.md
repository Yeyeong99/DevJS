# FastAPI

- JD + 자소서를 받아서 → 유사도 분석 + 추천 문장 생성

## 구조

```

model-server/
├── main.py               ← FastAPI 엔트리포인트
├── models.py             ← Pydantic 데이터 구조
├── analyze.py            ← 유사도 분석 + 추천 생성 함수
└── client.py             ← 여기서 request_analysis 함수 정의

```

### analyze.py

1. 유사도 기반 분석 + 간단한 추천 문장 생성
    
    - `sentence-transformers` 사용
    - `KoSimCSE`, `KLUE`, `KoBERT`, 등 벡터 기반 유사도 분석에 최적
    - 문장 단위 유사도 계산 (`util.cos_sim`)이 매우 직관적
    - 속도 빠르고 문장 나누기 & 추천도 쉽게 가능

- 응답 형식

```
{
  "feedbacks": [
    {
      "original_sentence": "...",
      "similarity_score": 0.63,
      "is_weak": true,
      "recommendation": "...",
      "reason": "..."
    },
    ...
  ]
}
```

2. FastAPI에 LLM 생성기능 -> JD + 자기소개서 문장을 기반으로 **추천 문장 자동 생성**

## 🔁 사용자 요청 흐름:

1. Django에서 분석 요청 → `Analysis` 객체만 생성 → **응답 바로 보냄**
2. Celery task 시작 → FastAPI로 문장 리스트 전송
3. FastAPI:
   - 약한 문장만 추림
   - 각 문장에 대해 `"추천 문장 + 고쳐야 하는 이유"` 한 번에 생성
4. 생성된 결과 → Django DB에 저장 (`Feedback`, `RecommendationSentence`)

---

### ⏱️ 이 전략의 장점

| 장점 | 설명 |
|------|------|
| ✅ 속도 | 문장 여러 개 한 번에 처리해서 효율 극대화 |
| ✅ UX | Django는 응답 빨리 보내고, 결과는 백그라운드로 생성 |
| ✅ 품질 | 추천 문장과 이유가 일관된 맥락으로 생성됨 |
| ✅ 확장성 | 나중에 프롬프트 튜닝 or 다양한 문장 스타일 적용 가능

---
