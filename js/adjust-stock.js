import { getProducts, updateProduct } from "./api.js";

const itemSelect = document.getElementById("stockItemSelect");
const adjustForm = document.getElementById("adjustStockForm");

// Load products belonging to the logged-in user
const loadItems = async () => {
    try {
        const currentUserId =
            Number(sessionStorage.getItem("loggedInUserId"));

        const products = (await getProducts()).filter(
            product => Number(product.UserID) === currentUserId
        );

        itemSelect.innerHTML = '<option value="">Select an item</option>';

        products.forEach(item => {
            const option = document.createElement("option");

            option.value = item.ProductID;
            option.textContent = `${item.Name} (${item.Code}) - Current Stock: ${item.Quantity}`;

            itemSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading products:", error);
        alert("Unable to load inventory items.");
    }
};

loadItems();

// Handle stock adjustment
adjustForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const itemId = Number(itemSelect.value);
    const adjustType = document.getElementById("adjustType").value;
    const amount = Number(document.getElementById("adjustAmount").value);

    if (!itemId) {
        alert("Please select an item.");
        return;
    }

    if (!Number.isInteger(amount) || amount <= 0) {
        alert("Please enter a valid positive whole number.");
        return;
    }

    try {
        const currentUserId =
            Number(sessionStorage.getItem("loggedInUserId"));

        const products = await getProducts();

        const item = products.find(
            p => Number(p.ProductID) === itemId &&
                 Number(p.UserID) === currentUserId
        );

        if (!item) {
            alert("Item not found.");
            return;
        }

        let newQuantity = Number(item.Quantity);

        // Increase or decrease stock
        if (adjustType === "increase") {
            newQuantity += amount;
        } else if (adjustType === "decrease") {
            if (amount > newQuantity) {
                alert("You cannot decrease stock below zero.");
                return;
            }

            newQuantity -= amount;
        } else {
            alert("Invalid adjustment type.");
            return;
        }

        // Calculate updated stock status
        const newStatus =
            newQuantity === 0 ? "out-of-stock" :
            newQuantity < 5 ? "low-stock" :
            "in-stock";

        // Update product in SQL Server
        const updatedItem = {
            Name: item.Name,
            Code: item.Code,
            Category: item.Category,
            Quantity: newQuantity,
            Price: Number(item.Price),
            Status: newStatus,
            ImageUrl: item.ImageUrl || ""
        };

        await updateProduct(itemId, updatedItem);

        alert("Stock updated successfully!");

        window.location.href = "items.html";

    } catch (error) {
        console.error("Stock adjustment failed:", error);
        alert("Unable to update stock. Please try again.");
    }
});