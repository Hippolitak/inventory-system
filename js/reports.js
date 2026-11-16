import { getProducts } from "./api.js";

const reportCards = document.getElementById("reportCards");
const inventoryTable = document.getElementById("inventoryTable");
const lowStockItems = document.getElementById("lowStockItems");
const outOfStockItems = document.getElementById("outOfStockItems");
const reportSearch = document.getElementById("reportSearch");

// Load reports from SQL Server API
const loadReports = async () => {
    try {
        const currentUserId = Number(sessionStorage.getItem("loggedInUserId"));

        let products = (await getProducts()).filter(
            product => Number(product.UserID) === currentUserId
        );

        // Search inventory
        if (reportSearch && reportSearch.value.trim() !== "") {
            const searchTerm = reportSearch.value.toLowerCase();

            products = products.filter(item =>
                String(item.Name).toLowerCase().includes(searchTerm) ||
                String(item.Category).toLowerCase().includes(searchTerm) ||
                String(item.Code).toLowerCase().includes(searchTerm)
            );
        }

        // Calculate report statistics
        const totalProducts = products.length;

        const totalQuantity = products.reduce(
            (sum, item) => sum + Number(item.Quantity), 0
        );

        const inventoryValue = products.reduce(
            (sum, item) => sum + (Number(item.Quantity) * Number(item.Price)), 0
        );

        const formattedInventoryValue = inventoryValue.toLocaleString("en-GB", {
            style: "currency",
            currency: "GBP"
        });

        const lowStock = products.filter(
            item => Number(item.Quantity) > 0 && Number(item.Quantity) < 5
        );

        const outOfStock = products.filter(
            item => Number(item.Quantity) === 0
        );

        // Display report cards
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

        // Display inventory table
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
                            <td>${item.Name}</td>
                            <td>${item.Category}</td>
                            <td>${item.Quantity}</td>
                            <td>£${Number(item.Price).toFixed(2)}</td>
                            <td>£${(Number(item.Quantity) * Number(item.Price)).toFixed(2)}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        // Display low-stock items
        lowStockItems.innerHTML = lowStock.length
            ? lowStock.map(item => `
                <p>${item.Name} (Qty: ${item.Quantity})</p>
            `).join("")
            : "<p>No low stock items.</p>";

        // Display out-of-stock items
        outOfStockItems.innerHTML = outOfStock.length
            ? outOfStock.map(item => `
                <p>${item.Name}</p>
            `).join("")
            : "<p>No out-of-stock items.</p>";

    } catch (error) {
        console.error("Unable to load reports:", error);
        alert("Unable to load report data.");
    }
};

// Print report
const printReportBtn = document.getElementById("printReportBtn");

printReportBtn?.addEventListener("click", () => {
    window.print();
});

// Load reports and update when searching
loadReports();
reportSearch?.addEventListener("input", loadReports);