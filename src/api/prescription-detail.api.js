import axiosClient from "./axiosClient";

// Thêm chi tiết đơn thuốc
export const createPrescriptionDetail = async (dto) => {
  const res = await axiosClient.post("/prescription-detail", dto);
  return res.data;
};

// Lấy danh sách chi tiết đơn thuốc theo prescription_id
export const getPrescriptionDetails = async (prescriptionId) => {
  const res = await axiosClient.get(`/prescription-detail/prescription/${prescriptionId}`);
  return res.data;
};