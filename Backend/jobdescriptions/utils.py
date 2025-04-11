import requests
import uuid
import time
import json
import os
from dotenv import load_dotenv
load_dotenv()    # 꼭 실행할 때 Backend에서 할것!

API_URL = ''
X_OCR_SECRET = os.getenv('X_OCR_SECRET')
image_file = ''

image_name = 'test_name'

request_json = {
    'images': [
        {
            'format': ['jpg', 'png', 'pdf'],
            'name': f'{image_name}'
        }
    ],
    'requestId': str(uuid.uuid4()),
    'version': 'V2',
    'timestamp': int(round(time.time() * 1000))
}

payload = {'message': json.dumps(request_json).encode('utf-8')}

files = [
    ('file', open(image_file, 'rb'))
]

headers = {
    'X-OCR-SECRET': X_OCR_SECRET
}

response = requests.request('POST', API_URL, headers=headers, data=payload, files=files)

for i in response.json()['images'][0]['fields']:
    text = i['inferText']
    print(text)