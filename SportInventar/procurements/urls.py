from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('', procurement_view, name='index'),
    path('del',del_view,name='del'),
    path('edit', edit_view,name='edit'),
    path('item/<int:item_id>/', item_view, name='item_view'),  # Correct pattern
]
