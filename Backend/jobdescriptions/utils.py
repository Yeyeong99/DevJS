import requests
import base64
import uuid
import time
import json
import os
from dotenv import load_dotenv
load_dotenv()    # 꼭 실행할 때 Backend에서 할것!

# image_path = './jds/GEg_Xk.jpg'

API_URL = os.getenv('OCR_API_URL')
X_OCR_SECRET = os.getenv('X_OCR_SECRET')

# Naver
def ocr_naver(image_path):

    image_name = ''.join(image_path.split('.')[:-1])

    request_json = {
        'images': [
            {
                'format': image_path.split('.')[-1],
                'name': image_name
            }
        ],
        'requestId': str(uuid.uuid4()),
        'version': 'V2',
        'timestamp': int(round(time.time() * 1000))
    }

    payload = {'message': json.dumps(request_json).encode('utf-8')}

    files = [
        ('file', open(image_path, 'rb'))
    ]

    headers = {
        'X-OCR-SECRET': X_OCR_SECRET
    }

    response = requests.request('POST', API_URL, headers=headers, data=payload, files=files)

    documents = []

    text = ''
    for i in response.json()['images'][0]['fields']:
        text += i['inferText']

        if i['lineBreak']:
            documents.append(text)
            text = ''
            
    return documents


# google
GOOGLE_VISION_API_KEY = os.getenv('GOOGLE_VISION_API_KEY')
GOOGLE_VISION_API_URL = os.getenv('GOOGLE_VISION_API_URL')

# 이미지 파일을 base64로 인코딩하기
def encode_image(image_path):
    with open(image_path, 'rb') as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# google vision API 요청하기
def create_request(image_base64):
    return {
        'requests': [
            {
                'images': {'content': image_base64},
                'features': [
                    {'type': 'DOCUMENT_TEXT_DETECTION'},    # 텍스트 인식 (OCR)
                ],
            }
        ]
    }

# Google Vision API 호출하기
def call_google_vision_api(image_path):
    # 이미지 Base64 변환
    image_base64 = encode_image(image_path)

    # 요청 데이터 생성
    request_data = create_request(image_base64)

    # API 호출
    response = requests.post(GOOGLE_VISION_API_URL, json=request_data)

    # 응답 처리
    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ API 요청 실패! 상태 코드: {response.status_code}")
        print(response.text)
        return None
    
# ✅ Step 4: OCR 결과 저장 및 출력
def save_and_print_ocr_results(ocr_response, output_text_path="full_text.txt", output_json_path="ocr_result.json"):
    if not ocr_response:
        print("❌ OCR 결과가 없습니다.")
        return

    # OCR 결과에서 텍스트 추출
    extracted_text = []
    for annotation in ocr_response["responses"][0].get("textAnnotations", []):
        extracted_text.append(annotation["description"])

    # 전체 텍스트 저장
    full_text = "\n".join(extracted_text)

    # ✅ 결과 출력
    print("\n🔹 Extracted OCR Text:\n")
    print(full_text)

    # # ✅ 텍스트 저장
    # with open(output_text_path, "w", encoding="utf-8") as text_file:
    #     text_file.write(full_text)
    # print(f"\n✅ OCR 텍스트 저장 완료: {output_text_path}")

    # # ✅ JSON 저장 (전체 응답)
    # with open(output_json_path, "w", encoding="utf-8") as json_file:
    #     json.dump(ocr_response, json_file, indent=4, ensure_ascii=False)
    # print(f"✅ OCR 결과 JSON 저장 완료: {output_json_path}")

# # ✅ 실행
# ocr_response = call_google_vision_api(image_path)
# save_and_print_ocr_results(ocr_response)

# JD 역량 추출하기
def extract_skills(content):
    # 줄바꿈으로 jd 자격요건이 작성되었다고 가정
    return content.split('\n')
    