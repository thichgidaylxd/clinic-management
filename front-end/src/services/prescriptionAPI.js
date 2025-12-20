import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

// Get auth token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * API service cho kê đơn thuốc
 */
const prescriptionAPI = {
    /**
     * Kê đơn thuốc đầy đủ (Hồ sơ + Thuốc)
     */
    create: async (data) => {
        try {
            const response = await axios.post(
                `${API_URL}/prescriptions`,
                data,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Kê đơn thuốc (Chỉ thuốc, không hồ sơ)
     */
    createMedicineOnly: async (data) => {
        try {
            const response = await axios.post(
                `${API_URL}/prescriptions/medicine-only`,
                data,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Kiểm tra tồn kho thuốc
     */
    checkStock: async (medicines) => {
        try {
            const response = await axios.post(
                `${API_URL}/prescriptions/check-stock`,
                { medicines },
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Lấy chi tiết hóa đơn
     */
    getInvoice: async (invoiceId) => {
        try {
            const response = await axios.get(
                `${API_URL}/prescriptions/invoice/${invoiceId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Thanh toán hóa đơn
     */
    payInvoice: async (invoiceId, paymentData) => {
        try {
            const response = await axios.put(
                `${API_URL}/prescriptions/invoice/${invoiceId}/payment`,
                paymentData,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default prescriptionAPI;