import { addUserUrl } from "./urls.js";

async function addUser(event) {
    event.preventDefault(); // zapobiegamy przeładowaniu strony

    console.log("add user");
    const form = document.getElementById("addUserForm");
    const user = {
        name: form.elements["name"].value,
        email: form.elements["email"].value,
        password: form.elements["password"].value,
        role: form.elements["role"].value,
        createdAt: new Date(),
    };

    console.log("pre post");

    try {
        const response = await fetch(addUserUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                'TokenId': sessionStorage.getItem('TokenId')
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            alert("User added successfully!");
            form.reset();
            window.location.href = "/users.html";
        } else {
            alert("Error adding user. Please try again.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please check the console for details.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addUserForm").addEventListener("submit", addUser);
});
