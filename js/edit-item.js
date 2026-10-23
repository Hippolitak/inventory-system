import { getProducts, updateProduct } from "./api.js";

// Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");

const editForm = document.getElementById("editItemForm");

// Load item data
const loadItem = async () => {
    try {
        const products = await getProducts();
        const item = products.find(p => String(p.id) === String(itemId));

        if (!item) {
            alert("Item not found");
            window.location.href = "items.html";
            return;
        }

        // Fill form
        document.getElementById("editName").value = item.name ?? "";
        document.getElementById("editCode").value = item.code ?? "";
        document.getElementById("editCategory").value = item.category ?? "box";
        document.getElementById("editQuantity").value = item.quantity ?? 0;
        document.getElementById("editPrice").value = item.price ?? 0;

    } catch (error) {
        console.error("Error loading item:", error);
        alert("Unable to load item details.");
    }
};

if (editForm) {
    loadItem();

    // Save changes
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("editName").value.trim();
        const code = document.getElementById("editCode").value.trim();
        const category = document.getElementById("editCategory").value;
        const quantity = Number(document.getElementById("editQuantity").value);
        const price = Number(document.getElementById("editPrice").value);

        const status = quantity === 0
            ? "out-of-stock"
            : quantity < 5
                ? "low-stock"
                : "in-stock";

        const updatedData = {
            name,
            code,
            category,
            quantity,
            price,
            status
        };

        try {
            await updateProduct(itemId, updatedData);

            alert("Item updated successfully!");
            window.location.href = "items.html";

        } catch (error) {
            console.error("Error updating item:", error);
            alert("Unable to update item. Please try again.");
        }
    });
}

