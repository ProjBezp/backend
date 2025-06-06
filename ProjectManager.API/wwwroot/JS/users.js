import { validate } from "./log_validation.js";
import { getAllUsersUrl, deleteUserUrl } from "./urls.js"

async function handleUsers() {
    validate();
    fetchUsers();
}

async function fetchUsers() {
    console.log(sessionStorage.getItem('TokenId'));

    try {
        const response = await fetch(getAllUsersUrl, {
            method: 'GET',
            headers: {
                'TokenId': sessionStorage.getItem('TokenId')
            }
        });
        if (!response.ok) {
            if (response.status == 401) {
                alert("User unauthorized");
                window.location.href = "index.html";
            }
            else
                throw new Error(response.status);
        }
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error while fetching data:', error);
    }
}

function displayUsers(users) {
    const userList = document.getElementById("user-list");

    if (!userList) {
        console.error("Element with ID 'user-list' not found");
        return;
    }

    userList.innerHTML = "";

    users.forEach(user => {
        const userItem = document.createElement("div");
        userItem.classList.add("feature-item");

        userItem.innerHTML = `
        <h3>${user.name}</h3>
        <p>Role: ${user.role}</p>
        <p>Email: ${user.email}</p>
        <div class="buttons">
            <button class="btn secondary edit-btn" data-id="${user.id}">Edit</button>
            <button class="btn secondary delete-btn" data-id="${user.id}">Delete</button>
        </div>
         `;

        userList.appendChild(userItem);
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const userId = parseInt(event.target.getAttribute("data-id"), 10);
            deleteUser(userId);
        });
    });

    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const userId = parseInt(event.target.getAttribute("data-id"), 10);
            editUser(userId);
        });
    });

    const addNewUser = document.createElement("div");
    addNewUser.classList.add("feature-item");

    addNewUser.innerHTML = `
        <h3>Add new user</h3>
        <p>Fill out the form to add a user.</p>
        <a href="users_add.html" class="a-button"><button class="btn secondary">Add user</button></a>
    `;

    userList.appendChild(addNewUser);
}

async function deleteUser(id) {
    try {
        const response = await fetch(deleteUserUrl.replace("#id", id), {
            method: 'GET',
            headers: {
                'TokenId': sessionStorage.getItem('TokenId')
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await fetchUsers();
    } catch (error) {
        console.error('Error while fetching data:', error);
    }
}

async function editUser(id) {
    window.location.href = `/users_update.html?id=${id}`;
}


document.addEventListener('DOMContentLoaded', handleUsers);