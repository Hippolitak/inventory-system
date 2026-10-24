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

        const status =
            quantity === 0
                ? "out-of-stock"
                : quantity < 5
                    ? "low-stock"
                    : "in-stock";

        let imageUrl = "";

        // Upload image to Cloudinary
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

                imageUrl = data.secure_url;
            } catch (error) {
                console.error("Cloudinary upload failed:", error);
                alert("Failed to upload image.");
                return;
            }
        }

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
            await createProduct(newItem);

            alert("Item added successfully!");
            window.location.href = "items.html";
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Unable to add item.");
        }
    });
}