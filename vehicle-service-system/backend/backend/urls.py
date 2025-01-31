from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from service import views

router = routers.DefaultRouter()
router.register(r'components', views.ComponentViewSet)
router.register(r'vehicles', views.VehicleViewSet)
router.register(r'issues', views.IssueViewSet)
router.register(r'payments', views.PaymentViewSet, basename='payment') # type: ignore

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # Main API entry point
]