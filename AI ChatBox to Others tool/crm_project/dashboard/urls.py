from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('api/proxy/customers/', views.proxy_customers, name='proxy_customers_root'),
    path('api/proxy/customers/<path:subpath>/', views.proxy_customers, name='proxy_customers'),
]