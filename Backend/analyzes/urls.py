from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_feedback),    # 분석 요청 >> pk 넣어야 DB에서 가져와지고 수정이 가능한거겠지...?
]
