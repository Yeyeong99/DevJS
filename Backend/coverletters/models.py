from django.db import models
from django.contrib.auth import get_user_model
from jobdescriptions.models import JobDescription

User = get_user_model()

class CoverLetter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cover_letters', null=True, blank=True)
    job_description = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='cover_letters')
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    is_reviewed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or f'CoverLetter #{self.id}'



class CoverLetterItem(models.Model):
    cover_letter = models.ForeignKey(CoverLetter, related_name='items', on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"[{self.cover_letter_id}] {self.question[:20]}"