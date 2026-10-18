// Help of AI assistance
import { getProducts, deleteProduct, createProduct } from "./api.js";

const itemsContainer = document.getElementById("itemsContainer");

// Load Items (Items Page)
const loadItems = async () => {
    if (!itemsContainer) return; // Only run on items.html

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

// Add Items (Add Item Page)
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
        let imageUrl = "";

        // If user uploaded an image, convert it to Base64
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                imageUrl = reader.result;

                const newItem = {
                    name,
                    code,
                    category,
                    quantity,
                    price,
                    status: quantity === 0 ? "out-of-stock" : quantity < 5 ? "low-stock" : "in-stock",
                    imageUrl
                };

                await createProduct(newItem);
                alert("Item added successfully");
                window.location.href = "items.html";
            };

            reader.readAsDataURL(imageFile);
        } else {
            // No image uploaded then use static icon
            const newItem = {
                name,
                code,
                category,
                quantity,
                price,
                status: quantity === 0 ? "out-of-stock" : quantity < 5 ? "low-stock" : "in-stock",
                imageUrl: "" // fallback 
            };

            await createProduct(newItem);
            alert("Item added successfully");
            window.location.href = "items.html";
        }
    });
}
