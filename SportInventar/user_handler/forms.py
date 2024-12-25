from django import forms
from .models import itemInstance

class ItemInstanceForm(forms.ModelForm):
    class Meta:
        model = itemInstance
        fields = ['item', 'owner', 'amount', 'due_back']