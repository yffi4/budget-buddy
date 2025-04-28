from rest_framework import serializers
from .models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = [
            'id', 'type', 'category_of_expense',
            'category_of_income', 'amount', 'date',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'user']

    def validate(self, data):
        if data['type'] == Budget.EXPENSE and not data.get('category_of_expense'):
            raise serializers.ValidationError({
                'category_of_expense': 'This field is required for expense type'
            })
        if data['type'] == Budget.INCOME and not data.get('category_of_income'):
            raise serializers.ValidationError({
                'category_of_income': 'This field is required for income type'
            })
        return data