// Dashboard connected to SQL Server API
import { getProducts } from "./api.js";

// Show username
const username = sessionStorage.getItem("loggedInUser");
document.getElementById("greeting").textContent = `Welcome back, ${username}`;

// Load products
const loadDashboard = async () => {
    const currentUserId = Number(sessionStorage.getItem("loggedInUserId"));

    try {
        // Get products belonging to the logged-in user
        const products = (await getProducts()).filter(
            product => Number(product.UserID) === currentUserId
        );

        // Dashboard statistics
        document.getElementById("totalItems").textContent = products.length;

        const totalQuantity = products.reduce(
            (sum, p) => sum + Number(p.Quantity), 0
        );
        document.getElementById("totalQuantity").textContent = totalQuantity;

        const inventoryValue = products.reduce(
            (sum, p) => sum + (Number(p.Price) * Number(p.Quantity)), 0
        );
        document.getElementById("inventoryValue").textContent =
            `£${inventoryValue.toFixed(2)}`;

        const lowStock = products.filter(
            p => Number(p.Quantity) > 0 && Number(p.Quantity) < 5
        ).length;
        document.getElementById("lowStock").textContent = lowStock;

        const outOfStock = products.filter(
            p => Number(p.Quantity) === 0
        ).length;
        document.getElementById("outOfStock").textContent = outOfStock;

        // Recent items
        const recentContainer = document.getElementById("recentItems");
        recentContainer.innerHTML = "";

        products.slice(-5).reverse().forEach(item => {
            const div = document.createElement("div");
            div.classList.add("recent-item");

            div.innerHTML = `
                <div class="recent-card">
                    <strong>${item.Name}</strong> (${item.Code})<br>
                    Quantity: ${item.Quantity}<br>
                    Status: ${item.Status}
                </div>
            `;

            recentContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Unable to load dashboard:", error);
        alert("Unable to load dashboard data.");
    }
};

loadDashboard();