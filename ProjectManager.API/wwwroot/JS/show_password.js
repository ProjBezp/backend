document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".toggle-password").forEach(button => {
        button.addEventListener("click", () => {
            const inputId = button.getAttribute("data-target");
            const input = document.getElementById(inputId);

            if (input) {
                const isPassword = input.type === "password";
                input.type = isPassword ? "text" : "password";
                button.classList.toggle("showing", isPassword);
            }
        });
    });
});
