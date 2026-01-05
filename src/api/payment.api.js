import axiosClient from "./axiosClient";

// Thanh toán bằng cash
export const paymentCash = async (dto) => {
    try {
        const res = await axiosClient.post("/payment/cash/create", dto);
        return res.data;
    } catch (err) {
        console.error("Lỗi khi thanh toán:", err.response?.data || err);
        throw err;
    }
}

// Tạo VietQR QR Code để thanh toán
export const createVietQR = async (data) => {
    try {
        const res = await axiosClient.post("/payment/vietqr/create", data);
        return res.data;
    } catch (err) {
        console.error("Lỗi khi tạo VietQR:", err.response?.data || err);
        throw err;
    }
}

// Kiểm tra trạng thái thanh toán
export const getPaymentStatus = async (orderCode) => {
    try {
        const res = await axiosClient.get(`/payment/status/${orderCode}`);
        return res.data;
    } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái:", err.response?.data || err);
        throw err;
    }
}
