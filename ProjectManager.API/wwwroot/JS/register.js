import { registerUrl } from "./urls.js";

async function registerUser() {
    const form = document.getElementById("registerForm");

    const name = form.elements["name"].value;
    const email = form.elements["email"].value;
    const password = form.elements["password"].value;
    const confirmPassword = form.elements["confirmPassword"].value;

    const errorMsg = document.getElementById("passwordError");

    if (!password || !confirmPassword || password !== confirmPassword) {
        errorMsg.textContent = "Passwords must not be empty and must match!";
        form.elements["password"].value = "";
        form.elements["confirmPassword"].value = "";
        return;
    } else {
        errorMsg.textContent = "";
    }

    const registerForm = { name, email, password };

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
        form.elements["password"].value = "";
        form.elements["confirmPassword"].value = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("registerButton");

    const confirmPasswordInput = document.getElementById("confirmPassword");
    let errorMsg = document.getElementById("passwordError");
    if (!errorMsg) {
        errorMsg = document.createElement("div");
        errorMsg.id = "passwordError";
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "14px";
        errorMsg.style.marginTop = "4px";
        confirmPasswordInput.parentNode.parentNode.insertBefore(errorMsg, confirmPasswordInput.parentNode.nextSibling);
    }

    button.addEventListener("click", async (event) => {
<<<<<<< HEAD
=======
        console.log();
>>>>>>> fc2f20c2ed9abf091b49f04e48936dfaeac7db5b
        event.preventDefault();
        await registerUser();
    });
});
