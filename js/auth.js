// Login
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        const users = await getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            sessionStorage.setItem("loggedInUser", username);
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid username or password");
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
        await createUser(newUser);

        alert("Account created successfully");
        window.location.href = "login.html";
    });
}
