from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.mail import EmailMessage
from .models import sections, user_review, hero_banner
from products.models import dishes
from .forms import ContactForm, Newsletter

import requests

# Create your views here.


def home(request):
    review_section_content = sections.objects.get(
        section_name="clientes_felices")
    reviews = user_review.objects.all()
    hero_banner_content = hero_banner.objects.all()
    hero_banner_amount = len(hero_banner_content)
    specialDishes = dishes.objects.filter(dish_special = True)
    newsletter_form = Newsletter()
    if request.method == "POST":
        newsletter_form = Newsletter(data=request.POST)
        if newsletter_form.is_valid():
            name = request.POST.get('name', 'el usuario no completo su nombre')
            email = request.POST.get('email', 'el usuario no completo su correo electronico')
           #Sending email and redirecting 
            emailMessage = EmailMessage(
                f"[Juan sabrosuras newsletter] - formulario de suscripcion completado por {name}",
                f"{name} se ha comunicado con nosotros.\n\n Sus datos son:\n Nombre: {name}\n Correo electronico: {email} \n\n esta interesado en nuestra suscripcion",
                "noreply@juansabrosuras.com",
                ["contacto@juansabrosuras.com"]
            )
            try:
                emailMessage.send()
            except Exception:
                import traceback
                traceback.print_exc()
                return redirect(reverse('home')+"?fail")
            return redirect(reverse('home')+"?ok")
    return render(request, "core/home.html", {'review_section_content': review_section_content, 'reviews': reviews, 'hero_banner_content': hero_banner_content, 'hero_banner_amount': hero_banner_amount, 'dishes': specialDishes, 'newsletter_form': newsletter_form})

def about(request):
    return render(request, "core/about.html")

def contact(request):
    contact_form = ContactForm()
    if request.method == "POST":
        contact_form = ContactForm(data=request.POST)
        if contact_form.is_valid():
            name = request.POST.get('name', 'el usuario no completo su nombre')
            last_name = request.POST.get('last_name', 'el usuario no completo su apellido')
            email = request.POST.get('email', 'el usuario no completo su correo electronico')
            phone_number = request.POST.get('phone_number', 'el usuario no completo su numero telefonico')
            comment = request.POST.get('comment', 'el usuario no completo su comentario')
            #Sending email and redirecting 
            emailMessage = EmailMessage(
                f"[Juan sabrosuras] - formulario de contacto completado por {name} {last_name}",
                f"{name} {last_name} se ha comunicado con nosotros.\n\n Sus datos son:\n Correo electronico: {email} \n Numero telefonico: {phone_number} \n\n Su mensaje fue: {comment}",
                "noreply@juansabrosuras.com",
                ["contacto@juansabrosuras.com"]
            )
            try:
                emailMessage.send()
            except Exception:
                import traceback
                traceback.print_exc()
                return redirect(reverse('contact')+"?fail")
            return redirect(reverse('contact')+"?ok")

    return render(request, "core/contact.html", {'form': contact_form})
