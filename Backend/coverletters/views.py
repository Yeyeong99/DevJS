from django.shortcuts import render

# Create your views here.
# coverletters/views.py

from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import CoverLetter
from .serializers import CoverLetterSerializer

class CoverLetterViewSet(viewsets.ModelViewSet):
    queryset = CoverLetter.objects.all()
    serializer_class = CoverLetterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return CoverLetter.objects.filter(user=self.request.user).order_by('-created_at')
