import axiosClient from "./axiosClient";

// Tạo bill
export const createBill = async (payload) => {
    try {
        const res = await axiosClient.post(`/bill`, payload);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi tạo Bill:', error.response?.data || error.message);
        throw error;
    }
}

// Lấy bill theo ngày
export const getAllBillToday = async ({
    date = "",        // dd/MM/yyyy
    keyword = "",
    billType = 'all',
    paymentMethod = 'all',
    paymentStatus = 'all',
    page = 1,
    limit = 10,
} = {}) => {
    try {
        const res = await axiosClient.get(`/bill/all-bill-today`, {
            params: {
                date,
                billType,
                paymentMethod,
                paymentStatus,
                keyword,
                page,
                limit
            },
        });

        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy tất cả bill trong ngày: ', error.response?.data || error);
        return {
            data: [],
            pagination: {
                total: 0,
                page,
                limit,
                offset: 0,
                totalPages: 0
            },
        };
    }
}

// Lấy chi tiết Bill
export const getDetailBill = async (billId) => {
    try {
        const res = await axiosClient.get(`/bill/${billId}`);
        return res.data;
    } catch (error) {
        console.error('Lỗi khi chi tiết Bill: ', error.response?.data || error.message);
        throw error;
    }
}
