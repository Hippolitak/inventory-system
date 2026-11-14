import { getProducts, updateProduct } from "./api.js";

// Get ID from URL
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("id");

const editForm = document.getElementById("editItemForm");

let existingImageUrl = "";

// Load item data
const loadItem = async () => {
    try {
        const currentUserId = Number(
            sessionStorage.getItem("loggedInUserId")
        );

        // Find products belonging to the logged-in user
        const products = (await getProducts()).filter(
            product => product.UserID === currentUserId
        );

        const item = products.find(
            p => String(p.ProductID) === String(itemId)
        );

        if (!item) {
            alert("Item not found");
            window.location.href = "items.html";
            return;
        }

        // Fill form using SQL Server column names
        document.getElementById("editName").value = item.Name ?? "";
        document.getElementById("editCode").value = item.Code ?? "";
        document.getElementById("editCategory").value = item.Category ?? "";
        document.getElementById("editQuantity").value = item.Quantity ?? 0;
        document.getElementById("editPrice").value = item.Price ?? 0;

        // Keep existing image unless it is replaced
        existingImageUrl = item.ImageUrl ?? "";

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

        // Cloudinary replacement image upload
        if (imageFile) {
            // FormData packages the selected image file before transmission to the Cloudinary 
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
                // Validates the Cloudinary API response to ensure a secure image URL has been generated successfully
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
            Name: name,
            Code: code,
            Category: category,
            Quantity: quantity,
            Price: price,
            Status: status,
            ImageUrl: imageUrl
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