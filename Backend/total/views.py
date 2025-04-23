from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.contrib.auth import get_user_model
from django.shortcuts import render

from .models import Company, Company_User
from .serializers import UserSerializer, CompanySerializer, CompanyUserSerializer


# Create your views here.
@api_view(['POST'])
def total_list(request):
    if request.method == 'POST':
        try:
            company_name = request.data.get("company")
            if not company_name:
                return Response({"error": "회사 이름이 필요합니다."}, status=400)

            # company name으로 Company 인스턴스 생성 or 조회
            company, _ = Company.objects.get_or_create(name=company_name)

            # request.data에는 여전히 "company": "삼성전자" 문자열이 있으니 제거해야 함
            data = request.data.copy()
            data.pop("company", None)
            data["feedback"] = data.get("feedback", "")
            data["is_reviewed"] = data.get("is_reviewed", "")

            serializer = CompanyUserSerializer(data=data)
            if serializer.is_valid():
                serializer.save(company=company, user=request.user)
                return Response(serializer.data, status=201)
            else:
                print("❗유효성 검사 실패:", serializer.errors)
                return Response(serializer.errors, status=400)

        except Exception as e:
            print("🔥 예외 발생:", e)
            return Response({"error": str(e)}, status=500)


# 분석한 것 추가 저장 함수


# 특정 자소서 삭제 함수

