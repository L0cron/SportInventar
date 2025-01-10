from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from .models import *
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
    return render(request,'user/profile.html')

def login(request:HttpRequest)->HttpResponse:
    if request.user.is_authenticated:
        return redirect('user:profile')
    return render(request,'user/login.html')

def register(request:HttpRequest)->HttpResponse|JsonResponse:
    if request.user.is_authenticated:
        return redirect('user:profile')
    if request.method == 'GET':
        return render(request,'user/register.html')
    elif request.method == 'POST':
        
        u=request.POST.get('username')
        p=request.POST.get('password')
        rp=request.POST.get('rpassword')
        print(len(u))
        if p != rp:
            return JsonResponse({'error':'Passwords do not match'})
        if len(u) < 3:
            return JsonResponse({'error':'Username is too short'})
        if len(p) < 8:
            return JsonResponse({'error':'Password is too short'})
        try:
            User(username=u, password=p,email='').save()
            return JsonResponse({'success':'User created'})
        except:
            return JsonResponse({'error':'Username creation failed'})