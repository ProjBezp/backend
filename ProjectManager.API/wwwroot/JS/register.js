import { registerUrl, API_URL } from "./urls.js";

async function registerUser() {
    console.log(registerUrl);
    const form = document.getElementById("registerForm");

    const registerForm = {
        name: form.elements["name"].value,
        email: form.elements["email"].value,
        password: form.elements["password"].value
    };

    const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
        body: JSON.stringify(registerForm),
    });

    if (response.ok) {
        alert("User added successfully!");
        window.location.href = "log.html";
    } else {
        const errorText = await response.text();
        alert(`Error while registering: ${errorText}. Please try again.`);
        form.reset();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("registerButton");
    button.addEventListener("click", async (event) => {
        console.log(API_URL);
        event.preventDefault();
        await registerUser();
    });
});