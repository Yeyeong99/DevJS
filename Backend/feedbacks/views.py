from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Feedback, RecommendationSentence
from .serializers import FeedbackSerializer

from analyzes.models import Analysis
from coverletters.models import CoverLetter


# 피드백 결과 '조회' API
class FeedbackListView(APIView):
    def get(self, request, coverletter_id):
        try:
            # 가장 최근 Analysis 기준 (또는 전체 중 가장 마지막 것)
            analysis = Analysis.objects.filter(cover_letter__id=coverletter_id).order_by('-requested_at').first()    # 요청 시간 기준으로 내림차순 정렬한다.
            if not analysis:
                return Response({'error': '분석 결과가 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
            
            feedbacks = analysis.feedbacks.all()
            serializer = FeedbackSerializer(feedbacks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 추천 문장 반영 API : 추천 문장을 자소서 내용에 실제로 반영 (텍스트 교체하기)
class ApplyRecommendationView(APIView):
    def post(self, request, feedback_id):
        try:
            feedback = Feedback.objects.get(id=feedback_id)
            recommendation = feedback.recommendation
            if not recommendation:
                return Response({'error': '추천 문장이 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # 자소서에 해당 문장 바꾸기
            cover_letter = feedback.analysis.cover_letter
            original = feedback.original_sentence
            new = recommendation.content
            
            cover_letter.content = cover_letter.content.replace(original, new, 1)    # 자소서 내용 중 original 문장을 찾아서 한 번만 new 문장으로 교체
            cover_letter.save()    # 저장
            
            return Response({'message': '추천 문장이 자소서에 반영되었습니다.'}, status=status.HTTP_200_OK)
        
        except Feedback.DoesNotExist:
            return Response({'error': '피드백을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)