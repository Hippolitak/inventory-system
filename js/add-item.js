import { createProduct } from "./api.js";

const addItemForm = document.getElementById("addItemForm");

if (addItemForm) {
    addItemForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("itemName").value.trim();
        const code = document.getElementById("itemCode").value.trim();
        const category = document.getElementById("itemCategory").value.trim();
        const quantity = Number(document.getElementById("itemQuantity").value);
        const price = Number(document.getElementById("itemPrice").value);

        const newItem = {
            name,
            code,
            category,
            quantity,
            price
        };

        await createProduct(newItem);

        alert("Item added successfully!");
        window.location.href = "items.html";
    });
}
