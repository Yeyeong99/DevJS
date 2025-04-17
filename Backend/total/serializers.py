from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company, Company_User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model
        fields = ['id', 'nickname']


# 중개 테이블 시리얼라이저
class CompanyUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Company_User
        fields = [
            'id',
            'company',
            'user',
            'keyword',
            'job_category',
            'question',
            'coverletter',
            'new_coverletter',
            'is_reviewsd'
        ]


# 회사 시리얼라이저
class CompanySerializer(serializers.ModelSerializer):
    company_user_set = CompanyUserSerializer(source='company_user_set', many=True, read_only=True)

    class Meta:
        model = Company
        fields = ['id', 'name', 'company_user_set']