from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from django.contrib.auth import get_user_model
from django.shortcuts import render

from .models import Company, Company_User
from .serializers import UserSerializer, CompanyUserSerializer, CompanySerializer

User = get_user_model()


# Create your views here.
@api_view(['POST', 'PUT', 'GET'])
def total_list(request):
    if request.method == 'POST':
        try:
            company_name = request.data.get("company")
            if not company_name:
                return Response({"error": "회사 이름이 필요합니다."}, status=400)

            # company name으로 Company 인스턴스 생성 or 조회
            company, _ = Company.objects.get_or_create(name=company_name)

            # 각 자소서에 번호 붙이기
            len_of_coverletter = Company_User.objects.filter(user=request.user, company=company).count()
            
            # request.data에는 여전히 "company": "삼성전자" 문자열이 있으니 제거해야 함
            data = request.data.copy()
            data.pop("company", None)
            data["feedback"] = data.get("feedback", "")

            serializer = CompanyUserSerializer(data=data)
            if serializer.is_valid():
                serializer.save(company=company, user=request.user, question_number=len_of_coverletter + 1)
                return Response(serializer.data, status=201)
            else:
                print("유효성 검사 실패:", serializer.errors)
                return Response(serializer.errors, status=400)

        except Exception as e:
            print("예외 발생:", e)
            return Response({"error": str(e)}, status=500)
    
    # 피드백 받은 거 저장하는 기능
    elif request.method == 'PUT':
        company_id = request.data.get('company')
        try:
            feedbacks = Company_User.objects.filter(user=request.user, company_id=company_id)
            feedback_need = feedbacks.all().order_by('-created_at')[0]
        except Company_User.DoesNotExist:
            return Response({"error": "자기소개서를 찾을 수 없습니다."}, status=404)

        # feedback 필드만 수정
        feedback_text = request.data.get("feedback")
        if feedback_text is None:
            return Response({"error": "feedback 필드가 필요합니다."}, status=400)

        feedback_need.feedback = feedback_text
        feedback_need.save()

        serializer = CompanyUserSerializer(feedback_need)
        return Response(serializer.data, status=200)
    
    # 대시보드에 넘기는 기능
    elif request.method == 'GET':
        company_users = Company_User.objects.filter(user=request.user).order_by('-id')  # 자신이 작성한 항목만
        serializer = CompanyUserSerializer(company_users, many=True)
        return Response(serializer.data)

# ---------------------------------------------------
# 특정 회사의 자소서 확인 기능
@api_view(['GET'])
def detail(request, company_pk):
    company = Company.objects.get(pk=company_pk)
    user = request.user
    company_user = Company_User.objects.filter(user=user, company=company)
    serializer = CompanyUserSerializer(instance=company_user, many=True)
    return Response(serializer.data)

    
# 특정 자소서 삭제 함수
@api_view(['DELETE'])
def delete(request, total_pk):
    company_user = Company_User.objects.get(pk=total_pk)
    
    if request.method == 'DELETE':
        company_user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# 회사 정보 조회
@api_view(['GET'])
def company_list(request):
    company = Company.objects.all()
    serializer = CompanySerializer(company, many=True)
    return Response(serializer.data)