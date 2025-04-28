from django.db import models
from django.conf import settings

# Create your models here.
class Company(models.Model):
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Company_User')
    name = models.CharField(max_length=50)

class Company_User(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    keywords = models.CharField(max_length=100)
    position = models.CharField(max_length=50)
    deadline = models.DateField()
    question = models.CharField(max_length=200)
    question_number = models.IntegerField(blank=True)
    answer = models.TextField()
    is_reviewd = models.CharField(max_length=20, default='수정 중')
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)