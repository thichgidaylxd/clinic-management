// src/services/medicalRecordAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1'; // Hoặc dùng biến môi trường

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const medicalRecordAPI = {
    /**
     * Tạo hồ sơ bệnh án mới
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
            throw error.response?.data || { message: error.message };
        }
    },

    /**
     * Lấy danh sách hồ sơ của bác sĩ hiện tại (dùng cho trang MedicalRecords)
     * @param {Object} params - { page, limit, search, specialty }
     */
    getAllForDoctor: async (params = {}) => {
        try {
            const response = await axios.get(
                `${API_URL}/medical-records`,
                {
                    params: {
                        page: params.page || 1,
                        limit: params.limit || 10,
                        search: params.search || '',
                        specialty: params.specialty || 'all'
                    },
                    headers: getAuthHeader()
                }
            );
            return response.data; // Trả về { success: true, data: [...], total, totalPages }
        } catch (error) {
            throw error.response?.data || { message: error.message };
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
            throw error.response?.data || { message: error.message };
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
            throw error.response?.data || { message: error.message };
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
            throw error.response?.data || { message: error.message };
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
            throw error.response?.data || { message: error.message };
        }
    }
};

export default medicalRecordAPI;