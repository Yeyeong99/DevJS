# coverletters/urls.py
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from .views import CoverLetterViewSet, CoverLetterItemViewSet

router = DefaultRouter()
router.register(r'coverletters', CoverLetterViewSet, basename='coverletter')

coverletter_router = NestedDefaultRouter(router, r'coverletters', lookup='coverletter')
coverletter_router.register(r'items', CoverLetterItemViewSet, basename='coverletter-items')

urlpatterns = router.urls + coverletter_router.urls
