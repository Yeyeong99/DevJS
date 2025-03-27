from django.db import models
from users.models import User

# Create your models here.
class CoverLetter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='coverletters/', null=True, blank=True)
    text_content = models.TextField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # 최신 피드백과 연결
    latest_feedback = models.OneToOneField(
        'feedback.Feedback',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='latest_for'
    )