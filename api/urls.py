from django.urls import include, path

from .views import TypingRecordViewSet

urlpatterns = [
    path('scoreboard/', TypingRecordViewSet.as_view()),
    path('api-auth/', include('rest_framework.urls')),
]
