from django.urls import path
from . import views

app_name = 'ragapp'
urlpatterns = [
    path('', views.get_feedback, name='get_feedback'),
]
