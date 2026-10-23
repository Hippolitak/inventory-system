// Help of AI Assistance
import { getProducts, updateProduct } from "./api.js";

const itemSelect = document.getElementById("stockItemSelect");
const adjustForm = document.getElementById("adjustStockForm");

// Load items into dropdown
const loadItems = async () => {
    const products = await getProducts();

    products.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.name} (${item.code})`;
        itemSelect.appendChild(option);
    });
};

loadItems();

// Handle stock adjustment
adjustForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const itemId = itemSelect.value;
    const adjustType = document.getElementById("adjustType").value;
    const amount = Number(document.getElementById("adjustAmount").value);
    const products = await getProducts();
    const item = products.find(p => p.id === itemId);

    if (!item) {
        alert("Item not found! Try Harder");
        return;
    }

    let newQuantity = item.quantity;

    if (adjustType === "increase") {
        newQuantity += amount;
    } else {
        newQuantity -= amount;
        if (newQuantity < 0) newQuantity = 0;
    }

    // Auto-update status
    const newStatus =
        newQuantity === 0 ? "out-of-stock" :
        newQuantity < 5 ? "low-stock" :
        "in-stock";

    const updatedItem = {
        ...item,
        quantity: newQuantity,
        status: newStatus
    };

    await updateProduct(itemId, updatedItem);

    alert("Stock updated successfully");
    window.location.href = "items.html";
});
