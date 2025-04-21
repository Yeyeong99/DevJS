from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.contrib.auth import get_user_model
from django.shortcuts import render

from .models import Company, Company_User
from .serializers import UserSerializer, CompanySerializer, CompanyUserSerializer


# Create your views here.

# 업로드에서 추가할 때
@api_view(['POST'])
def total_list(request):
    if request == 'POST':
        serializer = CompanyUserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
