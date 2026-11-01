import { getUsers, updateUser } from "./api.js";

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

    sessionStorage.setItem(
        "loggedInUser",
        newUsername
    );

    document.getElementById("currentUsername").textContent =
        newUsername;

    alert("Username updated successfully.");
});

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

    await updateUser(currentUser.id, {
        ...currentUser,
        password: newPassword
    });

    alert("Password updated successfully.");

    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
});