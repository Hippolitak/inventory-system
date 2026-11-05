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

        const imageFile = document.getElementById("itemImage").files[0];

// Stock status is automatically calculated based on quantity levels
// Logic was refined with AI assistance in order to improve the stock classification
        const status =
            quantity === 0
                ? "out-of-stock"
                : quantity < 5
                    ? "low-stock"
                    : "in-stock";

        let imageUrl = "";

// Cloudinary image upload integration developed with AI assistance
// Images are uploaded externally and the returned secure URL is stored
        if (imageFile) {
            // FormData is used to package image files for Cloudinary API upload
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

                imageUrl = data.secure_url;
            } catch (error) {
                console.error("Cloudinary upload failed:", error);
                alert("Failed to upload image.");
                return;
            }
        }
        // Creates the product object which gets saved to MockAPI
        const newItem = {
            name,
            code,
            category,
            quantity,
            price,
            status,
            imageUrl
        };

        try {
            // Product data is posted to MockAPI after successful validation and image process
            await createProduct(newItem);

            alert("Item added successfully!");
            window.location.href = "items.html";
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Unable to add item.");
        }
    });
}