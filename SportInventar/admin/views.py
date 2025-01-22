from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
# Create your views here.


@login_required
def admin_view(request:HttpRequest)->HttpResponse:
    if request.user.is_staff:
        return render(request,'admin/general.html')
    return redirect('user:profile')

@login_required
def get(request:HttpRequest)->JsonResponse:
    if request.user.is_staff:
        return JsonResponse({'status':True})
        
    return JsonResponse({'status':"403 Forbidden"})