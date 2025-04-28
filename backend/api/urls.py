from django.urls import path

from api.views import chat_with_openai, BudgetListCreateView, BudgetDeleteView

urlpatterns = [
    path('chat/', chat_with_openai, name="chat"),
    path('budgets/', BudgetListCreateView.as_view(), name="budgets"),
    path('budgets/<int:pk>/', BudgetDeleteView.as_view(), name="budget-delete"),
]