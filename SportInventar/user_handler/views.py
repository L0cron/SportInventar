from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from .models import *
from django.contrib.auth import login as log_in
from django.contrib.auth import logout as log_out
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

def auth(request:HttpRequest)->JsonResponse:
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        repeat_password = request.POST.get('rpassword')
        if repeat_password == None:
            if username == None or password == None:
                return JsonResponse({"status":"Все поля должны быть заполнены"})
            
            try:
                user = User.objects.get(username=username)
                passcheck = user.check_password(password)
                if passcheck:
                    log_in(request,user)
                    return JsonResponse({"status":"ok"})
            except:
                pass
            
            return JsonResponse({"status":"Неверное имя пользователя или пароль"})
        else:

            return JsonResponse({"status":"ok"})

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
        
def logout(request:HttpRequest)->HttpResponse:
    if request.user.is_authenticated:
        log_out(request)
    return redirect('user:login')