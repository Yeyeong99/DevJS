from django.shortcuts import render

# Create your views here.
# jobdescriptions/views.py
from rest_framework import viewsets, permissions
from .models import JobDescription
from .serializers import JobDescriptionSerializer

class JobDescriptionViewSet(viewsets.ModelViewSet):
    queryset = JobDescription.objects.all()
    serializer_class = JobDescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user)
