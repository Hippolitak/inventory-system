import { getProducts, deleteProduct } from "./api.js";

const itemsContainer = document.getElementById("itemsContainer");

// Load Items
const loadItems = async () => {
    if (!itemsContainer) return;

    try {
        const products = await getProducts();
        itemsContainer.innerHTML = "";

        products.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("item-card");

            // Display uploaded image, or use category icon as fallback
            const imageSrc = item.imageUrl || `assets/icons/${item.category || "default"}.png`;

            card.innerHTML = `
                <img
                    src="${imageSrc}"
                    class="item-image"
                    alt="${item.category || "default"} icon"
                >

                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p>Item Code: ${item.code}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Status: ${item.status ?? "Unknown"}</p>
                    <p>Price: £${item.price}</p>
                </div>

                <div class="item-actions">
                    <a href="edit-item.html?id=${item.id}">Edit</a>
                    <a href="#" class="delete-btn" data-id="${item.id}">Delete</a>
                </div>
            `;

            itemsContainer.appendChild(card);
        });

        // Delete buttons
        itemsContainer.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();

                const id = btn.dataset.id;

                if (confirm("Delete this item?")) {
                    try {
                        await deleteProduct(id);
                        await loadItems();
                    } catch (error) {
                        console.error("Error deleting item:", error);
                        alert("Unable to delete item. Please try again.");
                    }
                }
            });
        });

    } catch (error) {
        console.error("Error loading items:", error);
        itemsContainer.textContent = "Unable to load items. Please try again.";
    }
};

loadItems();
