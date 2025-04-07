from pydantic import BaseModel
from typing import List


class AnalyzeRequest(BaseModel):
    analysis_id: int
    cover_letter: str
    job_description: str
    
    
class FeedbackItem(BaseModel):
    original_sentence: str
    similarity_score: float
    is_weak: bool
    recommendation: str
    reason: str
    
    
class AnalyzeResponse(BaseModel):
    feedbacks: List[FeedbackItem]