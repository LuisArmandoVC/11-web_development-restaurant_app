from django.shortcuts import render
from django.core.serializers import serialize
from django.http import JsonResponse

from .models import dishes
from .forms import RedeemCuponForm

# Create your views here.
def checkout(request):
    form = RedeemCuponForm()
    return render(request, "products/checkout.html", {'form': form})

def catalog(request):
    dishes_products = dishes.objects.all()
    return render(request, "products/catalog.html", {'dishes_products': dishes_products})

def dish(request, dish_slug):
    dish = dishes.objects.get(dish_slug=dish_slug)
    return render(request, "products/dish.html", {'dish': dish})

def get_serialized_data(request, dish_slug):
    dish = dishes.objects.get(dish_slug=dish_slug)
    serialized_dish = serialize('json', [dish], fields=["dish_name", "dish_description", "dish_discounted_price", "dish_regular_price", "dish_side_1", "dish_side_2", "dish_side_3", "dish_side_4"])
    return JsonResponse({'data': serialized_dish})
