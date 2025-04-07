import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from django.conf import settings

from .utils import get_or_create_social_user, generate_jwt_for_user

# 카카오
class KakaoLoginView(APIView):
    def post(self, request):
        code = request.data.get("code")
        redirect_uri = "http://localhost:5173/kakao/callback"

        # 1. 카카오 토큰 요청
        token_res = requests.post("https://kauth.kakao.com/oauth/token", data={
            "grant_type": "authorization_code",
            "client_id": settings.KAKAO_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "code": code
        })

        print("🔴 Kakao Token Response:", token_res.text)

        token_data = token_res.json()
        access_token = token_data.get("access_token")

        if not access_token:
            return Response({"error": "Token request failed"}, status=400)

        # 2. 사용자 정보 요청
        user_res = requests.get("https://kapi.kakao.com/v2/user/me", headers={
            "Authorization": f"Bearer {access_token}"
        })
        user_data = user_res.json()

        print("🔵 Kakao User Info:", user_data)

        kakao_id = user_data.get("id")
        email = user_data.get("kakao_account", {}).get("email")

        if not email:
            return Response({"error": "이메일 제공에 동의해야 합니다."}, status=400)

        # # 카카오 설정에서 진짜 이메일 받아오는 거 해야할 듯 -> 유찬 사업자등록..
        # ### 이메일이 없으면 임시 이메일 생성
        # if not email:
        #     email = f"kakao_{kakao_id}@example.com"
        #     print("⚠️ 이메일이 없어 임시 이메일 사용:", email)
        # ###

        user = get_or_create_social_user("kakao", kakao_id, email)
        tokens = generate_jwt_for_user(user)

        return Response(tokens, status=200)


# 구글 로그인 관련
class GoogleLoginView(APIView):
    def post(self, request):
        code = request.data.get("code")
        redirect_uri = "http://localhost:5173/google/callback"

        # 1. 토큰 요청
        token_res = requests.post("https://oauth2.googleapis.com/token", data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        })

        print("🔴 Google Token Response:", token_res.text)

        token_json = token_res.json()
        access_token = token_json.get("access_token")

        # 2. 사용자 정보 요청
        user_res = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", headers={
            "Authorization": f"Bearer {access_token}"
        })
        user_data = user_res.json()

        print("🔵 Google User Info:", user_data)

        google_id = user_data.get('id')
        email = user_data.get("email")

        user = get_or_create_social_user("google", google_id, email)
        tokens = generate_jwt_for_user(user)

        return Response(tokens, status=200)


# 깃허브 로그인 관련
class GithubLoginView(APIView):
    def post(self, request):
        code = request.data.get("code")
        redirect_uri = "http://localhost:5173/github/callback"

        token_res = requests.post("https://github.com/login/oauth/access_token", data={
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": redirect_uri,
        }, headers={"Accept": "application/json"})

        token_data = token_res.json()
        access_token = token_data.get("access_token")

        user_res = requests.get("https://api.github.com/user", headers={
            "Authorization": f"token {access_token}"
        })
        user_data = user_res.json()

        github_id = str(user_data.get("id"))
        email = user_data.get("email") or f"github_{github_id}@example.com"

        user = get_or_create_social_user("github", github_id, email)
        tokens = generate_jwt_for_user(user)

        return Response(tokens)


# 네이버 로그인 관련
class NaverLoginView(APIView):
    def post(self, request):
        code = request.data.get("code")
        state = request.data.get("state")
        redirect_uri = "http://localhost:5173/naver/callback"

        # 1. 토큰 요청
        token_res = requests.post("https://nid.naver.com/oauth2.0/token", params={
            "grant_type": "authorization_code",
            "client_id": settings.NAVER_CLIENT_ID,
            "client_secret": settings.NAVER_CLIENT_SECRET,
            "code": code,
            "state": state,
            "redirect_uri": redirect_uri
        })

        token_json = token_res.json()
        access_token = token_json.get("access_token")

        # 2. 사용자 정보 요청
        user_res = requests.get("https://openapi.naver.com/v1/nid/me", headers={
            "Authorization": f"Bearer {access_token}"
        })
        user_data = user_res.json()
        profile = user_data.get("response", {})

        naver_id = profile.get("id")
        email = profile.get("email") or f"naver_{naver_id}@example.com"

        user = get_or_create_social_user("naver", naver_id, email)
        tokens = generate_jwt_for_user(user)

        return Response(tokens)


# 로그인된 유저 정보
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]  # JWT 인증 필요

    def get(self, request):
        user = request.user  # 인증된 사용자 객체
        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "provider": user.provider,
        })
        
        
# 로그아웃
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': '로그아웃 완료'}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)