from rest_framework import serializers
from .models import JobDescription, Skill

# json 형식으로 데이터 변환을 위한 직렬화 클래스
# read_only_fields : 클라이언트가 보낼 수 없고, "조회(응답)"만 가능하게 만들겠다!
class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'
        read_only_fields = ('id', 'jd', 'content', )   # 완전 조회용으로 만들었음.


class JobDescriptionSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)    # 하나의 jd에 해당하는 skill이 여러 개 있을 수 있기 때문에, many=True 설정
    
    class Meta:
        model = JobDescription
        fields = '__all__'
        read_only_fields = ('user', 'content', 'skills', )    # 