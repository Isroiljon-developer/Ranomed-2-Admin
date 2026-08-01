import axios from 'axios';

const API_URL = 'http://localhost:9000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Avtomatik Token qo'shish
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- AUTH ---
export const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
};

// --- USER MANAGEMENT (XODIMLAR) ---

// Xodim yaratish (RASM BILAN)
export const createUser = async (userData, photoFile) => {
    const formData = new FormData();

    // Text ma'lumotlarni qo'shish
    Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
    });

    // Rasmni qo'shish (agar bo'lsa)
    if (photoFile) {
        formData.append('photo', photoFile);
    }

    // Header avtomatik 'multipart/form-data' ga o'zgaradi
    const response = await api.post('/admin/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const getUsers = async (branchId) => {
    const params = branchId ? { branch_id: branchId } : {};
    const response = await api.get('/admin/users', { params });
    return response.data;
};

// --- BRANCH MANAGEMENT ---
export const createBranch = async (data) => {
    const response = await api.post('/admin/branches', data);
    return response.data;
};

export const getBranches = async () => {
    const response = await api.get('/admin/branches');
    return response.data;
};

// --- IMAGE HELPER ---
export const getImageUrl = (filename) => {
    return filename ? `${API_URL.replace('/api', '')}/uploads/${filename}` : '/default-avatar.png';
};

export default api;
