from django.db import models
from analyzes.models import Analysis

# 자소서 문장 하나에 대한 분석 결과 담는 모델
class Feedback(models.Model):
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE, related_name='feedbacks')
    original_sentence = models.TextField()
    similarity_score = models.FloatField()
    is_weak = models.BooleanField(default=False)    # 유사도가 낮은 문장인지 표시하기
    
    def __str__(self):
        return f'Feedback #{self.id} - score: {self.similarity_score:.2f}'
    
# 개선을 위한 추천 문장 담는 모델
class RecommendationSentence(models.Model):
    feedback = models.OneToOneField(Feedback, on_delete=models.CASCADE, related_name='recommendation')
    content = models.TextField()
    reason = models.TextField(null=True, blank=True)    # 추천 문장 생성 이유 (LLM 호출 시, 왜 만들었는지 생성하면 된다.)
    
    def __str__(self):
        return f'Recommendation for Feedback #{self.feedback.id}'
    