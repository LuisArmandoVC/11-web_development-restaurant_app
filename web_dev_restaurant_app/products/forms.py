from django import forms
from django.core.validators import RegexValidator

class RedeemCuponForm(forms.Form):
    cupon_value = forms.CharField(required=True, error_messages={"required": "Por favor, introduce un cupon valido"}, widget=forms.TextInput(
        attrs={'class': 'form__input-JuanSabrosuras', 'placeholder': 'Ingresa tu cupón'}
    ), min_length=5,max_length=15)