import axiosClient from "./axiosClient";

// Lấy thông tin profile của user hiện tại
export const getProfile = async () => {
  const res = await axiosClient.get("/user/profile");
  return res.data;
};

// Cập nhật profile
export const updateProfile = async (data) => {
  const res = await axiosClient.put("/user/profile", data);
  return res.data;
};

// Upload avatar
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosClient.put("/user/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ========== ADMIN APIs ==========

// Lấy tất cả users với phân trang và filter
export const getAllUsers = async ({ page = 1, limit = 10, role }) => {
  const params = { page, limit };
  if (role) params.role = role;
  const res = await axiosClient.get("/user/all", { params });
  return res.data;
};

// Lấy thông tin user theo ID
export const getUserById = async (id) => {
  const res = await axiosClient.get(`/user/${id}`);
  return res.data;
};

// Tạo tài khoản bệnh nhân mới
export const createPatientAccount = async (data) => {
  const res = await axiosClient.post("/user/create-patient-account", data);
  return res.data;
};

// Xóa user
export const deleteUser = async (id) => {
  const res = await axiosClient.delete(`/user/${id}`);
  return res.data;
};

