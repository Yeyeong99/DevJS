import re
from rest_framework.exceptions import ValidationError

def is_invalid_text(text):
    """
    잘못된 입력을 판별하는 통합 검사기
    1. 숫자만
    2. 한글 자음/모음만
    3. 숫자+특수문자만
    4. 한글 없는 영어/숫자/특수문자만
    에 해당하면 True 반환
    """

    # 1. 숫자만
    if text.isdigit():
        return "정상적으로 입력해주세요"

    # 2. 한글 자음/모음만
    if all(('\u3131' <= ch <= '\u314E') or ('\u314F' <= ch <= '\u3163') for ch in text):
        return "정상적으로 입력해주세요"

    # 3. 숫자+특수문자만 (한글, 영어 없는 경우)
    if not re.search(r'[A-Za-z가-힣]', text):
        return "정상적으로 입력해주세요"

    # 4. 영어/숫자/특수문자만 (한글 하나도 없음)
    if not re.search(r'[가-힣]', text):
        return "정상적으로 입력해주세요"

    return None  # 정상 입력

def common_validate(value, field_name):
    error_message = is_invalid_text(value)
    if error_message:
        raise ValidationError(f"{field_name}을(를) {error_message}")