from django.shortcuts import render, redirect
from django.template import TemplateDoesNotExist
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import *

def procurement_view(request:HttpRequest):
    if request.method == 'GET':
        procurements = Procurement.objects.all()
        context = {"procurements":procurements}
        return render(request, 'procurements.html',context=context)

