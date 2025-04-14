from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    provider = models.CharField(max_length=20, null=True, blank=True)    # google, kakao
    social_id = models.CharField(max_length=100, null=True, blank=True)
    # 닉네임 필드
    nickname = models.CharField(max_length=100, null=True, blank=True)    # 일단 비워도 된다고 설정하기 >>> 나중에 필수로 바꿀 수 있음.