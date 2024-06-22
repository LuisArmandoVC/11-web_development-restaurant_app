from django.shortcuts import render,redirect
from django.urls import reverse
from django.core.mail import EmailMessage
from .models import Post
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from core import forms 


# Create your views here.
def blog(request):
    newsletter_form = forms.Newsletter()
    post_per_page = 6
    posts_page = Paginator(Post.objects.all(), post_per_page)
    page_number = request.GET.get('pagina', 1)

    try:
        posts = posts_page.get_page(page_number)
    except PageNotAnInteger:
        posts = posts_page.get_page(1)
    except EmptyPage:
        posts = posts_page.get_page(posts_page.num_pages)

    data = {
        'posts': posts,
        'paginator': posts_page,
        'newsletter_form': newsletter_form
    }
    if request.method == "POST":
        newsletter_form = forms.Newsletter(data=request.POST)
        if newsletter_form.is_valid():
            name = request.POST.get('name', 'el usuario no completo su nombre')
            email = request.POST.get('email', 'el usuario no completo su correo electronico')
            emailMessage = EmailMessage(
                f"[Juan sabrosuras newsletter] - formulario de suscripcion completado por {name}",
                f"{name} se ha comunicado con nosotros.\n\n Sus datos son:\n Nombre: {name}\n Correo electronico: {email} \n\n esta interesado en nuestra suscripcion",
                "noreply@juansabrosuras.com",
                ["contacto@juansabrosuras.com"]
            )
            try:
                emailMessage.send()
            except Exception:
                import traceback
                traceback.print_exc()
                return redirect(reverse('home')+"?fail")
            return redirect(reverse('home')+"?ok")
    return render(request, "blog/blog.html", data)

def post(request, slug):
    newsletter_form = forms.Newsletter()
    post = Post.objects.get(slug=slug)
    latest_posts = Post.objects.all()[:2]
    if request.method == "POST":
        newsletter_form = forms.Newsletter(data=request.POST)
        if newsletter_form.is_valid():
            name = request.POST.get('name', 'el usuario no completo su nombre')
            email = request.POST.get('email', 'el usuario no completo su correo electronico')
            emailMessage = EmailMessage(
                f"[Juan sabrosuras newsletter] - formulario de suscripcion completado por {name}",
                f"{name} se ha comunicado con nosotros.\n\n Sus datos son:\n Nombre: {name}\n Correo electronico: {email} \n\n esta interesado en nuestra suscripcion",
                "noreply@juansabrosuras.com",
                ["contacto@juansabrosuras.com"]
            )
            try:
                emailMessage.send()
            except Exception:
                import traceback
                traceback.print_exc()
                return redirect(reverse('home')+"?fail")
            return redirect(reverse('home')+"?ok")
    return render(request, "blog/post.html", {'post': post, 'latest_posts': latest_posts, 'newsletter_form': newsletter_form})