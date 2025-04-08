# jobdescriptions/urls.py
from rest_framework.routers import DefaultRouter
from .views import JobDescriptionViewSet

router = DefaultRouter()
router.register(r'job-descriptions', JobDescriptionViewSet, basename='jobdescription')

urlpatterns = router.urls
