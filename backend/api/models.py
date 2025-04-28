from django.conf import settings
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from rest_framework.exceptions import ValidationError


class Category(models.TextChoices):
    FOOD = 'food', 'Food'
    HEALTH = 'health', 'Health'
    HOUSING = 'housing', 'Housing'
    ENTERTAINMENT = 'entertainment', 'Entertainment'
    TRANSPORT = 'transport', 'Transport'
    TRAVEL = 'travel', 'Travel'
    OTHER = 'other', 'Other'

class IncomeCategory(models.TextChoices):
    INVESTMENTS = 'investments', 'Investments'
    SALARY = 'salary', 'Salary'
    FREELANCE = 'freelance', 'Freelance'

class Budget(models.Model):
    EXPENSE = 'expense'
    INCOME = 'income'
    TYPE_CHOICES = [
        (EXPENSE, 'Expense'),
        (INCOME, 'Income'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    type = models.CharField(max_length=7, choices=TYPE_CHOICES)
    category_of_expense = models.CharField(
        max_length=20,
        choices=Category.choices,
        null=True,
        blank=True
    )
    category_of_income = models.CharField(
        max_length=20,
        choices=IncomeCategory.choices,
        null=True,
        blank=True
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def clean(self):
        if self.type == self.EXPENSE and not self.category_of_expense:
            raise ValidationError("Category of expense is required for expense type")
        if self.type == self.INCOME and not self.category_of_income:
            raise ValidationError("Category of income is required for income type")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        category = self.category_of_expense if self.type == self.EXPENSE else self.category_of_income
        return f"{self.type.title()} - {category}: ${self.amount}"