const API_URL = '/api/projects/';

document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    
    document.getElementById('projectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        createProject();
    });
});

function createProject() {
    const employeeIdsStr = document.getElementById('employee_ids').value;
    let employee_ids = [];
    
    if (employeeIdsStr.trim()) {
        employee_ids = employeeIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }

    const formData = {
        project_name: document.getElementById('project_name').value,
        project_date: document.getElementById('project_date').value,
        department_id: parseInt(document.getElementById('department_id').value),
        employee_ids: employee_ids
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
        showMessage('Project created successfully!', 'success');
        document.getElementById('projectForm').reset();
        loadProjects();
    })
    .catch(error => {
        showMessage('Error creating project: ' + error, 'error');
    });
}

function loadProjects() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            displayProjects(data.results || data);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
        });
}

function displayProjects(projects) {
    const listSection = document.getElementById('projectList');
    
    if (projects.length === 0) {
        listSection.innerHTML = '<p>No projects found. Create one above!</p>';
        return;
    }

    let html = '<h3>All Projects</h3>';
    projects.forEach(proj => {
        const employeeNames = proj.employee_names ? proj.employee_names.join(', ') : 'None';
        
        html += `
            <div class="item-card">
                <h4>${proj.project_name}</h4>
                <p><strong>ID:</strong> ${proj.project_id}</p>
                <p><strong>Date:</strong> ${proj.project_date}</p>
                <p><strong>Department:</strong> ${proj.department_name || 'N/A'}</p>
                <p><strong>Employees:</strong> ${employeeNames}</p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editProject(${proj.project_id})">Edit</button>
                    <button class="btn-delete" onclick="deleteProject(${proj.project_id})">Delete</button>
                </div>
            </div>
        `;
    });
    
    listSection.innerHTML = html;
}

function editProject(id) {
    const newName = prompt('Enter new project name:');
    if (!newName) return;

    fetch(`${API_URL}${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_name: newName })
    })
    .then(response => response.json())
    .then(data => {
        showMessage('Project updated successfully!', 'success');
        loadProjects();
    })
    .catch(error => {
        showMessage('Error updating project: ' + error, 'error');
    });
}

function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    fetch(`${API_URL}${id}/`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            showMessage('Project deleted successfully!', 'success');
            loadProjects();
        }
    })
    .catch(error => {
        showMessage('Error deleting project: ' + error, 'error');
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
