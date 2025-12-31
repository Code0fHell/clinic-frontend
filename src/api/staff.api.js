import axiosClient from "./axiosClient";

// Lấy danh sách bác sĩ cho trang chủ (tối đa 3)
export const getHomepageDoctors = async () => {
  const res = await axiosClient.get("/staff/homepage-doctors");
  return res.data;
};

// Lấy danh sách bác sĩ lâm sàng
export const getClinicalDoctors = async () => {
  const res = await axiosClient.get("/staff/clinical-doctors");
  return res.data;
};

// Lấy tất cả bác sĩ (có thể filter theo specialty)
export const getAllDoctors = async (specialty) => {
  const params = {};
  if (specialty) params.specialty = specialty;
  const res = await axiosClient.get("/staff/clinical-doctors", { params });
  return res.data;
};

// ========== ADMIN APIs ==========

// Lấy tất cả nhân viên (không phân trang)
export const getAllStaff = async () => {
  const res = await axiosClient.get("/staff");
  return res.data;
};

// Lấy danh sách nhân viên với phân trang và filter
export const getStaffPaginated = async ({ page = 1, limit = 10, role, department, search }) => {
  const params = { page, limit };
  if (role) params.role = role;
  if (department) params.department = department;
  if (search) params.search = search;
  const res = await axiosClient.get("/staff/paginated", { params });
  return res.data;
};

// Lấy thông tin nhân viên theo ID
export const getStaffById = async (id) => {
  const res = await axiosClient.get(`/staff/${id}`);
  return res.data;
};

// Thêm nhân viên mới
export const createStaff = async (data) => {
  const res = await axiosClient.post("/staff", data);
  return res.data;
};

// Cập nhật thông tin nhân viên
export const updateStaff = async (id, data) => {
  const res = await axiosClient.put(`/staff/${id}`, data);
  return res.data;
};

// Xóa nhân viên
export const deleteStaff = async (id) => {
  const res = await axiosClient.delete(`/staff/${id}`);
  return res.data;
};

