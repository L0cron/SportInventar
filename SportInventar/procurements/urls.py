from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('',procurements_view, name='index'),
    path('del',del_view,name='del'),
    path('edit', edit_view,name='edit'),
    path('item/<int:item_id>/', item_view, name='item_view'),
    path('buy/<str:search>', parce_view, name='parce_view'),
]
