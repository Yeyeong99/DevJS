import os
import faiss
import pickle
import torch
import numpy as np
import jsonlines
from dotenv import load_dotenv
load_dotenv()

from groq import Groq
from transformers import AutoTokenizer, AutoModel


file_path = os.path.join("analyzes", "rag", "faiss", "rag_data.jsonl")    
data = []

with jsonlines.open(file_path) as reader:
    for obj in reader:
        data.append(obj)

texts = [item["text"] for item in data]

# 모델과 인덱스는 한 번만 로드
tokenizer = AutoTokenizer.from_pretrained("BM-K/KoSimCSE-roberta")
model = AutoModel.from_pretrained("BM-K/KoSimCSE-roberta")

index_path = os.path.join("analyzes", "rag", "faiss", "faiss.index")    
metadata_path = os.path.join("analyzes", "rag", "faiss", "metadata.pkl")    

index = faiss.read_index(index_path)
with open(metadata_path, "rb") as f:
    metadatas = pickle.load(f)

# GROQ API
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
client = Groq(api_key=GROQ_API_KEY)    # .env에 넣어서 불러오기 : GROQ_API_KEY
MODEL_NAME = "gemma2-9b-it"

# 벡터화 함수
def encode(text):
    inputs = tokenizer([text], return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        cls_embedding = outputs.last_hidden_state[:, 0, :]
    return cls_embedding.squeeze().cpu().numpy()



# 프롬프트 함수
def build_prompt(coverletter, jd_keywords, retrieved_contexts):
    # 프롬프트 구성
    contexts = "\n\n".join([
        f"- {c['text']}\n피드백: {c['metadata']['Feedback']}"
        for c in retrieved_contexts
    ])

    prompt = f"""
    JD 키워드: {jd_keywords}
    유사 자소서 및 피드백:
    {contexts}

    사용자의 자기소개서: {coverletter}

    답변 형식:
    1. 자기소개서의 장점과 개선할 점을 구체적으로 설명해주세요.
    2. JD 키워드를 반영하기 위한 구체적인 조언을 제공해주세요.
    3. 최종적으로 수정된 자기소개서의 예시를 제공해주세요.
    """
    return prompt


def get_llm_response(prompt):
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[
            {"role": "system", "content": "당신은 IT 분야로 진로를 정한 취업준비생들의 자기소개서를 첨삭해주는 IT 전문 컨설턴트입니다. 반드시 한국어로만 답변하세요."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content