import axiosClient from "./axiosClient";

// Tạo bill
export const createBill = async (payload) => {
    try {
        const res = await axiosClient.post(`/bill`, payload);
        return res.data;
    } catch (error) {
        // Bạn có thể xử lý lỗi ở đây hoặc throw ra component gọi
        console.error('Lỗi khi tạo Medical Ticket:', error.response?.data || error.message);
        throw error;
    }
}