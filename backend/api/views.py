from openai import OpenAI
from django.db.models import Sum
from django.http import JsonResponse
from django.shortcuts import render
from django.template.context_processors import request
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from api.models import Budget
from api.serializers import BudgetSerializer


# Create your views here.



@api_view(['POST'])
def chat_with_openai(request):
    user_input = request.data.get('userInput')
    expenses = request.data.get('expenses', [])

    if not user_input:
        return Response({'error': 'No input provided'}, status=400)

    prompt = f"""
У тебя есть список расходов: {expenses}.
Дай советы, как можно оптимизировать траты.
Пользователь спрашивает: "{user_input}"
Ответь дружелюбно и понятно.
"""

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # или gpt-3.5-turbo, если хочешь дешевле
            messages=[
                {"role": "system", "content": "Ты помощник по финансовой экономии."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
        )
        answer = response.choices[0].message.content
        return Response({'answer': answer})
    except Exception as e:
        return Response({'error': str(e)}, status=500)



from rest_framework import generics, permissions
from .models import Budget
from .serializers import BudgetSerializer
from rest_framework.response import Response

class BudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetDeleteView(generics.DestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)




