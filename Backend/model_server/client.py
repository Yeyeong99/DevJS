import requests

FASTAPI_URL = 'http://localhost:8001/analyze/'

def request_analysis(analysis_id, cover_letter_text, job_description_text):
    data = {
        'analysis_id': analysis_id,
        'cover_letter': cover_letter_text,
        'job_description': job_description_text
    }
    print(data)
    
    try:
        response = requests.post(FASTAPI_URL, json=data)
        response.raise_for_status()
        return response.json()
    
    except requests.exceptions.RequestException as e:
        print(f'[FastAPI 요청 실패] {e}')
        return
