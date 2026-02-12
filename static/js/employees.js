const API_URL = '/api/employees/';

document.addEventListener('DOMContentLoaded', function() {
    loadEmployees();
    
    document.getElementById('employeeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createEmployee();
    });
});

function createEmployee() {
    const formData = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        contact_info: document.getElementById('contact_info').value
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        showMessage('Employee added successfully!', 'success');
        document.getElementById('employeeForm').reset();
        loadEmployees();
    })
    .catch(error => {
        showMessage('Error adding employee: ' + error, 'error');
    });
}

function loadEmployees() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayEmployees(data.results || data);
        })
        .catch(error => {
            console.error('Error loading employees:', error);
        });
}

function displayEmployees(employees) {
    const listSection = document.getElementById('employeeList');
    
    if (employees.length === 0) {
        listSection.innerHTML = '<p>No employees found. Add one above!</p>';
        return;
    }

    let html = '<h3>All Employees</h3>';
    employees.forEach(emp => {
        html += `
            <div class="item-card">
                <h4>${emp.name}</h4>
                <p><strong>ID:</strong> ${emp.employee_id}</p>
                <p><strong>Address:</strong> ${emp.address}</p>
                <p><strong>Contact:</strong> ${emp.contact_info}</p>
                <p><strong>Projects:</strong> ${emp.project_count || 0}</p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editEmployee(${emp.employee_id})">Edit</button>
                    <button class="btn-delete" onclick="deleteEmployee(${emp.employee_id})">Delete</button>
                </div>
            </div>
        `;
    });
    
    listSection.innerHTML = html;
}

function editEmployee(id) {
    const newName = prompt('Enter new employee name:');
    if (!newName) return;

    fetch(`${API_URL}${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName })
    })
    .then(response => response.json())
    .then(data => {
        showMessage('Employee updated successfully!', 'success');
        loadEmployees();
    })
    .catch(error => {
        showMessage('Error updating employee: ' + error, 'error');
    });
}

function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    fetch(`${API_URL}${id}/`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            showMessage('Employee deleted successfully!', 'success');
            loadEmployees();
        }
    })
    .catch(error => {
        showMessage('Error deleting employee: ' + error, 'error');
    });
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    setTimeout(() => {
        messageDiv.className = 'message';
    }, 3000);
}
