# filepath: tracker/forms.py
from django import forms
from .models import Entry

class EntryForm(forms.ModelForm):
    class Meta:
        model = Entry
        fields = ['title', 'amount', 'entry_type', 'date', 'category', 'notes']