import { getProducts } from "./api.js";

const reportCards = document.getElementById("reportCards");
const inventoryTable = document.getElementById("inventoryTable");
const lowStockItems = document.getElementById("lowStockItems");
const outOfStockItems = document.getElementById("outOfStockItems");
const reportSearch = document.getElementById("reportSearch");

// AI-assisted reporting workflow which retrieves inventory data
const loadReports = async () => {

    const currentUser =
        sessionStorage.getItem("loggedInUser");

    // Generates reports only for intended user
    let products = (await getProducts()).filter(
        product => product.owner === currentUser
    );

    // AI-assisted search feature which filters inventory records
    if (reportSearch && reportSearch.value.trim() !== "") {

    const searchTerm = reportSearch.value.toLowerCase();

    products = products.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        String(item.code).toLowerCase().includes(searchTerm)
    );
}

    const totalProducts = products.length;
    // AI-assisted aggregation using reduce() to calculate the total quantity of inventory items
    const totalQuantity = products.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const inventoryValue = products.reduce(
        (sum, item) => sum + (item.quantity * item.price),
        0
    );

    const formattedInventoryValue = inventoryValue.toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP"
    });

    const lowStock = products.filter(
        item => item.quantity > 0 && item.quantity < 5
    );

    const outOfStock = products.filter(
        item => item.quantity === 0
    );

    const printReportBtn = document.getElementById("printReportBtn");
    printReportBtn?.addEventListener("click", () => {
        window.print();
    });

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
            <p>${formattedInventoryValue}</p>
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
                        <td>£${Number(item.price).toFixed(2)}</td>
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
reportSearch?.addEventListener("input", loadReports);