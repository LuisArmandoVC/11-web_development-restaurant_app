from django import forms
from django.core.validators import RegexValidator

class ContactForm(forms.Form):
    name = forms.CharField(required=True, error_messages={"required": "Por favor, introduce tu nombre"}, widget=forms.TextInput(
        attrs={'class': 'w-full border border-gray-figma-300 bg-white text-gray-figma-300 rounded py-4 px-2 outline-0'}
    ), min_length=5,max_length=100)
    last_name = forms.CharField(required=True, error_messages={"required": "Por favor, introduce tu apellido"}, widget=forms.TextInput(
        attrs={'class': 'w-full border border-gray-figma-300 bg-white text-gray-figma-300 rounded py-4 px-2 outline-0'}
    ), min_length=5,max_length=100)
    email = forms.EmailField(required=True, error_messages={"required": "Por favor, introduce un correo electronico valido"}, widget=forms.EmailInput(
        attrs={'class': 'w-full border border-gray-figma-300 bg-white text-gray-figma-300 rounded py-4 px-2 outline-0'}
    ), min_length=5,max_length=100)
    phone_number = forms.CharField(required=True, error_messages={"incomplete":"Por favor, introduce un número telefonico válido para Colombia"},validators=[RegexValidator(r"^\d{10}$", "Por favor, introduce un número telefonico válido para Colombia."),], widget=forms.TextInput(
        attrs={'class': 'w-full border border-gray-figma-300 bg-white text-gray-figma-300 rounded py-4 px-2 outline-0'}
    ))
    comment = forms.CharField(required=True,error_messages={"required": "El comentario es necesario para saber la razon de contacto"}, widget=forms.Textarea(
        attrs={'class': 'w-full border border-gray-figma-300 bg-white text-gray-figma-300 rounded py-4 px-2 outline-0', 'rows': '3.5', 'placeholder': 'Escribe tu comentario'}
    ), min_length=10,max_length=1250)
