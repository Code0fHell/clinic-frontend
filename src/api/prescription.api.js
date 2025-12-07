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

// Lấy tất cả đơn thuốc
export const getAllPrescriptions = async () => {
  const res = await axiosClient.get("/prescription");
  return res.data;
};

// Lấy đơn thuốc theo bệnh nhân
export const getPrescriptionsByPatient = async (patientId) => {
  const res = await axiosClient.get(`/prescription/patient/${patientId}`);
  return res.data;
};

// Cập nhật đơn thuốc
export const updatePrescription = async (id, dto) => {
  const res = await axiosClient.put(`/prescription/${id}`, dto);
  return res.data;
};

// Xóa đơn thuốc
export const deletePrescription = async (id) => {
  const res = await axiosClient.delete(`/prescription/${id}`);
  return res.data;
};

// Lấy danh sách đơn thuốc chờ duyệt (cho dược sĩ)
export const getPendingPrescriptions = async () => {
  const res = await axiosClient.get("/prescription/pending/list");
  return res.data;
};

// Duyệt đơn thuốc (cho dược sĩ)
export const approvePrescription = async (id, note) => {
  const res = await axiosClient.put(`/prescription/${id}/approve`, { note });
  return res.data;
};

// Lấy hoạt động gần đây của dược sĩ
export const getPharmacistRecentActivity = async () => {
  const res = await axiosClient.get("/prescription/pharmacist/recent-activity");
  return res.data;
};