// MockAPI base URL
const API_BASE = "https://6ad4df9e48476c0785d94f71.mockapi.io";

// Users
export const getUsers = async () => {
    const res = await fetch(`${API_BASE}/users`);
    return res.json();
};

export const createUser = async (userData) => {
    const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });
    return res.json();
};

// Products
export const getProducts = async () => {
    const res = await fetch(`${API_BASE}/products`);
    return res.json();
};

export const createProduct = async (productData) => {
    const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
    });
    return res.json();
};

export const updateProduct = async (id, productData) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData)
    });
    return res.json();
};

export const deleteProduct = async (id) => {
    await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
};

import { getUsers, createUser } from "./api.js";

