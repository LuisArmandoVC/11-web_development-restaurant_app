from django.urls import path
from . import views

urlpatterns = [
    path('', views.catalog, name="catalog"),
    path('ofertas/', views.offers, name="offers"),
    path('<slug:dish_slug>/', views.dish, name="dish"),
    path('<slug:dish_slug>/get-data/', views.get_serialized_data, name="get_serialized_data"),
    path('finalizar-compra', views.checkout, name="checkout"),
    path('confirmacion-c', views.confirmation_cash, name="confirmation_cash"),
]    

