from django.shortcuts import render
from django.template import TemplateDoesNotExist

def inventory_view(request):
    return render(request, 'inventory.html')