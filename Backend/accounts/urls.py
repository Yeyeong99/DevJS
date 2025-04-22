from django.urls import path
from .views import KakaoLoginView, GoogleLoginView, GithubLoginView, NaverLoginView, UserInfoView, LogoutView, user_info, update_nickname
from rest_framework_simplejwt.views import TokenRefreshView

app_name = 'accounts'

urlpatterns = [
    path("kakao/", KakaoLoginView.as_view(), name="kakao-login"),                # 카카오 로그인
    path("google/", GoogleLoginView.as_view(), name="google-login"),             # 구글 로그인
    path("github/", GithubLoginView.as_view(), name='github-login'),             # 깃허브 로그인
    path('logout/', LogoutView.as_view(), name='logout'),                        # 로그아웃
    path("user/", UserInfoView.as_view(), name="user-info"),                     # 사용자 대쉬보드 확인 관련 >> 유찬 추가한 것으로 바꿔도 되면 바꿔도 될 듯
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),    # 토큰 관련 >> 이거 프론트랑 어떻게 공유하고 있는지 확인 필요함.
    path("nickname/", update_nickname),                                          # 닉네임 요청
]
