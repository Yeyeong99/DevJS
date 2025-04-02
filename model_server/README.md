# FastAPI

- 기능 : 문장 간 의미 유사도 계산
- 모델 : BM-K/KoSimCSE-roberta
    - KoSimCSE 기반으로 한국어 의미 유사도에서 강력한 성능
- 로직
    - tokenizer + model 로딩 (평가 모드)
    - text1, text2 입력 받아서 전체 토큰 평균 임베딩 추출
    - cosine_similarity 로 유사도 계산
        - 소수점 4자리로 반환


## CLS 토큰 임베딩

- [CLS] : BERT 계열 모델에서 문장 전체를 대표하기 위한 특별한 토큰
- 입력의 가장 앞에 붙고, 모델이 이 위치에 **문맥 전체의 정보**를 모아놓도록 훈련된다.
- 주로 문장 분류처럼 고수준 task에 사용된다.

- 장점
    - 계산이 빠름 (하나의 벡터만 추출)
    - 분류나 fine-tuning 에서 잘 작동함

- 단점
    - 실제 의미 유사도 비교에는 부정확할 수 있다.
        - sentence-transformers에서는 [CLS] 대신 평균 임베딩 사용을 권장함.

## 변수 설명

- text1 : 자기소개서 문장
- text2 : JD의 문장 or 키워드
- why?
    - 자기소개서 문장이 채용공고 내용과 **얼마나 잘 맞는지** 보기 위함.

## 로직 부가 설명

- Django 백엔드에서 자소서를 문장 단위로 나눈 뒤, 각각에 대해 FastAPI 서버에 POST 요청 보낸다.


### requirements.txt

- 백엔드 관련 전부 들어있음.
