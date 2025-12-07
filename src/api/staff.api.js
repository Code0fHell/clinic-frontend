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

