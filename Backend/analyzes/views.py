from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# 모델, 인덱스 로드
from .utils import index, texts, metadatas, encode, build_prompt, get_llm_response

import numpy as np


# 피드백 요청 함수
@api_view(['POST'])
def get_feedback(request):
    # 피드백 받기
    if request.method == 'POST':
        # JD 키워드들
        jd_keywords = request.data.get('jd_keywords')
        # coverletter
        coverletter = request.data.get('coverletter')

        # 벡터 검색
        query_embedding = encode(coverletter)
        D, I = index.search(np.array([query_embedding]), k=3)
        retrieved_contexts = [
            {
                "text": texts[i],
                "metadata": metadatas[i]
            }
            for i in I[0]
        ]
    
        # 프롬프트 구성
        prompt = build_prompt(coverletter, jd_keywords, retrieved_contexts)

        # Groq API 호출 -> 답변 받기
        feedback = get_llm_response(prompt)

        return Response(data={'feedback': feedback}, status=status.HTTP_200_OK)
