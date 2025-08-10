# DevJS
Correcting and storing self-introduction letters for job seekers in the IT field.

## 1. Project Overview

### 📌 DevJS (Developer's Job Script) is an AI-based self-introduction correction service for job seekers in the IT field.
- Existing correction services are evaluated only on a set basis, but
- DevJS allows users to directly enter keywords (JD elements, etc.) that they want to emphasize in their cover letter,
- AI evaluates how well the keyword is reflected in the cover letter.
- After that, we provide reference examples and customized recommended sentences to make up for the shortcomings.

> This helps you write a strength-oriented cover letter that is more consistent with job openings.

## 2. Key Functions

### 1) Correct the cover letter
- When the user enters a cover letter and emphasis keyword,
- Search for similar cover letters using the Retrieval-Augmented Generation (RAG) pipeline and reflect them in feedback.
- Evaluation of keyword reflectivity and recommendation of sentences based on RAG DB for insufficient parts
- Provides correction feedback in terms of grammar, context, and readability.

## 3. Differences

| ** Item*** | ** Existing service** | **DevJS** |
| --- | --- | --- |
| Specialized for job seekers in the IT field | Correcting ✖ general-purpose cover letter | Correcting ✅ specialized for the IT field |
| Keyword reflection function | ✖ keyword-based analysis | ✅ JD-based keyword reflection feedback |

## 4. Introduction of team members

| Lee Ye-young | Park Yoo-hyun | Sung Soo-rin | Lee Yoo-chan |
|:--:|:--:|:--:|:--:|
| Team leader, AI | Backend | Backend | Frontend |

## 5. Technology stack

| **Field** | **Stack** |
| --- | --- |
| Frontend | React |
| Backend | Django, Django REST Framework, PostgreSQL |
| AI Pipeline| LLM API (Gemma), RAG (FAISS) |
| Deploy | Docker, AWS (EC2) |
| Version Management | GitHub |
| Schedule Management  | JIRA | 
