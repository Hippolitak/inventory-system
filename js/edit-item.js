import { getProducts, updateProduct } from "./api.js";

// Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");

const editForm = document.getElementById("editItemForm");

let existingImageUrl = "";

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
        document.getElementById("editCategory").value = item.category ?? "";
        document.getElementById("editQuantity").value = item.quantity ?? 0;
        document.getElementById("editPrice").value = item.price ?? 0;

        // Keep existing image
        existingImageUrl = item.imageUrl ?? "";

        const imagePreview = document.getElementById("editImagePreview");

        if (existingImageUrl) {
            imagePreview.src = existingImageUrl;
            imagePreview.style.display = "block";
        }

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
        const category = document.getElementById("editCategory").value.trim();
        const quantity = Number(document.getElementById("editQuantity").value);
        const price = Number(document.getElementById("editPrice").value);

        const imageFile = document.getElementById("editImage").files[0];

        const status = quantity === 0
            ? "out-of-stock"
            : quantity < 5
                ? "low-stock"
                : "in-stock";

        let imageUrl = existingImageUrl;

        // Upload replacement image if selected
        if (imageFile) {
            const formData = new FormData();

            formData.append("file", imageFile);
            formData.append("upload_preset", "inventory_uploads");

            try {
                const response = await fetch(
                    "https://api.cloudinary.com/v1_1/dhdege5im/image/upload",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.secure_url) {
                    throw new Error(data.error?.message || "Image upload failed");
                }

                imageUrl = data.secure_url;

            } catch (error) {
                console.error("Cloudinary upload failed:", error);
                alert("Failed to upload replacement image.");
                return;
            }
        }

        const updatedData = {
            name,
            code,
            category,
            quantity,
            price,
            status,
            imageUrl
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