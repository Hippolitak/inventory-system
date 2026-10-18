// Help from Ai Assistance 
import { getProducts, updateProduct } from "./api.js";

// Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");

const editForm = document.getElementById("editItemForm");

// Load item data
const loadItem = async () => {
    const products = await getProducts();
    const item = products.find(p => p.id === itemId);

    if (!item) {
        alert("Item not found");
        window.location.href = "items.html";
        return;
    }

    // Fill form
    document.getElementById("editName").value = item.name;
    document.getElementById("editCode").value = item.code;
    document.getElementById("editCategory").value = item.category;
    document.getElementById("editQuantity").value = item.quantity;
    document.getElementById("editPrice").value = item.price;
};

loadItem();

// Save changes
editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("editName").value.trim();
    const code = document.getElementById("editCode").value.trim();
    const category = document.getElementById("editCategory").value;
    const quantity = Number(document.getElementById("editQuantity").value);
    const price = Number(document.getElementById("editPrice").value);

    const imageFile = document.getElementById("editImage").files[0];

    let updatedData = {
        name,
        code,
        category,
        quantity,
        price,
        status: quantity === 0 ? "out-of-stock" : quantity < 5 ? "low-stock" : "in-stock"
    };

    // If user uploaded a new image
    if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
            updatedData.imageUrl = reader.result;

            await updateProduct(itemId, updatedData);
            alert("Item updated successfully");
            window.location.href = "items.html";
        };

        reader.readAsDataURL(imageFile);
    } else {
        // Keep existing image
        const products = await getProducts();
        const item = products.find(p => p.id === itemId);

        updatedData.imageUrl = item.imageUrl;

        await updateProduct(itemId, updatedData);
        alert("Item updated successfully");
        window.location.href = "items.html";
    }
});
