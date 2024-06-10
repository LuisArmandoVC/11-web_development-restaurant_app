from django.shortcuts import render
from .models import Legal


# Create your views here.
def legal(request, slug):
    legal_content = Legal.objects.get(slug=slug)
    return render(request, "legal/render_legal.html", {'legal_content': legal_content})