from django.shortcuts import render, redirect
from django.template import TemplateDoesNotExist
from django.http import HttpRequest, HttpResponse, JsonResponse
from .models import *

from urllib.parse import parse_qs


def inventory_view(request:HttpRequest):
    if request.method == 'GET':
        items = Item.objects.all()
        context = {"items":items}
        return render(request, 'inventory.html',context=context)
    elif request.method == 'POST':
        status = 'ok'
        try:
            itemName = request.POST['itemName']
            itemStatus = request.POST['itemStatus']
        except:
            status = 'Все поля должны быть заполнены'
        return JsonResponse({})