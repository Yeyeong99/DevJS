from django.shortcuts import render
import os
import faiss
import pickle
import torch
import numpy as np
from django.shortcuts import render
from transformers import AutoTokenizer, AutoModel
from groq import Groq
from .forms import SelfIntroForm
import jsonlines

file_path = os.path.join("ragapp", "rag", "faiss", "rag_data.jsonl")
data = []

with jsonlines.open(file_path) as reader:
    for obj in reader:
        data.append(obj)

texts = [item["text"] for item in data]

# 모델과 인덱스는 한 번만 로드
tokenizer = AutoTokenizer.from_pretrained("BM-K/KoSimCSE-roberta")
model = AutoModel.from_pretrained("BM-K/KoSimCSE-roberta")

index_path = os.path.join("ragapp", "rag", "faiss", "faiss.index")
metadata_path = os.path.join("ragapp", "rag", "faiss", "metadata.pkl")

index = faiss.read_index(index_path)
with open(metadata_path, "rb") as f:
    metadatas = pickle.load(f)

# GROQ API
client = Groq(api_key="")
MODEL_NAME = "gemma2-9b-it"

# 벡터화 함수
def encode(text):
    inputs = tokenizer([text], return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        cls_embedding = outputs.last_hidden_state[:, 0, :]
    return cls_embedding.squeeze().cpu().numpy()

# 메인 뷰
def get_feedback(request):
    if request.method == "POST":
        form = SelfIntroForm(request.POST)
        if form.is_valid():
            user_intro = form.cleaned_data["self_intro"]
            jd_highlight = form.cleaned_data["jd_highlight"]

            # 벡터 검색
            query_embedding = encode(user_intro)
            D, I = index.search(np.array([query_embedding]), k=3)
            retrieved_contexts = [
                {
                    "text": texts[i],
                    "metadata": metadatas[i]
                }
                for i in I[0]
            ]

            # 프롬프트 구성
            contexts = "\n\n".join([
                f"- {c['text']}\n피드백: {c['metadata']['Feedback']}"
                for c in retrieved_contexts
            ])

            prompt = f"""
            JD 키워드: {jd_highlight}
            유사 자소서 및 피드백:
            {contexts}

            사용자의 자기소개서: {user_intro}

            답변 형식:
            1. 자기소개서의 장점과 개선할 점을 구체적으로 설명해주세요.
            2. JD 키워드를 반영하기 위한 구체적인 조언을 제공해주세요.
            3. 최종적으로 수정된 자기소개서의 예시를 제공해주세요.
            """

            # Groq API 호출
            response = client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": "당신은 IT 분야로 진로를 정한 취업준비생들의 자기소개서를 첨삭해주는 IT 전문 컨설턴트입니다. 반드시 한국어로만 답변하세요."},
                    {"role": "user", "content": prompt}
                ]
            )
            feedback = response.choices[0].message.content

            return render(request, "ragapp/result.html", {
                "form": form,
                "original_intro": user_intro,
                "feedback": feedback
            })

    else:
        form = SelfIntroForm()

    return render(request, "ragapp/index.html", {"form": form})
