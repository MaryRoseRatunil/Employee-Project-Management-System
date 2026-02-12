from django.shortcuts import render


def home(request):
    return render(request, 'home.html')


def employees(request):
    return render(request, 'employees.html')


def departments(request):
    return render(request, 'departments.html')


def projects(request):
    return render(request, 'projects.html')
