from django.db import models
from django.utils import timezone

# class Analysis(models.Model):
#     # 상태 확인
#     STATUS_CHOICES = [
#         ('pending', 'Pending'),
#         ('in_progress', 'In Progress'),
#         ('done', 'Done'),
#         ('failed', 'Failed'),
#     ]
    
#     # JD와 자소서는 외부 앱의 모델 참조하기
#     cover_letter = models.ForeignKey('coverletters.CoverLetter', on_delete=models.CASCADE, related_name='analysis')
#     job_description = models.ForeignKey('jobdescriptions.JobDescription', on_delete=models.CASCADE, related_name='analysis')
#     # 상태 관련 필드
#     status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
#     # 요청 일시
#     requested_at = models.DateTimeField(default=timezone.now)
#     # 완료 일시
#     completed_at = models.DateTimeField(null=True, blank=True)
#     # 에러 메시지
#     error_message = models.TextField(null=True, blank=True)
    
#     def __str__(self):
#         return f'Analysis for CoverLetter #{self.cover_letter.id} - {self.status}'