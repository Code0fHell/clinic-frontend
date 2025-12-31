import axiosClient from "./axiosClient";

// Tạo Medical Ticket cho một lượt khám (Visit)
export const createMedicalTicket = async (visitId) => {
    try {
        const res = await axiosClient.post(`/medical-ticket/${visitId}/create-ticket`);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi tạo Medical Ticket:', error.response?.data || error.message);
        throw error;
    }
};
