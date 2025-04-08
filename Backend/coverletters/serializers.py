# coverletters/serializers.py

from rest_framework import serializers
from .models import CoverLetter, CoverLetterItem

class CoverLetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetter
        fields = ['id', 'user', 'job_description', 'title', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class CoverLetterItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoverLetterItem
        fields = ['id', 'cover_letter', 'question', 'answer', 'order']
        read_only_fields = ['id', 'cover_letter']