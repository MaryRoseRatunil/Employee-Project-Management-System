from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from company_app.models import Department, Employee, Project
from .serializers import (
    DepartmentSerializer,
    EmployeeSerializer,
    ProjectSerializer,
    ProjectDetailSerializer
)


class DepartmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Department - CRUD operations
    """
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

    @action(detail=True, methods=['get'])
    def projects(self, request, pk=None):
        department = self.get_object()
        projects = department.projects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Employee - CRUD operations
    """
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

    @action(detail=True, methods=['get'])
    def projects(self, request, pk=None):
        employee = self.get_object()
        projects = employee.projects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Project - CRUD operations
    """
    queryset = Project.objects.select_related('department').prefetch_related('employees').all()
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return ProjectDetailSerializer
        return ProjectSerializer

    @action(detail=True, methods=['post'])
    def add_employee(self, request, pk=None):
        project = self.get_object()
        employee_id = request.data.get('employee_id')
        
        if not employee_id:
            return Response(
                {'error': 'employee_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            employee = Employee.objects.get(pk=employee_id)
            project.employees.add(employee)
            serializer = self.get_serializer(project)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def remove_employee(self, request, pk=None):
        project = self.get_object()
        employee_id = request.data.get('employee_id')
        
        if not employee_id:
            return Response(
                {'error': 'employee_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            employee = Employee.objects.get(pk=employee_id)
            project.employees.remove(employee)
            serializer = self.get_serializer(project)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {'error': 'Employee not found'},
                status=status.HTTP_404_NOT_FOUND
            )
