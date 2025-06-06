import { getAllProjectsUrl, deleteProjectUrl} from "./urls.js"
import { validate } from "./log_validation.js"

async function handleProjects() {
    validate();
    fetchProjects();
}

async function fetchProjects() {
    try {
        const response = await fetch(getAllProjectsUrl, {
            method: 'GET',
            headers: {
                'TokenId': sessionStorage.getItem('TokenId')
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        console.error("Error downloading projects:", error);
    }
}

// Wyświetlanie projektów w HTML
function displayProjects(projects) {
    const projectList = document.getElementById("project-list");

    if (!projectList) {
        console.error("No item with ID 'project-list' found");
        return;
    }

    projectList.innerHTML = "";

    projects.forEach(project => {
        const projectItem = document.createElement("div");
        projectItem.classList.add("feature-item");

        projectItem.innerHTML = `
        <h3>${project.name}</h3>
        <p><strong>Description:</strong> ${project.description}</p>
        <p><strong>Status:</strong> ${project.status}</p>
        <p><strong>Created At:</strong> ${new Date(project.createdAt).toLocaleDateString()}</p>
        <p><strong>Start:</strong> ${new Date(project.startDate).toLocaleDateString()}</p>
        <p><strong>End:</strong> ${new Date(project.endDate).toLocaleDateString()}</p>
        <p><strong>Priority:</strong> ${project.priority}</p>
        <div class="buttons">
            <button class="btn secondary edit-btn" data-id="${project.id}">Edit</button>
            <button class="btn secondary delete-btn" data-id="${project.id}">Delete</button>
        </div>
        `;

        projectList.appendChild(projectItem);
    });

    // Obsługa usuwania projektu
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const projectId = parseInt(event.target.getAttribute("data-id"), 10);
            deleteProject(projectId);
        });
    });

    // Obsługa edycji projektu
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const projectId = parseInt(event.target.getAttribute("data-id"), 10);
            editProject(projectId);
        });
    });

    // Dodanie opcji "Dodaj nowy projekt"
    const addNewProject = document.createElement("div");
    addNewProject.classList.add("feature-item");

    addNewProject.innerHTML = `
        <h3>Add new project</h3>
        <p>Fill out the form to add a project.</p>
        <a href="add_projects.html" class="a-button"><button class="btn secondary">Add project</button></a>
    `;

    projectList.appendChild(addNewProject);
}

// Funkcja do usuwania projektu
async function deleteProject(id) {
    try {
        const response = await fetch(deleteProjectUrl.replace("#id", id), {
            method: "GET",
            headers: {
                'TokenId': sessionStorage.getItem('TokenId')
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchProjects(); // Odświeżenie listy projektów po usunięciu
    } catch (error) {
        console.error("Error deleting project:", error);    
    }
}

// Funkcja do edycji projektu
async function editProject(id) {
    window.location.href = `/update_projects.html?id=${id}`;
}

// Pobranie listy projektów po załadowaniu strony
document.addEventListener("DOMContentLoaded", handleProjects);