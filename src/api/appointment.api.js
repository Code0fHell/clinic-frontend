import axiosClient from "./axiosClient";

// Lấy danh sách bác sĩ lâm sàng
export const getClinicalDoctors = async () => {
  const res = await axiosClient.get("/staff/clinical-doctors");
  return res.data;
};

// Lấy lịch làm việc của bác sĩ
export const getWorkSchedules = async (doctorId) => {
  const res = await axiosClient.get(`/staff/${doctorId}/work-schedules`);
  return res.data;
};

// Lấy các khung giờ trống trong lịch làm việc
export const getAvailableSlots = async (scheduleId) => {
  const res = await axiosClient.get(`/appointment/work-schedule/${scheduleId}/slots`);
  return res.data;
};

// Đặt lịch khám (bệnh nhân đã đăng nhập)
export const bookAppointment = async (dto) => {
  const res = await axiosClient.post("/appointment/book", dto);
  return res.data;
};

// Đặt lịch khám (khách chưa đăng nhập)
export const guestBookAppointment = async (dto) => {
  const res = await axiosClient.post("/appointment/guest-book", dto);
  return res.data;
};
