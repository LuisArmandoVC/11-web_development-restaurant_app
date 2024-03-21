from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.mail import EmailMessage
from .models import sections, user_review, hero_banner
from .forms import ContactForm

# Create your views here.


def home(request):
    review_section_content = sections.objects.get(
        section_name="clientes_felices")
    reviews = user_review.objects.all()
    hero_banner_content = hero_banner.objects.all()
    hero_banner_amount = len(hero_banner_content)
    return render(request, "core/home.html", {'review_section_content': review_section_content, 'reviews': reviews, 'hero_banner_content': hero_banner_content, 'hero_banner_amount': hero_banner_amount})

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
                "Juan sabrosuras: tienes un nuevo contacto",
                f"{name} {last_name} se ha comunicado con nosotros.\n\n Sus datos son:\n Correo electronico: {email} \n Numero telefonico: {phone_number} \n\n Su mensaje fue: {comment}",
                "no-reply@inbox.mailtrap.io",
                ["luisarmandoveliz826@gmail.com"],
                reply_to=[email]
            )
            try:
                emailMessage.send()
            except Exception:
                import traceback
                traceback.print_exc()
                return redirect(reverse('contact')+"?fail")
            return redirect(reverse('contact')+"?ok")

    return render(request, "core/contact.html", {'form': contact_form})
