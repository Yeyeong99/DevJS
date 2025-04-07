from django import forms
from .models import CoverLetter
from jobdescriptions.models import JobDescription

class CoverLetterForm(forms.ModelForm):
    class Meta:
        model = CoverLetter
        fields = ['job_description', 'title', 'content']
        widgets = {
            'job_description': forms.Select(attrs={'class': 'form-control'}),
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '자기소개서 제목'}),
            'content': forms.Textarea(attrs={'class': 'form-control', 'placeholder': '자기소개서 내용을 입력하세요...', 'rows': 10}),
        }
        labels = {
            'job_description': '지원할 채용공고',
            'title': '자기소개서 제목',
            'content': '자기소개서 본문',
        }
