import { getUsers, updateUser, deleteUser, getProducts, deleteProduct } from "./api.js";

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

    const users = await getUsers();

    const currentUser = users.find(
        user => user.username === currentUsername
    );

    if (!currentUser) {
        alert("Current user not found.");
        return;
    }

    await updateUser(currentUser.id, {
        ...currentUser,
        username: newUsername
    });

    // Updates the active user session
    sessionStorage.setItem(
        "loggedInUser",
        newUsername
    );

    document.getElementById("currentUsername").textContent =
        newUsername;

    alert("Username updated successfully.");
});

// AI-assisted password management
const updatePasswordBtn =
    document.getElementById("updatePasswordBtn");

updatePasswordBtn?.addEventListener("click", async () => {

    const currentPassword =
        document.getElementById("currentPassword").value.trim();

    const newPassword =
        document.getElementById("newPassword").value.trim();

    const confirmPassword =
        document.getElementById("confirmPassword").value.trim();

    const users = await getUsers();

    const currentUser = users.find(
        user =>
            user.username === sessionStorage.getItem("loggedInUser")
    );

    if (!currentUser) {
        alert("User not found.");
        return;
    }

    if (currentUser.password !== currentPassword) {
        alert("Current password is incorrect.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    if (!newPassword) {
        alert("Please enter a new password.");
        return;
    }
    // Updates the account password in MockAPI
    await updateUser(currentUser.id, {
        ...currentUser,
        password: newPassword
    });

    alert("Password updated successfully.");

    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
});

const deleteAccountBtn =
    document.getElementById("deleteAccountBtn");

    // Delete Account
deleteAccountBtn?.addEventListener("click", async () => {
    // Additional validation 
    const confirmDelete = prompt(
        "Type DELETE MY ACCOUNT to permanently remove your account and inventory."
    );

    if (confirmDelete !== "DELETE MY ACCOUNT") {
        alert("Account deletion cancelled.");
        return;
    }

    const users = await getUsers();

    const currentUser = users.find(
        user =>
            user.username ===
            sessionStorage.getItem("loggedInUser")
    );
    

    if (!currentUser) {
        alert("User not found.");
        return;
    }

    await deleteUser(currentUser.id);

    sessionStorage.removeItem("loggedInUser");

    alert("Account deleted successfully.");

    window.location.href = "login.html";
});