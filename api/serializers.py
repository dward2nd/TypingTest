from rest_framework import serializers
from .models import TypingRecord


class TypingRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypingRecord
        fields = ['date', 'speed', 'accuracy']
