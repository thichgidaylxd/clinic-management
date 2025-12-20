// services/authAPI.js

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
    }
    return data;
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const authAPI = {
    // =================== AUTH ===================

    login: async (payload) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    register: async (payload) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return handleResponse(response);
    },

    logout: async () => {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    // =================== USER ===================

    getCurrentUser: async () => {
        const response = await fetch(
            `${API_BASE_URL}/auth/me`,
            { headers: getAuthHeaders() }
        );
        return handleResponse(response);
    },

    updateProfile: async (payload) => {
        const response = await fetch(
            `${API_BASE_URL}/auth/profile`,
            {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            }
        );
        return handleResponse(response);
    },

    changePassword: async (payload) => {
        const response = await fetch(
            `${API_BASE_URL}/auth/change-password`,
            {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            }
        );
        return handleResponse(response);
    }
};
