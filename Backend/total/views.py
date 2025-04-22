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
    if request == 'POST':
        serializer = CompanyUserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


# 분석한 것 추가 저장 함수


# 특정 자소서 삭제 함수

