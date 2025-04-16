from django.urls import path
from . import views

urlpatterns = [
    # path('', views.AnalysisCreateView.as_view(), name='analysis-create'),    # 분석 요청
    # path('<int:coverletter_pk>/retry/', views.AnalysisRetryView.as_view(), name='analysis-retry'),    # 분석 재요청
]
