from django.contrib import admin
from .models import Department, Employee, Project


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['department_id', 'department_name', 'created_at']
    search_fields = ['department_name']
    list_filter = ['created_at']


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['employee_id', 'name', 'contact_info', 'created_at']
    search_fields = ['name', 'contact_info']
    list_filter = ['created_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['project_id', 'project_name', 'project_date', 'department', 'created_at']
    search_fields = ['project_name']
    list_filter = ['project_date', 'department', 'created_at']
    filter_horizontal = ['employees']
