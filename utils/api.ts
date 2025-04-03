import axios from 'axios';

const BASE_URL = 'http://192.168.35.25:3000/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const response = await api.post('/auth/register', {
            username,
            email,
            password,
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Login failed';
    }
};

export default api;