// SSMS intergration 
const API_BASE = "http://localhost:3000/api";

// User account operations 
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

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Registration failed");
    }

    return data;
};

// User login
export const loginUser = async (userData) => {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    return res.json();
};

// Update user password
export const updatePassword = async (userId, passwordData) => {
    const res = await fetch(`${API_BASE}/users/${userId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData)
    });

    return res.json();
};

export const updateUser = async (id, userData) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
    });

    return res.json();
};

export const deleteUser = async (id) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "DELETE"
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Account deletion failed.");
    }

    return data;
};

// Product CRUD operations used throughout the inventory system 
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

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Unable to add product");
    }

    return data;
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

