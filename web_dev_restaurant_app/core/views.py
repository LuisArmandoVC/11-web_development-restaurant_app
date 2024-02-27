from django.shortcuts import render
from .models import sections, user_review, hero_banner, dishes

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
    return render(request, "core/contact.html")

def menu(request):
    dishes_products = dishes.objects.all()
    return render(request, "core/menu.html", {'dishes_products': dishes_products})
