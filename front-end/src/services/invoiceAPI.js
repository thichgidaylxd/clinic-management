import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * API service cho HÓA ĐƠN
 */
const invoiceAPI = {
    /**
     * =========================
     * Lấy danh sách hóa đơn
     * (Receptionist / Admin)
     * =========================
     */
    getAll: async (params = {}) => {
        try {
            const response = await axios.get(
                `${API_URL}/invoices`,
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
     * =========================
     * Lấy chi tiết 1 hóa đơn
     * =========================
     */
    getById: async (invoiceId) => {
        try {
            const response = await axios.get(
                `${API_URL}/invoices/${invoiceId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * =========================
     * Thanh toán hóa đơn
     * (KHÓA hóa đơn sau khi gọi)
     * =========================
     */
    pay: async (invoiceId, paymentData = {}) => {
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
    },

    /**
     * =========================
     * In hóa đơn PDF
     * =========================
     */
    print: (invoiceId) => {
        const token = localStorage.getItem('token');
        const url = `${API_URL}/invoices/${invoiceId}/print`;

        // Mở tab mới để in
        window.open(
            token ? `${url}?token=${token}` : url,
            '_blank'
        );
    }
};

export default invoiceAPI;
