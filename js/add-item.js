import { createProduct } from "./api.js";

const addItemForm = document.getElementById("addItemForm");

if (addItemForm) {
    addItemForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("itemName").value.trim();
        const code = document.getElementById("itemCode").value.trim();
        const category = document.getElementById("itemCategory").value;
        const quantity = Number(document.getElementById("itemQuantity").value);
        const price = Number(document.getElementById("itemPrice").value);

        // Determine status from quantity
        const status = quantity === 0
            ? "out-of-stock"
            : quantity < 5
                ? "low-stock"
                : "in-stock";

        const newItem = {
            name,
            code,
            category,
            quantity,
            price,
            status
        };

        try {
            await createProduct(newItem);

            alert("Item added successfully!");
            window.location.href = "items.html";
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Unable to add item. Please try again.");
        }
    });
}
