from rest_framework import serializers

from .models import Feedback, RecommendationSentence


class RecommendationSentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecommendationSentence
        fields = ('content', 'reason', )
        

# 하나의 문장에 대한 피드백 + 추천 문장까지 포함한다.        
class FeedbackSerializer(serializers.ModelSerializer):
    recommendation = RecommendationSentenceSerializer(read_only=True)
    
    class Meta:
        model = Feedback
        fields = ('id', 'original_sentence', 'similarity_score', 'is_weak', 'recommendation', )
