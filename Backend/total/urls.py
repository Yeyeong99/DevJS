from django.urls import path
from . import views

urlpatterns = [
    path('total_list/', views.total_list),  # 사용자가 입력한 JD-Keyword, coverletter 등의 정보 저장, 조회 api
    path('total_list/<int:pk>/', views.total_feedback),                                                            
    # path('<int:user_pk>/<int:company_pk>', views.total_detail),       # 특정 사용자-회사 coverletter 조회 url
    # path('<int:user_pk>/<int:company_pk>/<int:coverletter_num>/', views.detail),   # 하나씩 삭제한다면
]
