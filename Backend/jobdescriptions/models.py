from django.db import models
from django.conf import settings


# class Company(models.Model):
#     name = models.CharField(max_length=255, unique=True)    # 지원 회사명, 겹치지 않도록
    
#     def __str__(self):
#         return self.name


class JobDescription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jds')    # 로그인 사용자 (FK)
    # company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jds')    # 회사명
    # position = models.CharField(max_length=255)    # 지원 직무명
    deadline = models.DateField(null=True, blank=True)    # 마감일
    file = models.FileField(upload_to='jds/', null=True, blank=True)    # 이미지나 PDF로 받을 JD 파일 필드
    content = models.TextField()    # OCR 전체 원문
    created_at = models.DateTimeField(auto_now_add=True)    # 생성 시간
    
    # class Meta:
    #     constraints = [
    #         models.UniqueConstraint(fields=['company', 'position'], name='unique_company_position'),    # 회사명과 직무가 같으면 또 저장되지 않는다.
    #     ]

    def __str__(self):
        return f'JD #{self.id} - {self.user.username}'
    
    
# 강점만 받을 모델 클래스
class Skill(models.Model):
    jd = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='skills')    # jd 원문
    content = models.CharField(max_length=200)    # JD 주요 역량
    
    def __str__(self):
        return self.content