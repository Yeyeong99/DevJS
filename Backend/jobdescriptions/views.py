# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.exceptions import ValidationError
from .models import JobDescription, Skill
from .serializers import JobDescriptionSerializer
from .utils import extract_skills, ocr_naver

# 디버깅
import logging
logger = logging.getLogger(__name__)


# 파일 업로드, OCR 처리, JD 조회용 viewset 클래스
class JobDescriptionViewSet(viewsets.ModelViewSet):
    queryset = JobDescription.objects.all()
    serializer_class = JobDescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        jd = serializer.save(user=self.request.user)    # jd에 사용자 넣어서 저장하기
        
        # 파일 받는 경우, 아닌 경우 나누기
        if jd.file and jd.file.name:    # 파일이 있다면,
            
            try:
                ocr_text = ocr_naver(jd.file.path)    # utils.py에서 함수 받아서 ocr text 받기
                jd.content = ocr_text    # 원문 받기
            
            except Exception as e:
                raise ValidationError('OCR 실패')
                
        else:
            ocr_text = jd.content    # 파일 없으면 원래 content 그래도 받기
            
        jd.save()    # 다시 저장
            
        main_skills = extract_skills(ocr_text)    # utils.py에서 함수 받아서 주요 역량 추출하기
        for main_skill in main_skills:
            skill = Skill(jd=jd, content=main_skill)
            skill.save()
    

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user).order_by('-created_at')


