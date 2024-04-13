from django.urls import path
from . import views

urlpatterns = [
    path('', views.catalog, name="catalog"),
    path('<slug:dish_slug>/', views.dish, name="dish"),
]    

