# 클라이언트가 cover_letter_id, job_description_id를 보내면
# serializer가 해당 객체를 가져와서 Analysis 인스턴스 생성

from rest_framework import serializers

from .models import Analysis
from coverletters.models import CoverLetter
from jobdescriptions.models import JobDescription


class AnalysisSerializer(serializers.ModelSerializer):
    # 클라이언트는 ID를 보낸다.
    cover_letter_id = serializers.PrimaryKeyRelatedField(
        queryset=CoverLetter.objects.all(),
        source='cover_letter',
        write_only=True
    )
    job_description_id = serializers.PrimaryKeyRelatedField(
        queryset=JobDescription.objects.all(),
        source='job_description',
        write_only=True
    )
    
    class Meta:
        model = Analysis
        fields = ('id', 'cover_letter_id', 'job_description_id', 'status', 'requested_at', 'completed_at', )
        read_only_fields = ('id', 'status', 'requested_at', 'completed_at', )