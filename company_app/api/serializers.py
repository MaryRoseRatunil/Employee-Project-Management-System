from rest_framework import serializers
from company_app.models import Department, Employee, Project


class DepartmentSerializer(serializers.ModelSerializer):
    project_count = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['department_id', 'department_name', 'project_count', 'created_at', 'updated_at']
        read_only_fields = ['department_id', 'created_at', 'updated_at']

    def get_project_count(self, obj):
        return obj.projects.count()


class EmployeeSerializer(serializers.ModelSerializer):
    project_count = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ['employee_id', 'name', 'address', 'contact_info', 'project_count', 'created_at', 'updated_at']
        read_only_fields = ['employee_id', 'created_at', 'updated_at']

    def get_project_count(self, obj):
        return obj.projects.count()


class ProjectSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.department_name', read_only=True)
    employee_names = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'project_id', 
            'project_name', 
            'project_date', 
            'department', 
            'department_name',
            'employees',
            'employee_names',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['project_id', 'created_at', 'updated_at']

    def get_employee_names(self, obj):
        return [emp.name for emp in obj.employees.all()]


class ProjectDetailSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    employees = EmployeeSerializer(many=True, read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(
        queryset=Department.objects.all(),
        source='department',
        write_only=True
    )
    employee_ids = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        source='employees',
        many=True,
        write_only=True,
        required=False
    )

    class Meta:
        model = Project
        fields = [
            'project_id',
            'project_name',
            'project_date',
            'department',
            'department_id',
            'employees',
            'employee_ids',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['project_id', 'created_at', 'updated_at']

    def create(self, validated_data):
        employees = validated_data.pop('employees', [])
        project = Project.objects.create(**validated_data)
        if employees:
            project.employees.set(employees)
        return project

    def update(self, instance, validated_data):
        employees = validated_data.pop('employees', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if employees is not None:
            instance.employees.set(employees)
        
        return instance
