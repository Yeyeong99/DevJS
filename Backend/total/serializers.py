from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from django.contrib.auth import get_user_model
from .models import Company, Company_User
from django.utils import timezone
from .utils import is_invalid_text



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'nickname']


# 중개 테이블 시리얼라이저
class CompanyUserSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model = Company_User
        fields = '__all__'
        read_only_fields = ('id', 'company', 'user', )
    
    def common_validate(self, value, field_name):
        error_message = is_invalid_text(value)
        if error_message:
            raise serializers.ValidationError(f"{field_name}을(를) {error_message}")



    def validate_keywords(self, value):
        self.common_validate(value, "강조하고 싶은 키워드")
        return value
    
    # 회사명은 어떻게 검증하지...
    
    def validate_position(self, value):
        self.common_validate(value, "지원하는 직무명")
        return value

    def validate_question(self, value):
        self.common_validate(value, "자기소개서 질문")
        return value

    def validate_answer(self, value):
        self.common_validate(value, "자기소개서 답변")
        return value

    def validate_deadline(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("마감일은 오늘 이후 날짜여야 합니다.")
        return value


# 회사 시리얼라이저
class CompanySerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        validators=[]  # 기본 unique validator 제거
    )

    class Meta:
        model = Company
        fields = ('id', 'name', )

    def create(self, validated_data):
        company, _ = Company.objects.get_or_create(name=validated_data['name'])
        return company
    
    def common_validate(self, value, field_name):
        error_message = is_invalid_text(value)
        if error_message:
            raise serializers.ValidationError(f"{field_name}을(를) {error_message}")
        
    def validate_name(self, value):
        self.common_validate(value, "회사명")
        return value