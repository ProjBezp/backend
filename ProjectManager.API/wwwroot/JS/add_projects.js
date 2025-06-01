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

        console.log("Wysyłane dane projektu:", projectData);

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
                alert("Projekt został dodany!");
                document.getElementById("projectForm").reset(); // Resetowanie formularza
                window.location.href = "/projects.html";
            } else {
                alert("Wystąpił błąd. Spróbuj ponownie.");
            }
        } catch (error) {
            console.error("Błąd podczas dodawania projektu:", error);
            alert("Wystąpił błąd. Sprawdź konsolę.");
        }
    });
});
