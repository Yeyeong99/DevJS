# coverletters/views.py
from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import CoverLetter, CoverLetterItem
from .serializers import CoverLetterSerializer, CoverLetterItemSerializer

class CoverLetterViewSet(viewsets.ModelViewSet):
    queryset = CoverLetter.objects.all()
    serializer_class = CoverLetterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return CoverLetter.objects.filter(user=self.request.user).order_by('-created_at')

class CoverLetterItemViewSet(viewsets.ModelViewSet):
    serializer_class = CoverLetterItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CoverLetterItem.objects.filter(
            cover_letter_id=self.kwargs["coverletter_pk"],
            cover_letter__user=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(cover_letter_id=self.kwargs["coverletter_pk"])