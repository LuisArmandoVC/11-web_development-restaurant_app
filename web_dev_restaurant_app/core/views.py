from django.shortcuts import render, HttpResponse
from .models import sections, user_review

# Create your views here.


def home(request):
    review_section_content = sections.objects.get(
        section_name="clientes_felices")
    reviews = user_review.objects.all()
    return render(request, "core/home.html", {'review_section_content': review_section_content, 'reviews': reviews})


def about(request):
    return render(request, "core/about.html")
