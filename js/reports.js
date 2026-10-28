import { getProducts } from "./api.js";

const reportCards = document.getElementById("reportCards");
const inventoryTable = document.getElementById("inventoryTable");
const lowStockItems = document.getElementById("lowStockItems");
const outOfStockItems = document.getElementById("outOfStockItems");

const loadReports = async () => {

    const products = await getProducts();

    const totalProducts = products.length;

    const totalQuantity = products.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const inventoryValue = products.reduce(
        (sum, item) => sum + (item.quantity * item.price),
        0
    );

    const lowStock = products.filter(
        item => item.quantity > 0 && item.quantity < 5
    );

    const outOfStock = products.filter(
        item => item.quantity === 0
    );

    reportCards.innerHTML = `
        <div class="card">
            <h3>Total Products</h3>
            <p>${totalProducts}</p>
        </div>

        <div class="card">
            <h3>Total Quantity</h3>
            <p>${totalQuantity}</p>
        </div>

        <div class="card">
            <h3>Inventory Value</h3>
            <p>£${inventoryValue.toFixed(2)}</p>
        </div>

        <div class="card">
            <h3>Low Stock</h3>
            <p>${lowStock.length}</p>
        </div>

        <div class="card">
            <h3>Out Of Stock</h3>
            <p>${outOfStock.length}</p>
        </div>
    `;

    inventoryTable.innerHTML = `
        <table class="report-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Value</th>
                </tr>
            </thead>

            <tbody>
                ${products.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.category}</td>
                        <td>${item.quantity}</td>
                        <td>£${item.price}</td>
                        <td>£${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    lowStockItems.innerHTML = lowStock.length
        ? lowStock.map(item => `
            <p>${item.name} (Qty: ${item.quantity})</p>
        `).join("")
        : "<p>No low stock items.</p>";

    outOfStockItems.innerHTML = outOfStock.length
        ? outOfStock.map(item => `
            <p>${item.name}</p>
        `).join("")
        : "<p>No out-of-stock items.</p>";
};

loadReports();