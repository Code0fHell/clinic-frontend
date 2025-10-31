import axiosClient from "./axiosClient";

// Tạo đơn thuốc
export const createPrescription = async (dto) => {
  const res = await axiosClient.post("/prescription", dto);
  return res.data;
};

// Lấy đơn thuốc theo id
export const getPrescriptionById = async (id) => {
  const res = await axiosClient.get(`/prescription/${id}`);
  return res.data;
};