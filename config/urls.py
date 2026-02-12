from django.contrib import admin
from django.urls import path, include
from company_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('company_app.api.urls')),
    path('', views.home, name='home'),
    path('employees/', views.employees, name='employees'),
    path('departments/', views.departments, name='departments'),
    path('projects/', views.projects, name='projects'),
]
