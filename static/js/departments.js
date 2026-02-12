const API_URL = '/api/departments/';

document.addEventListener('DOMContentLoaded', function() {
    loadDepartments();
    
    document.getElementById('departmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createDepartment();
    });
});

function createDepartment() {
    const formData = {
        department_name: document.getElementById('department_name').value
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
        showMessage('Department created successfully!', 'success');
        document.getElementById('departmentForm').reset();
        loadDepartments();
    })
    .catch(error => {
        showMessage('Error creating department: ' + error, 'error');
    });
}

function loadDepartments() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayDepartments(data.results || data);
        })
        .catch(error => {
            console.error('Error loading departments:', error);
        });
}

function displayDepartments(departments) {
    const listSection = document.getElementById('departmentList');
    
    if (departments.length === 0) {
        listSection.innerHTML = '<p>No departments found. Create one above!</p>';
        return;
    }

    let html = '<h3>All Departments</h3>';
    departments.forEach(dept => {
        html += `
            <div class="item-card">
                <h4>${dept.department_name}</h4>
                <p><strong>ID:</strong> ${dept.department_id}</p>
                <p><strong>Projects:</strong> ${dept.project_count || 0}</p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editDepartment(${dept.department_id})">Edit</button>
                    <button class="btn-delete" onclick="deleteDepartment(${dept.department_id})">Delete</button>
                </div>
            </div>
        `;
    });
    
    listSection.innerHTML = html;
}

function editDepartment(id) {
    const newName = prompt('Enter new department name:');
    if (!newName) return;

    fetch(`${API_URL}${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ department_name: newName })
    })
    .then(response => response.json())
    .then(data => {
        showMessage('Department updated successfully!', 'success');
        loadDepartments();
    })
    .catch(error => {
        showMessage('Error updating department: ' + error, 'error');
    });
}

function deleteDepartment(id) {
    if (!confirm('Are you sure you want to delete this department?')) return;

    fetch(`${API_URL}${id}/`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            showMessage('Department deleted successfully!', 'success');
            loadDepartments();
        }
    })
    .catch(error => {
        showMessage('Error deleting department: ' + error, 'error');
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
