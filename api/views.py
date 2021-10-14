import datetime

from django.utils import timezone
from rest_framework import generics

from api.models import TypingRecord
from api.serializers import TypingRecordSerializer


class TypingRecordViewSet(generics.ListCreateAPIView):
    """
    API endpoint that allow the typing records to be viewed or edited.
    """
    # return the highest record within the last hour
    queryset = TypingRecord.objects.filter(date__gte=timezone.now()-datetime.timedelta(days=1)).order_by('-speed')[:20]
    serializer_class = TypingRecordSerializer
