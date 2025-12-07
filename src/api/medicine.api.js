import axiosClient from "./axiosClient";

// Tìm kiếm thuốc
export const searchMedicines = async (query) => {
  const res = await axiosClient.get("/medicine/search", { params: { q: query } });
  return res.data;
};

// Lấy tất cả thuốc với filtering
export const getAllMedicines = async (category) => {
  const params = {};
  if (category) params.category = category;
  const res = await axiosClient.get("/medicine", { params });
  return res.data;
};

// Lấy chi tiết thuốc
export const getMedicineById = async (id) => {
  const res = await axiosClient.get(`/medicine/${id}`);
  return res.data;
};

// Tạo thuốc mới
export const createMedicine = async (data) => {
  const res = await axiosClient.post("/medicine", data);
  return res.data;
};

// Cập nhật thuốc
export const updateMedicine = async (id, data) => {
  const res = await axiosClient.put(`/medicine/${id}`, data);
  return res.data;
};

// Xóa thuốc
export const deleteMedicine = async (id) => {
  const res = await axiosClient.delete(`/medicine/${id}`);
  return res.data;
};