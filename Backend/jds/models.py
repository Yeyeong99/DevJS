from django.db import models
from users.models import User

# Create your models here.
class JobDescription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='jds/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    text_content = models.TextField(blank=True)

class ExtractedKeyword(models.Model):
    jd = models.ForeignKey(JobDescription, on_delete=models.CASCADE)
    keyword = models.CharField(max_length=255)