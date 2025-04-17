from django.urls import path
from . import views

urlpatterns = [
    path('analyze/', views.get_feedback),    # 분석 요청
]
