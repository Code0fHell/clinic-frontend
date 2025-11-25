import axiosClient from "./axiosClient";

// Thanh toán bằng cash
export const paymentCash = async (data) => {
    try {
        const res = await axiosClient.post("/payment/cash/create", data);
        return res.data;
    } catch (err) {
        console.error("Lỗi khi thanh toán:", err.response?.data || err);
        throw err;
    }
}
export const createVietQRPayment = async (dto) => {
  const res = await axiosClient.post("/payment/vietqr/create", dto);
  return res.data;
};

