from django.db import models
from jobdescriptions.models import JobDescription    # JD 연결하기


class CoverLetter(models.Model):
    job_description = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='cover_letters')
    content = models.TextField()
    
    def __str__(self):
        return f'CoverLetter #{self.id}'
