from django.urls import path
from . import views

urlpatterns = [
    path('total_list/', views.total_list),  # 사용자가 입력한 JD-Keyword, coverletter 등의 정보 저장, 피드백 받은 거 저장하는 API                                                           
    path('<int:company_pk>/', views.detail),    # 회사별 자소서 확인 API
    # path('<int:user_pk>/<int:company_pk>', views.total_detail),       # 특정 사용자-회사 coverletter 조회 url
    # path('<int:user_pk>/<int:company_pk>/<int:coverletter_num>/', views.detail),   # 하나씩 삭제한다면
]