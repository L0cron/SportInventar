from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('', admin_view, name='index'),
    path('procurs/', admin_view_p, name='procurs'),
    path('inventory/', admin_view_i,name='inventory'),
    path('requests/', admin_view_r,name='requests'),
    path('users/', admin_view_u,name='users'),
    path('get/',get,name='get'),
    path('set/',setview,name='set')
]
