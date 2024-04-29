from django.shortcuts import render
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.core.serializers import serialize
from django.http import JsonResponse
from django.db.models import Q,F
import json

from .models import dishes
from .forms import RedeemCuponForm

# Create your views here.
def checkout(request):
    form = RedeemCuponForm()
    return render(request, "products/checkout.html", {'form': form})

def confirmation_cash(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            products = data.get('products', [])
            purchase_amount = data.get('purchaseAmount', 0)
            if(products is not None and purchase_amount > 0):
                message = render_to_string('core/mail_body.html', { 'products': products })
                emailMessage = EmailMessage(
                    "Juan sabrosuras: tienes un nuevo contacto",
                    message,
                    "noreply@juansabrosuras.com",
                    ["luisarmandoveliz826@gmail.com"],
                )
                emailMessage.content_subtype = "html"
                try:
                    emailMessage.send()
                except Exception:
                    import traceback
                    traceback.print_exc()

            return render(request, "products/confirmation_cash.html")
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Los datos no están en formato JSON'}, status=400)
    return render(request, "products/confirmation_cash.html")

def catalog(request):
    dishes_products = dishes.objects.all()
    return render(request, "products/catalog.html", {'dishes_products': dishes_products})

def offers(request):
    dishes_products = dishes.objects.filter(
        Q(dish_discounted_price__gt=0) & Q(dish_discounted_price__lt=F('dish_regular_price'))
    )
    return render(request, "products/offers.html", {'dishes_products': dishes_products})

def dish(request, dish_slug):
    dish = dishes.objects.get(dish_slug=dish_slug)
    return render(request, "products/dish.html", {'dish': dish})

def get_serialized_data(request, dish_slug):
    dish = dishes.objects.get(dish_slug=dish_slug)
    serialized_dish = serialize('json', [dish], fields=["dish_name", "dish_description", "dish_discounted_price", "dish_regular_price", "dish_side_1", "dish_side_2", "dish_side_3", "dish_side_4"])
    return JsonResponse({'data': serialized_dish})
