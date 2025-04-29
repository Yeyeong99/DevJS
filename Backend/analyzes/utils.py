import os
import faiss
import pickle
import torch
import json
import numpy
import jsonlines
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List

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

# 벡터화 함수 => 키워드 벡터화 시 사용
def encode(text):
    inputs = tokenizer([text], return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        cls_embedding = outputs.last_hidden_state[:, 0, :]
    return cls_embedding.squeeze().cpu().numpy()



# 프롬프트 함수
def build_total_prompt(question, coverletter, jd_keywords, retrieved_contexts):
    # 프롬프트 구성
    contexts = "\n\n".join([
        f"- {c['text']}\n피드백: {c['metadata']['Feedback']}"
        for c in retrieved_contexts
    ])

    total_prompt = f"""
    다음은 사용자의 자기소개서 문항과 자기소개서 답변, 자기소개서 답변에서 강조하고자 하는 키워드입니다.
    참고용 자소서 및 피드백의 내용을 바탕으로 종합 피드백과 수정된 자기소개서 예시를 제공해주세요.

    사용자의 자기소개서 문항:
    {question.strip()}

    사용자의 자기소개서 답변:
    {coverletter.strip()}

    사용자의 주요 키워드:
    {jd_keywords.strip()}

    참고용 자소서 및 피드백(종합 피드백 참고용):
    {contexts.strip()}

    📌 다음 조건을 지켜주세요:
    사용자의 자기소개서에 대해서만 종합 피드백을 작성할 때, 사용자의 주요 키워드가 잘 반영되었는지에 관한 판단과, 잘한 점과 보완해야할 점을 포함해 `feedback`에 작성해주세요.
    이때 종합 피드백의 잘한 점과 보완이 필요한 점은 1. 스토리텔링 측면 2. 문장의 자연스러움과 같은 구체적인 근거를 들어 작성해야합니다.
    `ai_feedback`에는 종합 피드백을 바탕으로 수정된 자기소개서를 작성해주세요. 이때 수정된 자기소개서에 보완을 위한 예시 문장이 포함된다면, 사용자의 자기소개서 답변과 유사한 예시를 들면 안됩니다.
    📌 출력 형식은 다음 스키마를 반드시 따릅니다. ✅
        {{
            'feedback': '...',
            'ai_feedback': '...', 
        }}
    """
    return total_prompt

class TotalFeedback(BaseModel):
    feedback: str
    ai_feedback: str

def get_llm_total_feedback(total_prompt) -> TotalFeedback:
    response = client.chat.completions.create(
        model = MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": "당신은 IT 분야로 진로를 정한 취업준비생들의 자기소개서를 첨삭해주는 전문가입니다.\n 반드시 한국어로만 답변하세요."
                # json 스키마 전달
                f" The JSON object must use the schema: {json.dumps(TotalFeedback.model_json_schema(), indent=2)}",
            },
            {
                "role": "user", 
                "content": total_prompt
            }
        ],
        temperature=0.5,
        stream=False,
        # Json으로 포맷 지정
        response_format={"type": "json_object"},        
    )
    raw_json = json.loads(response.choices[0].message.content)
    return raw_json