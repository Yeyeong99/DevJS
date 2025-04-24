from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Company, Company_User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'nickname']


# 중개 테이블 시리얼라이저
class CompanyUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Company_User
        fields = '__all__'
        read_only_fields = ('id', 'company', 'user', )
        # extra_kwargs = {
        #     'company': {'read_only': True},  # serializer에선 직접 받지 않고, views.py에서 넘겨줌
        #     'user': {'read_only': True},
        # }        
        # fields = [
        #     'id',
        #     'company',
        #     'user',
        #     'keywords',
        #     'deadline',
        #     'position',
        #     'question',
        #     'answer',
        #     'feedback',
        #     'is_reviewed'
        # ]
        
class CompanyUserDashboardSerializer(serializers.ModelSerializer):
    
    user = UserSerializer(read_only=True)
   
    class Meta:
        model = Company_User
        fields = ('id', 'question', 'coverletter', 'new_coverletter', )    # id, 질문, 원본 자소서, 피드백 자소서 전달할 수 있도록 만들었음.

# 회사 시리얼라이저
class CompanySerializer(serializers.ModelSerializer):
    company_user_set = CompanyUserSerializer(source='company_user_set', many=True, read_only=True)

    class Meta:
        model = Company
        fields = ['id', 'name', 'company_user_set']