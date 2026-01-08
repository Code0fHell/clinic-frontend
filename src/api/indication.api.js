import axiosClient from "./axiosClient";

// Lấy tất cả phiếu chỉ định
export const getAllIndications = async () => {
  const res = await axiosClient.get("/indication");
  return res.data;
};

// Lấy phiếu chỉ định theo ID
export const getIndicationById = async (id) => {
  const res = await axiosClient.get(`/indication/${id}`);
  return res.data;
};

// Lấy phiếu chỉ định theo bệnh nhân
export const getIndicationsByPatient = async (patientId) => {
  const res = await axiosClient.get(`/indication/patient/${patientId}`);
  return res.data;
};

// Tạo phiếu chỉ định mới (bác sĩ thực hiện)
export const createIndicationTicket = async (dto) => {
  const res = await axiosClient.post(`/indication-ticket/`, dto); 
  return res.data;
};

// Cập nhật phiếu chỉ định
export const updateIndication = async (id, dto) => {
  const res = await axiosClient.put(`/indication/${id}`, dto);
  return res.data;
};

// Xóa phiếu chỉ định
export const deleteIndication = async (id) => {
  const res = await axiosClient.delete(`/indication/${id}`);
  return res.data;
};

// In phiếu chỉ định (xuất PDF)
export const printIndication = async (id) => {
  const res = await axiosClient.get(`/indication/${id}/print`, {
    responseType: "blob", // Đảm bảo trả về file PDF
  });
  return res.data;
};

// Lấy danh sách phiếu chỉ định xét nghiệm hôm nay cho LAB
export const getTodayLabIndications = async () => {
  const res = await axiosClient.get("/indication-ticket/lab/today");
  return res.data;
};

// Lấy danh sách phiếu chỉ định của bác sĩ hôm nay (có thể filter theo loại)
export const getDoctorTodayIndications = async (type) => {
  const params = type ? { type } : {};
  const res = await axiosClient.get("/indication-ticket/doctor/today", { params });
  return res.data;
};