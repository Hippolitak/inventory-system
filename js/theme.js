// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

// Theme toggle
const toggleTheme = () => {

    document.body.classList.toggle("dark-mode");

    const mode =
        document.body.classList.contains("dark-mode")
            ? "dark"
            : "light";
    // Stores the selected theme preference for future visits.
    localStorage.setItem("theme", mode);
};

// Theme toggle button
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
}

// Logout workflow
document.addEventListener("DOMContentLoaded", () => {

    const exitBtn = document.querySelector(".exit-btn");

    if (exitBtn) {

        exitBtn.addEventListener("click", (e) => {

            e.preventDefault();

            const confirmLogout =
                confirm("Are you sure you want to log out?");

            if (confirmLogout) {
                sessionStorage.removeItem("loggedInUser");
                window.location.href = "login.html";
            }

        });

    }

});