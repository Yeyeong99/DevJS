from django.db import models
from coverletters.models import CoverLetter
from jds.models import JobDescription

# Create your models here.
class Feedback(models.Model):
    cover_letter = models.ForeignKey(CoverLetter, on_delete=models.CASCADE)
    job_description = models.ForeignKey(JobDescription, on_delete=models.SET_NULL, null=True)
    matching_score = models.FloatField(help_text="JD와의 일치도 (0~1)")
    grammar_score = models.FloatField(null=True, blank=True)
    clarity_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class RecommendationSentence(models.Model):
    feedback = models.ForeignKey(Feedback, on_delete=models.CASCADE, related_name='recommendations')
    sentence = models.TextField()
    reason = models.CharField(max_length=255, help_text="추천 이유 또는 강조 키워드")