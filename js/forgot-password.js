const forgotPasswordForm = document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const message = document.getElementById("message");

    message.textContent = "";

    if (newPassword !== confirmPassword) {
        message.textContent = "Passwords do not match.";
        return;
    }

    if (newPassword.length < 8) {
        message.textContent = "Password must be at least 8 characters.";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                newPassword
            })
        });

        const result = await response.json();

        if (!response.ok) {
            message.textContent = result.message || "Password reset failed.";
            return;
        }

        message.textContent = "Password reset successfully! Redirecting to login...";

        message.style.color = "green";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2500);

    } catch (error) {
        console.error("Password reset error:", error);
        message.textContent = "Unable to connect to the server.";
    }
});     