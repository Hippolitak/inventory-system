import { getUsers, updateUser, deleteUser, getProducts, deleteProduct, updatePassword } from "./api.js";

const currentUsername =
    sessionStorage.getItem("loggedInUser");

document.getElementById("currentUsername").textContent =
    currentUsername;

const updateUsernameBtn =
    document.getElementById("updateUsernameBtn");

updateUsernameBtn?.addEventListener("click", async () => {
    const newUsername =
        document.getElementById("newUsername").value.trim();

    if (!newUsername) {
        alert("Please enter a username.");
        return;
    }

    const currentUserId =
        Number(sessionStorage.getItem("loggedInUserId"));

    try {
        const result = await updateUser(currentUserId, {
            Username: newUsername
        });

        if (result.message !== "Username updated successfully.") {
            alert(result.message || "Unable to update username.");
            return;
        }

        sessionStorage.setItem("loggedInUser", newUsername);

        document.getElementById("currentUsername").textContent =
            newUsername;

        alert("Username updated.");

    } catch (error) {
        console.error("Username update failed:", error);
        alert("Unable to update your username.");
    }
});

// AI-assisted password management
const updatePasswordBtn =
    document.getElementById("updatePasswordBtn");

updatePasswordBtn?.addEventListener("click", async () => {

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please complete all password fields.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    if (newPassword.length < 6) {
        alert("Your new password must be at least 6 characters.");
        return;
    }

    const userId = Number(sessionStorage.getItem("loggedInUserId"));

    try {
        const result = await updatePassword(userId, {
            currentPassword,
            newPassword
        });

        if (!result.message || result.message !== "Password updated successfully.") {
            alert(result.message || "Unable to update password.");
            return;
        }

        alert("Password updated successfully.");

        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";

    } catch (error) {
        console.error("Password update failed:", error);
        alert("Unable to update password.");
    }
});

const deleteAccountBtn =
    document.getElementById("deleteAccountBtn");

// Delete Account
deleteAccountBtn?.addEventListener("click", async () => {

    const confirmDelete = prompt(
        "Type DELETE MY ACCOUNT to permanently remove your account and inventory."
    );

    if (confirmDelete !== "DELETE MY ACCOUNT") {
        alert("Account deletion cancelled.");
        return;
    }

    const userId = Number(sessionStorage.getItem("loggedInUserId"));

    if (!userId) {
        alert("User account not found.");
        return;
    }

    try {
        await deleteUser(userId);

        sessionStorage.removeItem("loggedInUser");
        sessionStorage.removeItem("loggedInUserId");

        alert("Account and inventory deleted successfully.");

        window.location.href = "login.html";

    } catch (error) {
        console.error("Account deletion failed:", error);
        alert("Unable to delete account.");
    }
});