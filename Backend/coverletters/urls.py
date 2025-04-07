from rest_framework.routers import DefaultRouter
from .views import CoverLetterViewSet

router = DefaultRouter()
router.register(r'coverletters', CoverLetterViewSet, basename='coverletter')

urlpatterns = router.urls