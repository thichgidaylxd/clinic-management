import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * API service cho hồ sơ bệnh án
 */
const medicalRecordAPI = {
    /**
     * Tạo hồ sơ bệnh án
     */
    create: async (data) => {
        try {
            const response = await axios.post(
                `${API_URL}/medical-records`,
                data,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Lấy hồ sơ theo ID
     */
    getById: async (recordId) => {
        try {
            const response = await axios.get(
                `${API_URL}/medical-records/${recordId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Lấy hồ sơ theo bệnh nhân
     */
    getByPatient: async (patientId, page = 1, limit = 10) => {
        try {
            const response = await axios.get(
                `${API_URL}/medical-records/patient/${patientId}`,
                {
                    params: { page, limit },
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Cập nhật hồ sơ
     */
    update: async (recordId, data) => {
        try {
            const response = await axios.put(
                `${API_URL}/medical-records/${recordId}`,
                data,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    /**
     * Xóa hồ sơ
     */
    delete: async (recordId) => {
        try {
            const response = await axios.delete(
                `${API_URL}/medical-records/${recordId}`,
                { headers: getAuthHeader() }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default medicalRecordAPI;