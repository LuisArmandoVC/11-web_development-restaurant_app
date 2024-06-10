from django.shortcuts import render
from .models import Post
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


# Create your views here.
def blog(request):
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
        'paginator': posts_page
    }

    return render(request, "blog/blog.html", data)

def post(request, slug):
    post = Post.objects.get(slug=slug)
    latest_posts = Post.objects.all()[:2]
    return render(request, "blog/post.html", {'post': post, 'latest_posts': latest_posts})