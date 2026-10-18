// Help of AI assistance
import { getProducts, deleteProduct } from "./api.js";

const itemsContainer = document.getElementById("itemsContainer");

const loadItems = async () => {
    const products = await getProducts();
    itemsContainer.innerHTML = "";

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("item-card");

        // Choose image: uploaded or static icon
        const imageSrc = item.imageUrl && item.imageUrl !== ""
            ? item.imageUrl
            : `assets/icons/${item.category || "default"}.png`;

        card.innerHTML = `
            <img src="${imageSrc}" class="item-image">

            <div class="item-info">
                <h3>${item.name}</h3>
                <p>${item.code}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Status: ${item.status}</p>
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
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            if (confirm("Delete this item?")) {
                await deleteProduct(id);
                loadItems();
            }
        });
    });
};

loadItems();
