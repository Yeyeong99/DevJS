from rest_framework import serializers
from .models import JobDescription

class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = ['id', 'user', 'file', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']