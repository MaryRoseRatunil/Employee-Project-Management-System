from django.db import models


class Department(models.Model):
    """
    Department model - from ERD
    """
    department_id = models.AutoField(primary_key=True)
    department_name = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departments'
        ordering = ['department_name']

    def __str__(self):
        return self.department_name


class Employee(models.Model):
    """
    Employee model - from ERD
    """
    employee_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    address = models.TextField()
    contact_info = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employees'
        ordering = ['name']

    def __str__(self):
        return self.name


class Project(models.Model):
    """
    Project model - from ERD
    Each project belongs to a department and can have multiple employees
    """
    project_id = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=200)
    project_date = models.DateField()
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    employees = models.ManyToManyField(
        Employee,
        related_name='projects',
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'projects'
        ordering = ['-project_date']

    def __str__(self):
        return self.project_name
