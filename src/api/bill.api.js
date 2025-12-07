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

// Lấy bill theo ngày
export const getAllBillToday = async () => {
    try {
        const res = await axiosClient.get(`/bill/all-bill-today`);
        return res.data;
    } catch (error) {
        // Bạn có thể xử lý lỗi ở đây hoặc throw ra component gọi
        console.error('Lỗi khi lấy tất cả bill trong ngày: ', error.response?.data || error.message);
        throw error;
    }
}

// Lấy chi tiết Bill
export const getDetailBill = async (billId) => {
    try {
        const res = await axiosClient.get(`/bill/${billId}`);
        return res.data;
    } catch (error) {
        // Bạn có thể xử lý lỗi ở đây hoặc throw ra component gọi
        console.error('Lỗi khi chi tiết Bill: ', error.response?.data || error.message);
        throw error;
    }
}
