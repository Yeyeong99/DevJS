from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from total.models import Company_User
import json
# 모델, 인덱스 로드
from .utils import texts, index, metadatas, TotalFeedback, encode, build_total_prompt, get_llm_total_feedback 

import numpy as np


# 피드백 요청 함수
@api_view(['POST'])
def get_feedback(request):
    # 피드백 받기
    if request.method == 'POST':
        # # JD 키워드들
        # keywords = request.data.get('keywords') 
        # # 자기소개서 문항
        # answer = request.data.get('answer')
        # # 질문
        # question = request.data.get('question')
        company_id = request.data.get('company_id')
        data = Company_User.objects.filter(user=request.user, company_id=company_id)
        
        feedback_need = data.order_by('-created_at')[0]
        keywords = feedback_need.keywords
        question = feedback_need.question
        answer = feedback_need.answer

        # 벡터 검색
        # 임계값 설정
        distance_threshold = 300  # 이 값은 적절히 조정해야 합니다 (벡터 유사도에 따라 다름)

        # FAISS 검색 - k를 더 많이 설정하고 나중에 필터링
        query_embedding = encode(keywords)
        D, I = index.search(np.array([query_embedding]), k=50)  # 일단 더 많은 결과를 가져옴
        for idx, i in enumerate(I[0]):
            distance = float(D[0][idx])
            print(texts[i], distance)

        # 거리가 임계값보다 작은 결과만 필터링
        filtered_contexts = []
        for idx, i in enumerate(I[0]):
            distance = float(D[0][idx])
            if distance < distance_threshold:  # 거리가 임계값보다 작은 경우만 선택
                filtered_contexts.append({
                    "text": texts[i],
                    "metadata": metadatas[i],
                    "distance": distance  # 거리 정보도 함께 저장
                })

        # 최대 3개까지만 사용
        retrieved_contexts = filtered_contexts[:3]
        print(retrieved_contexts)
        # 결과가 너무 적으면 로그 남기기 (선택사항)
        if len(retrieved_contexts) == 0:
            print(f"Warning: No results found with distance < {distance_threshold}")
        # 프롬프트 구성: 종합 피드백
        total_prompt = build_total_prompt(question, answer, keywords, retrieved_contexts)

        # Groq API 호출 -> 답변 받기
        total_feedback = get_llm_total_feedback(total_prompt)

        try:
            formatted_total_feedback = TotalFeedback.model_validate(total_feedback)
        except:
            clean_json = total_feedback.get("properties", total_feedback)  
            formatted_total_feedback = TotalFeedback.model_validate(clean_json)

        feedback_need.feedback = formatted_total_feedback.ai_feedback
        feedback_need.save()

        feedback_need.total_feedback = formatted_total_feedback.feedback
        feedback_need.save()

        data = {
            'total_feedback': formatted_total_feedback.feedback,
            'ai_feedback': formatted_total_feedback.ai_feedback,
        }
        return Response(data=data, status=status.HTTP_200_OK)
