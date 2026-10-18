// Help of AI
import { getProducts } from "./api.js";

// Show username
const username = sessionStorage.getItem("loggedInUser");
document.getElementById("greeting").textContent = `Welcome back, ${username}`;

// Load products
const loadDashboard = async () => {
    const products = await getProducts();

    // Stats
    document.getElementById("totalItems").textContent = products.length;

    const totalQuantity = products.reduce((sum, p) => sum + Number(p.quantity), 0);
    document.getElementById("totalQuantity").textContent = totalQuantity;

    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    document.getElementById("inventoryValue").textContent = `£${inventoryValue.toFixed(2)}`;

    const lowStock = products.filter(p => p.quantity < 5).length;
    document.getElementById("lowStock").textContent = lowStock;

    const outOfStock = products.filter(p => p.quantity === 0).length;
    document.getElementById("outOfStock").textContent = outOfStock;

    // Recent items
    const recentContainer = document.getElementById("recentItems");
    recentContainer.innerHTML = "";

    products.slice(-5).reverse().forEach(item => {
        const div = document.createElement("div");
        div.classList.add("recent-item");

        div.innerHTML = `
            <div class="recent-card">
                <strong>${item.name}</strong> (${item.code})<br>
                Quantity: ${item.quantity}<br>
                Status: ${item.status}
            </div>
        `;

        recentContainer.appendChild(div);
    });
};

loadDashboard();
