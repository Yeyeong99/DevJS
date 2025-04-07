import re
from typing import List

from models import FeedbackItem
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline


# 1. 모델 로딩 (FastAPI 시작 시 1회)
model = SentenceTransformer('jhgan/ko-sbert-nli')
generator = pipeline('text-generation', model='EleutherAI/polyglot-ko-1.3b')    # 파이프 라인 사용


# 2. 문장 단위로 분리하는 함수
def split_sentences(text: str) -> List[str]:
    return [s.strip() for s in text.split('.') if s.strip()]


# 3. 생성된 LLM 결과에서 추천 문장 + 이유 추출
def parse_generated_result(text: str) -> tuple[str, str]:
    rec, reason = '', ''
    try:
        rec_match = re.search(r"추천 문장[:：]\s*(.+)", text)
        reason_match = re.search(r"이유[:：]\s*(.+)", text)

        if rec_match:
            rec = rec_match.group(1).strip()
        if reason_match:
            reason = reason_match.group(1).strip()
    except Exception as e:
        print(f"[파싱 오류] {e}")
        print(f"[원본 응답] {text}")

    return rec, reason


# 4. LLM 기반 추천 문장 + 이유 생성 함수
def generate_feedback(original: str, jd: str) -> tuple[str, str]:
    prompt = f"""
    자기소개서 문장: "{original}"
    직무 설명: "{jd}"

    이 자기소개서 문장이 JD에 잘 맞지 않는다면, 고친 문장과 그 이유를 알려주세요.

    다음 형식에 맞춰 주세요:

    추천 문장: ...
    이유: ...
    """

    try:
        result = generator(prompt, max_new_tokens=150, do_sample=True, temperature=0.9)[0]["generated_text"]
        return parse_generated_result(result)
    
    except Exception as e:
        print(f"[LLM 생성 실패] {e}")
        return "JD와 관련된 구체적인 경험으로 보완해보세요.", "직무 연관성이 부족합니다."



# 4. 최종 분석 함수
def analyze_similarity(cover_letter: str, job_description: str) -> List[FeedbackItem]:
    cl_sentences = split_sentences(cover_letter)
    jd_embedding = model.encode(job_description, convert_to_tensor=True)

    feedbacks = []
    for sent in cl_sentences:
        sent_embedding = model.encode(sent, convert_to_tensor=True)
        score = float(util.cos_sim(sent_embedding, jd_embedding)[0][0])
        is_weak = score < 0.7

        recommendation = ""
        reason = ""

        if is_weak:
             recommendation, reason = generate_feedback(sent, job_description)

        feedbacks.append(FeedbackItem(
            original_sentence=sent,
            similarity_score=score,
            is_weak=is_weak,
            recommendation=recommendation,
            reason=reason
        ))

    return feedbacks
