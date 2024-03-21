from django.shortcuts import render
from .models import dishes

# Create your views here.
def catalog(request):
    dishes_products = dishes.objects.all()
    return render(request, "products/catalog.html", {'dishes_products': dishes_products})

# def menu(request):
#     dishes_products = dishes.objects.all()
#     return render(request, "core/menu.html", {'dishes_products': dishes_products})