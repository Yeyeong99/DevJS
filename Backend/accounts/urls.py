from django.urls import path
from .views import KakaoLoginView, GoogleLoginView, GithubLoginView, NaverLoginView, UserInfoView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("auth/kakao/", KakaoLoginView.as_view(), name="kakao-login"),
    path("auth/google/", GoogleLoginView.as_view(), name="google-login"),
    path("auth/github/", GithubLoginView.as_view(), name='github-login'),
    path("auth/naver/", NaverLoginView.as_view(), name="naver-login"),
    
    path("auth/user/", UserInfoView.as_view(), name="user-info"),  
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
