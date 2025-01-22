from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('', admin_view, name='index'),
    path('get/',get,name='get')
]
