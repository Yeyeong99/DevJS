from django.db import models
from django.conf import settings

class JobDescription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)    # 로그인 사용자 (FK)
    file = models.FileField(upload_to='jds/', null=True, blank=True)    # 이미지나 PDF로 받을 JD 파일 필드
    content = models.TextField(blank=True)    # OCR 전체 원문
    created_at = models.DateTimeField(auto_now_add=True)    # 생성 시간

    def __str__(self):
        return f'JD #{self.id} - {self.user.username}'
    
    
# 강점만 받을 모델 클래스
class Skill(models.Model):
    jd = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='skills')    # jd 원문
    content = models.CharField(max_length=200)    # OCR로 뽑은 역량
    
    def __str__(self):
        return self.content