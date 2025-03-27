from django.db import models
from users.models import User

# Create your models here.
class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

class ParsedResume(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE)
    parsed_text = models.TextField()
    key_experiences = models.TextField(blank=True, help_text="AI가 추출한 핵심 경력")