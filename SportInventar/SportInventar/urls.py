"""
URL configuration for SportInventar project.

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
from django.contrib import admin
from django.urls import path, include
from .views import *

urlpatterns = [
    path('django/', admin.site.urls),
    path('admin/',include(('admin.urls','admin'),namespace='adminp')),
    path('', index, name='index'),
    path('user/', include(('user_handler.urls','user_handler'),namespace='user')),
    path('setup/',setup,name='setup'),
    path('inventory/', include(('inventory.urls','inventory'),namespace='inventory')),
    path('requests/', include(('requests.urls', 'requests'), namespace='requests')),
    path('procur/', include(('procurements.urls', 'procurements'), namespace='procurments'))
]
