import axiosClient from "./axiosClient";

// Lấy toàn bộ danh sách dịch vụ y tế
export const getAllMedicalServices = async () => {
  const res = await axiosClient.get("/medical-service");
  return res.data;
};

// Tìm kiếm dịch vụ theo từ khóa (ví dụ: “X-quang”, “Máu”, ...)
export const searchMedicalServices = async (keyword) => {
  const res = await axiosClient.get(`/medical-service/search?q=${encodeURIComponent(keyword)}`);
  return res.data.data;
};

// Lấy thông tin chi tiết 1 dịch vụ
export const getMedicalServiceById = async (id) => {
  const res = await axiosClient.get(`/medical-service/${id}`);
  return res.data;
};

// Tạo mới dịch vụ (dành cho admin hoặc chủ phòng khám)
export const createMedicalService = async (dto) => {
  const res = await axiosClient.post("/medical-service", dto);
  return res.data;
};

// Cập nhật dịch vụ
export const updateMedicalService = async (id, dto) => {
  const res = await axiosClient.put(`/medical-service/${id}`, dto);
  return res.data;
};

// Xóa dịch vụ
export const deleteMedicalService = async (id) => {
  const res = await axiosClient.delete(`/medical-service/${id}`);
  return res.data;
};
