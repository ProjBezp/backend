import { addProjectUrl } from "./urls.js"
import { validate } from "./log_validation.js"

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("projectForm").addEventListener("submit", async function (event) {
        await validate();

        event.preventDefault(); // Zapobiega przeładowaniu strony

        // Pobranie wartości z formularza
        const projectData = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            startDate: document.getElementById("startDate").value,
            endDate: document.getElementById("endDate").value,
            status: document.getElementById("status").value,
            priority: document.getElementById("priority").value,
        };

        console.log("Sent project data:", projectData);

        try {
            const response = await fetch(addProjectUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    'TokenId': sessionStorage.getItem('TokenId')
                },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                alert("The project has been added!");
                document.getElementById("projectForm").reset(); // Resetowanie formularza
                window.location.href = "/projects.html";
            } else {
                alert("An error occurred. Please try again!");
            }
        } catch (error) {
            console.error("Error while adding project:", error);
            alert("An error ocured.Please check the console");
        }
    });
});
