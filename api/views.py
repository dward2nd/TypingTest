from django.shortcuts import render
from rest_framework import generics, status
from .serializers import TodoSerializer

from .models import Todo


class TodoListView(generics.ListAPIView):
    model = Todo
    serializer_class = TodoSerializer
