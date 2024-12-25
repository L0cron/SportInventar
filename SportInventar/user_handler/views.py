from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse
from django.contrib.auth.decorators import login_required
from .forms import ItemInstanceForm


def check_auth(request):
    if request.user.is_authenticated:
        return 1#HttpResponse("Пользователь авторизован", status=200)
    else:
        return 0#redirect('user:login') 

def index(request:HttpRequest)->HttpResponse:
    return redirect('user:profile')
    """if check_auth(request):
        return redirect('user:profile')
    else:
        return redirect('user:login')"""

@login_required
def profile(request:HttpRequest)->HttpResponse:
    return render(request,'profile.html')

def login(request:HttpRequest)->HttpResponse:
    return render(request,'login.html')

def register(request:HttpRequest)->HttpResponse:
    return render(request,'register.html')

def recieve_register(request):
    if request.method == 'POST':
        login = request.POST.get('login')
        register = request.POST.get('register')
        # Обработка данных
        
    return render(request, 'profile.html')

def my_view(request):
    if request.method == 'POST':
        form = ItemInstanceForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('user:register')  # перенаправление на страницу успеха
    else:
        form = ItemInstanceForm()
    return render(request, 'user:login', {'form': form})