from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.db.utils import IntegrityError
from django.contrib.auth.decorators import login_required
from .models import *
from django.contrib.auth import login as log_in
from django.contrib.auth import logout as log_out
from inventory.models import Item
import json


def check_auth(request):
    if request.user.is_authenticated:
        return 1    #HttpResponse("Пользователь авторизован", status=200)
    else:
        return 0    #redirect('user:login')


def index(request:HttpRequest)->HttpResponse:
    return redirect('user:profile')


def getSettings():
    settings = json.loads(open('./settings.json','r'))
    return settings


@login_required
def profile(request:HttpRequest)->HttpResponse:
    user = request.user
    id = request.GET.get("id")
    if id:
        try:
            user = User.objects.get(id=id)
        except:
            pass
    items = Item.objects.filter(current_holder = user)
    context = {"items": items,'show_user':user}
    return render(request,'user/profile.html', context=context)


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
        fn=request.POST.get('first')
        ln=request.POST.get('last')
        
        if fn == None or fn == '':
            return JsonResponse({"status":"Имя должно быть заполнено"})
        if ln == None or ln == '':
            return JsonResponse({"status":"Фамилия должна быть заполнена"})

        if p != rp:
            return JsonResponse({'error':'Passwords do not match'})
        if len(u) < 3:
            return JsonResponse({'error':'Username is too short'})
        if len(p) < 8:
            return JsonResponse({'error':'Password is too short'})
        try:
            User(username=u, password=p,email='',first_name=fn,last_name=ln).save()
            user = User.objects.get(username=u)
            log_in(request,user)
            return JsonResponse({'status':'ok'})
        except IntegrityError:
            return JsonResponse({'error':'Username already exists'})
        except:
            return JsonResponse({'error':'Username creation failed'})


def logout(request:HttpRequest)->HttpResponse:
    if request.user.is_authenticated:
        log_out(request)
    return redirect('user:login')


def search(reqest:HttpRequest)->JsonResponse:
    if reqest.user.is_authenticated:
        if reqest.user.is_staff:
            print(reqest.GET)
            query = reqest.GET.get('query')
            if query == None or query == '':
                return JsonResponse({"status":"query is not provided"})
            print(query)
            print(query[0])
            users = User.objects.filter(username__icontains=query).all()
            usersList = []
            for user in users:
                usr = {}
                usr['username'] = user.username
                usr['first_name'] = user.first_name
                usr['last_name'] = user.last_name
                usersList.append(usr)
            return JsonResponse({"users":usersList})
            
        else:
            return JsonResponse({"status":"not enough previliges"})
    else:
        return JsonResponse({"status":"not logged in"})