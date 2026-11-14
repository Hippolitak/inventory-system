import { getProducts, deleteProduct } from "./api.js";

const itemsContainer = document.getElementById("itemsContainer");

// Retrieve inventory records 
const loadItems = async () => {
    if (!itemsContainer) return;

    try {
        const currentUser =
            sessionStorage.getItem("loggedInUser");

        // Restricts inventory visibility only for intended user
        const currentUserId = Number(
            sessionStorage.getItem("loggedInUserId")
        );

        const products = (await getProducts()).filter(
            product => product.UserID === currentUserId
        );
        itemsContainer.innerHTML = "";

        products.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("item-card");

            // AI-assisted image handling logic
            const imageSrc = item.ImageUrl || `assets/icons/${item.Category || "default"}.png`;

            card.innerHTML = `
                <img
                    src="${imageSrc}"
                    class="item-image"
                    alt="${item.Category || "default"} icon"
                >

                <div class="item-info">
                    <h3>${item.Name}</h3>
                    <p>Item Code: ${item.Code}</p>
                    <p>Quantity: ${item.Quantity}</p>
                    <p>Status: ${item.Status ?? "Unknown"}</p>
                    <p>Price: £${item.Price}</p>
                </div>

                <div class="item-actions">
                    <a href="edit-item.html?id=${item.ProductID}">Edit</a>
                    <a href="#" class="delete-btn" data-id="${item.ProductID}">Delete</a>
                </div>
            `;

            itemsContainer.appendChild(card);
        });

        // AI-assisted event handling used to support item deletion 
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
