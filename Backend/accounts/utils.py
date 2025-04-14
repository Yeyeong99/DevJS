# utils.py
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()    # 현재 활성화된 user 모델 가져오기


def get_or_create_social_user(provider, social_id, email, nickname):
    try:
        user = User.objects.get(provider=provider, social_id=social_id, nickname=nickname)
    except User.DoesNotExist:
        user = User.objects.create_user(
            username=f"{provider}_{social_id}",
            email=email,
            provider=provider,
            social_id=social_id,
            nickname=nickname,
            password=User.objects.make_random_password()
        )
    return user


def generate_jwt_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh)
    }
