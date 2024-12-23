from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse

def requests_view(request):
    return render(request, 'requests.html')