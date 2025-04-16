from django.db import models
from django.conf import settings

# Create your models here.
class Company(models.Model):
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Company_User')
    name = models.CharField(max_length=50)

class Company_User(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    keyword = models.CharField(max_length=100)
    job_category = models.CharField(max_length=50)
    question = models.CharField(max_length=200)
    coverletter = models.TextField()
    new_coverletter = models.TextField(blank=True)
    is_reviewsd = models.CharField(max_length=20)