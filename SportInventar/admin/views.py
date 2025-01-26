from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
import json
# Create your views here.
from user_handler.models import *
from django.db.models import Case, When, IntegerField

@login_required
def admin_view(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/general.html')
    return redirect('user:profile')

@login_required
def admin_view_i(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/inventory.html')
    return redirect('user:profile')

@login_required
def admin_view_p(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/procurs.html')
    return redirect('user:profile')

@login_required
def admin_view_r(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/requests.html')
    return redirect('user:profile')

@login_required
def admin_view_u(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:

        users = User.objects.all().order_by(Case(
            When(status = 0, then=0),
            default=1,
            output_field=IntegerField()
        ))

        return render(request,'admin/users.html',context={"users":users})
    return redirect('user:profile')

@login_required
def get(request:HttpRequest)->JsonResponse:
    if not request.user.is_staff:
        return JsonResponse({'status':"Invalid user"})
    
    settings = json.load(open('./settings.json','r'))
    return JsonResponse({"settings":settings})

@login_required
def setview(request:HttpRequest)->JsonResponse:
    if not request.user.is_staff:
        return JsonResponse({'status':"Invalid user"})
    
    # Default Settgins
    settings_check = {
        "free_register": True,
        "free_view": True,
        "hide_real_names": True,
        "free_user_inventory_view": False
    }
    
    settings = settings_check.copy()
    for key in request.GET:
        if key in request.GET.dict():
            val = request.GET[key]
            if val == 'false':
                val = False
            elif val == 'true':
                val = True
            settings[key] = val
            
    if settings == '' or settings == None:
        return JsonResponse({'status':"Invalid settings"})
    json.dump(settings,open('./settings.json','w'),indent=4)
    return JsonResponse({'status':"Settings updated successfully"})
