import axiosClient from "./axiosClient";

// Tìm kiếm thuốc
export const searchMedicines = async (query) => {
  const res = await axiosClient.get("/medicine/search", { params: { q: query } });
  return res.data;
};