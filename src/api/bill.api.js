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

// Lấy danh sách hóa đơn thuốc với filters (cho dược sĩ)
export const getPrescriptionBills = async (params) => {
    try {
        const res = await axiosClient.get("/bill/prescription/list", { params });
        return res.data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hóa đơn thuốc: ', error.response?.data || error.message);
        throw error;
    }
}
// Đếm số bill
export const getCountBillToday = async () => {
    const res = await axiosClient.get('/bill/dashboard/count');
    return res.data;
}

// Danh sách bệnh nhân đã thanh toán (dashboard lễ tân)
export const getPaymentReport = async ({ cursor = null, limit = 10 } = {}) => {
    try {
        const params = { limit };

        // chỉ gửi cursor khi có (load lần 2 trở đi)
        if (cursor) {
            params.cursor = cursor;
        }

        const res = await axiosClient.get("/bill/dashboard/payment-report", { params });

        return res.data;
        // { data: [], meta: { limit, hasMore, nextCursor } }
    } catch (err) {
        console.error(
            "Lỗi khi lấy danh sách bill:",
            err.response?.data || err.message
        );
        return {
            data: [],
            meta: {
                limit,
                hasMore: false,
                nextCursor: null,
            },
        };
    }
}

// Lấy bill theo prescriptionId (cho dược sĩ)
export const getBillByPrescription = async (prescriptionId) => {
    try {
        const res = await axiosClient.get(
            `/bill/prescription/${prescriptionId}`
        );
        return res.data;
    } catch (error) {
        console.error(
            "Lỗi khi lấy bill theo đơn thuốc:",
            error.response?.data || error.message
        );
        throw error;
    }
};