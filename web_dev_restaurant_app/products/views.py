from django.shortcuts import render
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.core.serializers import serialize
from django.http import JsonResponse
from django.db.models import Q,F
import json
import datetime
from datetime import time
import pytz
import uuid


from .models import dishes, discount_coupon
from .forms import RedeemCuponForm

# Create your views here.
def checkout(request):
    colombia_timezone = pytz.timezone('America/Bogota')
    colombia_time = datetime.datetime.now(colombia_timezone)
    start_working_hour = time(9, 0)  # 9:00 AM
    end_working_hour = time(20, 0)  # 8:00 PM
    if colombia_time.weekday() == 6 or not (start_working_hour <= colombia_time.time() <= end_working_hour):
        working_hours = False
    else:
        working_hours = True
    if request.method == 'POST':
        form = RedeemCuponForm(request.POST)
        if form.is_valid():
            last_whim_items = None
            code = form.cleaned_data['cupon_value']
            try:
                coupon = discount_coupon.objects.get(discount_coupon_code=code, discount_coupon_enablement=True)
                message = f"Descuento aplicado correctamente"
                success = True
                is_get_request = False
            except discount_coupon.DoesNotExist:
                message = "Cupón inválido o inactivo"
                success = False
                is_get_request = False
                coupon = 'does not exists'
        else:
            message = "Formulario no válido."
            success = False
            is_get_request = False
            code = 'Cupón inválido'
            coupon = 'does not exists'
    else:
        form = RedeemCuponForm()
        last_whim_items = dishes.objects.filter(dish_category__exact=3) | dishes.objects.filter(dish_category__exact=4)
        message = ''
        success = None
        is_get_request = True
        code = 'Cupón inválido'
        coupon = 'does not exists'
    return render(request, "products/checkout.html", {'form': form, 'message': message, 'success': success, 'is_get_request': is_get_request, 'code': code, 'coupon': coupon, 'last_whim_items': last_whim_items, 'working_hours': working_hours})

def confirmation_online(request):
    if request.method == 'POST':
        try:
            # Step 1: creating reference
            colombia_timezone = pytz.timezone('America/Bogota')
            colombia_time = datetime.datetime.now(colombia_timezone)
            formatted_time = colombia_time.strftime('%Y_%m_%d-%H-%M-%S')
            unique_id = uuid.uuid4()
            reference = f"{formatted_time}_{unique_id}"
            # Step 2: using public key 
            WOMPI_PUBLIC_KEY = "pub_test_EIhIc63dgvz2lfsuTHPYc2nrvQ1w99yS"
            # Step 3: define integrity
            WOMPI_SECRET_INTEGRITY = "test_integrity_7rD2EF8lMk9jtW8hJHViyzOLNjNf4Vqd"
            # Step 4: Retrieve transaction amount
            data = json.loads(request.body)
            purchase_amount = data.get('purchaseAmount', 0)
            products = data.get('products', [])
            purchaser_info = data.get('purchaserInfo', {})
            # Step 5: Define expiration date
            expiration_date = colombia_time + datetime.timedelta(minutes=15)
            utc_expiration_date = expiration_date.astimezone(pytz.utc)
            formatted_utc_expiration_date = utc_expiration_date.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
            # Step 6: building string to be hash
            secret_hash = reference+str((purchase_amount*100))+"COP"+str(formatted_utc_expiration_date)+WOMPI_SECRET_INTEGRITY
            # Step 7: encrypt secret_hash
            import hashlib
            m = hashlib.sha256()
            m.update(bytes(secret_hash, encoding='utf8'))
            m.digest()
            data = {
                'currency': 'COP',
                'amountInCents': purchase_amount*100,
                'reference': reference, 
                'publicKey': WOMPI_PUBLIC_KEY,
                'expirationTime': formatted_utc_expiration_date, 
                'signature': m.hexdigest(),
            }
            # Step 8: send confirmation email 
            if(products is not None and purchase_amount > 0):
                message = render_to_string('core/mail_body.html', { 'products': products, 'purchase_amount': purchase_amount, 'purchaser_info': purchaser_info })
                emailMessage = EmailMessage(
                    f'Juan sabrosuras: nueva orden de {purchaser_info["fullname"]}',
                    message,
                    "noreply@juansabrosuras.com",
                    ["ordenes@juansabrosuras.com", purchaser_info["email"]],
                )
                emailMessage.content_subtype = "html"
                try:
                    emailMessage.send()
                except Exception:
                    import traceback
                    traceback.print_exc()
        except json.JSONDecodeError:
                    return JsonResponse({'error': 'Los datos no están en formato JSON'}, status=400)
    return JsonResponse({'data': data})

def confirmation_cash(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            products = data.get('products', [])
            print(products)
            purchase_amount = data.get('purchaseAmount', 0)
            purchaser_info = data.get('purchaserInfo', {})
            if(products is not None and purchase_amount > 0):
                message = render_to_string('core/mail_body.html', { 'products': products, 'purchase_amount': purchase_amount, 'purchaser_info': purchaser_info })
                emailMessage = EmailMessage(
                    f'Juan sabrosuras: nueva orden de {purchaser_info["fullname"]}',
                    message,
                    "noreply@juansabrosuras.com",
                    ["ordenes@juansabrosuras.com", purchaser_info["email"]],
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
    serialized_dish = serialize('json', [dish], fields=["dish_name", "dish_description", "dish_discounted_price", "dish_regular_price", "dish_side_1", "dish_side_2", "dish_side_3", "dish_side_4", "dish_image_preview"])
    return JsonResponse({'data': serialized_dish})

def error_transaction(request):
    return render(request, "products/error_transaction.html")
