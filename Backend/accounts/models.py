from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    provider = models.CharField(max_length=20, null=True, blank=True)    # google, kakao
    social_id = models.CharField(max_length=100, null=True, blank=True)
    nickname = models.CharField(max_length=30, blank=True, null=True)  # 유찬 추가
