import axiosClient from "./axiosClient";

export const createVietQRPayment = async (dto) => {
  const res = await axiosClient.post("/payment/vietqr/create", dto);
  return res.data;
};

