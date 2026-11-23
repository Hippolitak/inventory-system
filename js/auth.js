import { createUser, loginUser } from "./api.js";

// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

// AI-assisted authentication logic used to validate credentials against stored user records
        const result = await loginUser({ username, password });
        if (result.UserID) {
            sessionStorage.setItem("loggedInUser", result.Username);
            sessionStorage.setItem("loggedInUserId", result.UserID);
            window.location.href = "dashboard.html";
        } else {
            alert(result.message || "Invalid username or password");
        }
    });
}

// Register
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("regUsername").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        const confirmPassword = document.getElementById("regConfirmPassword").value.trim();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        const newUser = { username, password };
            try {
                const result = await createUser(newUser);

                alert("Account created successfully!");
                window.location.href = "login.html";

            } catch (error) {
                alert(error.message);
                console.error("Registration error:", error);
            }
    });
}