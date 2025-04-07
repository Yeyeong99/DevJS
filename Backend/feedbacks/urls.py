from django.urls import path
from . import views

urlpatterns = [
    path('<int:coverletter_id>/', views.FeedbackListView.as_view(), name='feedback-list'),
    path('<int:feedback_id>/apply/', views.ApplyRecommendationView.as_view(), name='apply-recommendation'),
]
