import axiosClient from "./axiosClient";

/**
 * Tạo Medical Ticket cho một lượt khám (Visit)
 * @param {string} visitId - ID của lượt khám
 * @returns {Promise<Object>} Thông tin Medical Ticket vừa tạo
 */
export const createMedicalTicket = async (visitId) => {
    try {
        const res = await axiosClient.post(`/medical-ticket/${visitId}/create-ticket`);
        return res.data;
    } catch (error) {
        // Bạn có thể xử lý lỗi ở đây hoặc throw ra component gọi
        console.error('Lỗi khi tạo Medical Ticket:', error.response?.data || error.message);
        throw error;
    }
};