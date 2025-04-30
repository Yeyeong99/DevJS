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
        try:
            company_id = request.data.get('company_id')
            if not company_id:
                return Response({"error": "company_id is required"}, status=status.HTTP_400_BAD_REQUEST)
                
            data = Company_User.objects.filter(user=request.user, company_id=company_id)
            if not data.exists():
                return Response({"error": "No data found for this user and company"}, status=status.HTTP_404_NOT_FOUND)
            
            feedback_need = data.order_by('-created_at')[0]
            keywords = feedback_need.keywords
            question = feedback_need.question
            answer = feedback_need.answer

            # 벡터 검색
            try:
                # 임계값 설정
                distance_threshold = 300

                # FAISS 검색
                query_embedding = encode(keywords)
                D, I = index.search(np.array([query_embedding]), k=50)
                
                # 거리가 임계값보다 작은 결과만 필터링
                filtered_contexts = []
                for idx, i in enumerate(I[0]):
                    distance = float(D[0][idx])
                    if distance < distance_threshold:
                        filtered_contexts.append({
                            "text": texts[i],
                            "metadata": metadatas[i],
                            "distance": distance
                        })

                # 최대 3개까지만 사용
                retrieved_contexts = filtered_contexts[:3]
                
                if not retrieved_contexts:
                    print(f"Warning: No results found with distance < {distance_threshold}")
                    # 이 경우에도 계속 진행 (빈 컨텍스트로 프롬프트 생성)
            except Exception as e:
                print(f"Error during vector search: {e}")
                # 벡터 검색 실패 시 빈 컨텍스트로 진행
                retrieved_contexts = []
                
            # 프롬프트 구성: 종합 피드백
            total_prompt = build_total_prompt(question, answer, keywords, retrieved_contexts)

            # Groq API 호출 -> 답변 받기
            try:
                feedback_result = get_llm_total_feedback(total_prompt)
                
                # 결과 저장
                feedback_need.feedback = feedback_result.ai_feedback
                feedback_need.total_feedback = feedback_result.feedback
                feedback_need.save()
                
                data = {
                    'total_feedback': feedback_result.feedback,
                    'ai_feedback': feedback_result.ai_feedback,
                }
                return Response(data=data, status=status.HTTP_200_OK)
                
            except Exception as e:
                print(f"Error getting feedback from LLM: {e}")
                return Response(
                    {"error": "피드백 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        except Exception as e:
            print(f"Unexpected error in get_feedback: {e}")
            return Response(
                {"error": "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    return Response({"error": "Only POST method is allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)