"""
URL configuration for NotesRecognition project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from .views import *

urlpatterns = [
    path('', inventory_view, name='index'),  # Убедитесь, что путь правильный
    path('del',del_view,name='del'),
    path('edit', edit_view,name='edit'),
    path('item/<int:item_id>/', item_view, name='item_view'),  # Correct pattern
    path('search', search_view, name='search'),
    path('get_qr',get_qr,name='get_qr')
]
