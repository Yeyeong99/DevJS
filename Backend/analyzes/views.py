from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from total.models import Company_User
import json
# 모델, 인덱스 로드
from .utils import texts, index, metadatas, encode, build_total_prompt, build_sentence_prompt, get_llm_total_feedback, get_sentence_feedback 

import numpy as np


# 피드백 요청 함수
@api_view(['POST'])
def get_feedback(request):
    # 피드백 받기
    if request.method == 'POST':
        # JD 키워드들
        jd_keywords = request.data.get('jd_keywords') 
        # 자기소개서 문항
        coverletter = request.data.get('coverletter')
        # 질문
        question = request.data.get('question')

        # 벡터 검색
        query_embedding = encode(jd_keywords)
        D, I = index.search(np.array([query_embedding]), k=3)
        retrieved_contexts = [
            {
                "text": texts[i],
                "metadata": metadatas[i]
            }
            for i in I[0]
        ]
    
        # 프롬프트 구성: 종합 피드백
        total_prompt = build_total_prompt(question, coverletter, jd_keywords, retrieved_contexts)

        # Groq API 호출 -> 답변 받기
        total_feedback = get_llm_total_feedback(total_prompt)

        # 프롬프트 구성: 문장 별 피드백
        sentence_prompt = build_sentence_prompt(coverletter, total_feedback)
        sentence_feedback = get_sentence_feedback(sentence_prompt)

        before_feedback = sentence_feedback.before_feedback
        after_feedback = sentence_feedback.after_feedback
        
        final_before_feedback = []
        final_after_feedback = []
        for before, after in zip(before_feedback, after_feedback):
            if before != after:
                final_before_feedback.append(before)
                final_after_feedback.append(after)

        return Response(data={'total_feedback': total_feedback, 'final_before_feedback': final_before_feedback, 'final_after_feedback': final_after_feedback}, status=status.HTTP_200_OK)
