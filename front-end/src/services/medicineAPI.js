import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * API service cho thuốc
 */
const medicineAPI = {
    /**
 * Lấy danh sách tất cả thuốc (có phân trang, search, status)
 */
    getAll: async (params = {}) => {
        try {
            const response = await axios.get(
                `${API_URL}/medicines`,
                {
                    params,
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Tìm kiếm thuốc
     */
    search: async (keyword, params = {}) => {
        try {
            const response = await axios.get(
                `${API_URL}/medicines`,
                {
                    params: {
                        search: keyword,
                        status: 1, // Active only
                        inStock: true, // Có tồn kho
                        ...params
                    },
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Lấy thuốc theo ID
     */
    getById: async (medicineId) => {
        try {
            const response = await axios.get(
                `${API_URL}/medicines/${medicineId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Lấy danh sách tất cả thuốc còn hàng
     */
    getAvailable: async (page = 1, limit = 50) => {
        try {
            const response = await axios.get(
                `${API_URL}/medicines`,
                {
                    params: {
                        page,
                        limit,
                        status: 1,
                        inStock: true
                    },
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default medicineAPI;