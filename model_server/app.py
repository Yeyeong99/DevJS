from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F

app = FastAPI()

# 모델 로딩
model_name = 'BM-K/KoSimCSE-roberta'
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)
model.eval()    # 평가

# 입력 스키마
class InputText(BaseModel):
    text1: str    # 자기소개서 문장
    text2: str    # JD 문장
    
# 임베딩 추출 함수
def get_sentence_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    with torch.no_grad():
        model_output = model(**inputs)
        
    return model_output.last_hidden_state[:, 0]  # [CLS] 토큰 임베딩

# API : 문장 유사도 계산    
@app.post('/similarity')
def similarity(data: InputText):
    emb1 = get_sentence_embedding(data.text1)
    emb2 = get_sentence_embedding(data.text2)
    
    # 코사인 유사도 계산
    cosine_sim = F.cosine_similarity(emb1, emb2).item()
    
    context = {
        'similarity_score':round(cosine_sim, 4),
        'text1':data.text1,
        'text2':data.text2,
    }
    return context


