
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render, redirect
import os
def index(request:HttpRequest)->HttpResponse:
    return render(request,'index.html')


def checkInit():
    if os.path.isfile('./SportInven tar/.env'):
        return True
    return False

def setup(request:HttpRequest)->HttpResponse:
    if checkInit():
        return redirect('index')
    return render(request,'setup.html')