from django.shortcuts import render
from .models import dishes

# Create your views here.
def catalog(request):
    dishes_products = dishes.objects.all()
    return render(request, "products/catalog.html", {'dishes_products': dishes_products})

def dish(request, dish_slug):
    dish = dishes.objects.get(dish_slug=dish_slug)
    return render(request, "products/dish.html", {'dish': dish})